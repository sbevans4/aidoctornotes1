
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Client, Environment } from 'https://sdk.squareup.com/square.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, planId, email } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize Square client with production credentials
    const squareClient = new Client({
      accessToken: Deno.env.get('SQUARE_PRODUCTION_ACCESS_TOKEN'),
      environment: Environment.Production,
    });

    if (action === 'get_app_id') {
      return new Response(
        JSON.stringify({
          SQUARE_SANDBOX_APP_ID: Deno.env.get('SQUARE_PRODUCTION_APP_ID'),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'create_subscription') {
      // Get the plan details
      const { data: plan, error: planError } = await supabaseClient
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      // Create a customer in Square
      const { result: customerResult } = await squareClient.customersApi.createCustomer({
        emailAddress: email,
        idempotencyKey: crypto.randomUUID(),
      });

      if (!customerResult.customer) {
        throw new Error('Failed to create customer');
      }

      // Create a subscription
      const { result: subscriptionResult } = await squareClient.subscriptionsApi.createSubscription({
        customerId: customerResult.customer.id,
        planId: plan.square_plan_id,
        startDate: new Date().toISOString(),
        idempotencyKey: crypto.randomUUID(),
      });

      if (!subscriptionResult.subscription) {
        throw new Error('Failed to create subscription');
      }

      // Store the subscription in our database
      const { error: subscriptionError } = await supabaseClient
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          provider: 'square',
          provider_subscription_id: subscriptionResult.subscription.id,
          status: subscriptionResult.subscription.status,
        });

      if (subscriptionError) throw subscriptionError;

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error) {
    console.error('Square function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
