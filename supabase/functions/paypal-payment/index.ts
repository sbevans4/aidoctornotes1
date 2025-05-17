
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client
const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Get PayPal access token for API calls
const getPayPalAccessToken = async () => {
  const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
  const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
  const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get access token: ${error.error_description}`);
  }
  
  const data = await response.json();
  return data.access_token;
};

// Create PayPal order
const createPayPalOrder = async (req: Request) => {
  try {
    // Get authenticated user
    const supabaseClient = createSupabaseClient();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    
    if (error || !user) throw new Error('Unauthorized');
    
    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        amount: 1099, // $10.99 in cents
        currency: 'usd'
      })
      .select()
      .single();
      
    if (orderError) throw new Error(`Database error: ${orderError.message}`);
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production
    
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    // Create PayPal order
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '10.99',
            },
            custom_id: order.id, // Link to our order
          },
        ],
        application_context: {
          return_url: `${origin}/payment-success`,
          cancel_url: `${origin}/payment-canceled`,
        },
      }),
    });
    
    const paypalOrder = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal error: ${paypalOrder.details?.[0]?.description || 'Unknown error'}`);
    }
    
    return new Response(
      JSON.stringify({ 
        id: paypalOrder.id, 
        links: paypalOrder.links 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err) {
    console.error('Create order error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
};

// Capture PayPal payment
const capturePayPalOrder = async (req: Request) => {
  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error('Order ID is required');
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production
    
    // Capture the payment
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal capture error: ${data.details?.[0]?.description || 'Unknown error'}`);
    }
    
    // Get our order ID from PayPal's response
    const customId = data.purchase_units[0].custom_id;
    
    // Update order status in database
    const supabaseClient = createSupabaseClient();
    const { error } = await supabaseClient
      .from('orders')
      .update({ 
        status: 'completed', 
        paypal_order_id: orderId 
      })
      .eq('id', customId);
      
    if (error) throw new Error(`Database update error: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        status: 'success', 
        data: {
          orderId,
          captureId: data.purchase_units[0].payments.captures[0].id
        } 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err) {
    console.error('Capture payment error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
};

// Main handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get the action from the URL path
  const url = new URL(req.url);
  const action = url.pathname.split('/').pop();
  
  switch (action) {
    case 'create':
      return createPayPalOrder(req);
    case 'capture':
      return capturePayPalOrder(req);
    default:
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
  }
});
