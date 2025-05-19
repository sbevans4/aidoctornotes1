
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature || !endpointSecret) {
      logStep("Missing signature or endpoint secret");
      return new Response(JSON.stringify({ error: "Missing signature or endpoint secret" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get the request body as text
    const body = await req.text();
    
    // Verify the signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      logStep(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Handle the event
    logStep(`Processing event: ${event.type}`);
    
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      
      if (orderId) {
        // Update order status in the database
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ 
            status: "completed", 
            stripe_session_id: session.id 
          })
          .eq("id", orderId);
        
        if (error) {
          logStep(`Error updating order: ${error.message}`);
          throw new Error(`Error updating order: ${error.message}`);
        }
        
        logStep(`Order ${orderId} marked as completed`);
      }
    }
    
    // Handle subscription creation - this is where we process referrals
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      
      // Get customer to find the user
      const customer = await stripe.customers.retrieve(customerId as string);
      if (!customer || customer.deleted) {
        logStep("Customer not found or deleted");
        throw new Error("Customer not found or deleted");
      }
      
      const customerEmail = customer.email;
      if (!customerEmail) {
        logStep("Customer email not found");
        throw new Error("Customer email not found");
      }
      
      // Find the user in our database
      const { data: userData, error: userError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", customerEmail)
        .single();
        
      if (userError || !userData) {
        logStep(`User not found for email ${customerEmail}`);
        // This is not critical, so we'll continue
      } else {
        const userId = userData.id;
        logStep(`Found user ${userId} for subscription`);
        
        // Check if this user was referred
        const { data: referralData, error: referralError } = await supabaseAdmin
          .from("referral_invites")
          .select("referrer_id, code")
          .eq("email", customerEmail)
          .eq("status", "pending")
          .single();
          
        if (!referralError && referralData) {
          const referrerId = referralData.referrer_id;
          
          logStep(`User was referred by ${referrerId}`, { referralData });
          
          // Create a completed referral record
          const { error: insertError } = await supabaseAdmin
            .from("referrals")
            .insert({
              referrer_id: referrerId,
              referred_id: userId,
              status: "completed",
              discount_applied: true,
              discount_percentage: 20, // 20% discount for referred users
              subscription_duration: "3 mons" // 3 months duration
            });
            
          if (insertError) {
            logStep(`Error creating referral: ${insertError.message}`);
          } else {
            logStep("Referral record created successfully");
            
            // Mark the invitation as completed
            await supabaseAdmin
              .from("referral_invites")
              .update({ status: "completed" })
              .eq("email", customerEmail)
              .eq("referrer_id", referrerId);
              
            // Send notification to the referrer (would typically be done via a separate function)
            try {
              await supabaseAdmin.functions.invoke('send-referral-email', {
                body: { 
                  type: 'conversion_success',
                  referrerId: referrerId,
                  referredEmail: customerEmail
                }
              });
              logStep("Referral notification sent successfully");
            } catch (notifyError) {
              logStep(`Error sending referral notification: ${notifyError instanceof Error ? notifyError.message : 'Unknown error'}`);
            }
            
            logStep("Referral process completed");
          }
        }
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep(`Webhook error: ${errorMessage}`);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
