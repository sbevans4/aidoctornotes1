
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayPalError {
  message: string;
  details?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, ...body } = await req.json()
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get PayPal client credentials from environment variables
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured')
    }

    // Use production PayPal endpoint instead of sandbox
    const paypalEndpoint = 'https://api-m.paypal.com'

    // Get access token for API calls
    const getAccessToken = async () => {
      const response = await fetch(`${paypalEndpoint}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
        },
        body: 'grant_type=client_credentials'
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('PayPal token error:', error);
        throw new Error(`Failed to get access token: ${error.error_description}`);
      }
      
      const data = await response.json();
      return data.access_token;
    };

    switch (action) {
      case 'create_subscription': {
        const { userId, planId } = body
        console.log('Creating PayPal subscription for user:', userId, 'plan:', planId)

        // Get plan details from database
        const { data: plan, error: planError } = await supabaseClient
          .from('subscription_plans')
          .select('*')
          .eq('id', planId)
          .single()

        if (planError || !plan) {
          console.error('Plan not found:', planError)
          throw new Error('Plan not found')
        }

        // Get user details for the subscription
        const { data: user, error: userError } = await supabaseClient
          .from('profiles')
          .select('email, full_name')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('User not found:', userError);
          throw new Error('User not found');
        }

        // Create PayPal subscription
        const accessToken = await getAccessToken();
        const createSubResponse = await fetch(`${paypalEndpoint}/v1/billing/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            plan_id: plan.paypal_plan_id,
            subscriber: {
              name: {
                given_name: user.full_name ? user.full_name.split(' ')[0] : "Subscriber",
                surname: user.full_name && user.full_name.split(' ').length > 1 ? user.full_name.split(' ')[1] : ""
              },
              email_address: user.email || ""
            },
            application_context: {
              return_url: `${req.headers.get('origin')}/success`,
              cancel_url: `${req.headers.get('origin')}/cancel`
            }
          })
        });

        if (!createSubResponse.ok) {
          const error: PayPalError = await createSubResponse.json();
          console.error('PayPal subscription creation error:', error);
          throw new Error(`Failed to create subscription: ${error.message}`);
        }

        const subscription = await createSubResponse.json();
        
        // Store subscription in database
        const { error: subError } = await supabaseClient
          .from('user_subscriptions')
          .insert({
            user_id: userId,
            plan_id: planId,
            paypal_subscription_id: subscription.id,
            status: 'pending',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (subError) {
          console.error('Error storing subscription:', subError);
          throw subError;
        }

        return new Response(
          JSON.stringify({ subscriptionId: subscription.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'activate_subscription': {
        const { userId, subscriptionId, planId } = body;
        console.log('Activating subscription:', subscriptionId, 'for user:', userId);

        // Verify subscription status with PayPal
        const accessToken = await getAccessToken();
        const verifyResponse = await fetch(`${paypalEndpoint}/v1/billing/subscriptions/${subscriptionId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });

        if (!verifyResponse.ok) {
          const error: PayPalError = await verifyResponse.json();
          console.error('PayPal verification error:', error);
          throw new Error(`Failed to verify subscription: ${error.message}`);
        }

        const paypalSubscription = await verifyResponse.json();
        
        // Update subscription status in database
        const { error: updateError } = await supabaseClient
          .from('user_subscriptions')
          .update({ 
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('user_id', userId)
          .eq('plan_id', planId)
          .eq('paypal_subscription_id', subscriptionId);

        if (updateError) {
          console.error('Error activating subscription:', updateError);
          throw updateError;
        }

        console.log('Subscription activated successfully');
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('PayPal function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
