
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

    const API_USERNAME = Deno.env.get('PAYPAL_API_USERNAME')
    const API_PASSWORD = Deno.env.get('PAYPAL_API_PASSWORD')
    const API_SIGNATURE = Deno.env.get('PAYPAL_API_SIGNATURE')

    if (!API_USERNAME || !API_PASSWORD || !API_SIGNATURE) {
      throw new Error('PayPal credentials not configured')
    }

    const paypalEndpoint = 'https://api-m.paypal.com' // Production endpoint

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

        // Create PayPal subscription
        const createSubResponse = await fetch(`${paypalEndpoint}/v1/billing/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`,
            'PayPal-Partner-Attribution-Id': API_SIGNATURE
          },
          body: JSON.stringify({
            plan_id: plan.paypal_plan_id,
            subscriber: {
              name: {
                given_name: "Subscriber" // This could be updated with actual user data if available
              },
              email_address: "" // This could be updated with actual user email if available
            },
            application_context: {
              return_url: `${req.headers.get('origin')}/success`,
              cancel_url: `${req.headers.get('origin')}/cancel`
            }
          })
        })

        if (!createSubResponse.ok) {
          const error: PayPalError = await createSubResponse.json()
          console.error('PayPal subscription creation error:', error)
          throw new Error(`Failed to create subscription: ${error.message}`)
        }

        const subscription = await createSubResponse.json()
        
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
          })

        if (subError) {
          console.error('Error storing subscription:', subError)
          throw subError
        }

        return new Response(
          JSON.stringify({ subscriptionId: subscription.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'activate_subscription': {
        const { userId, subscriptionId, planId } = body
        console.log('Activating subscription:', subscriptionId, 'for user:', userId)

        // Verify subscription status with PayPal
        const verifyResponse = await fetch(`${paypalEndpoint}/v1/billing/subscriptions/${subscriptionId}`, {
          headers: {
            'Authorization': `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`,
            'PayPal-Partner-Attribution-Id': API_SIGNATURE
          }
        })

        if (!verifyResponse.ok) {
          const error: PayPalError = await verifyResponse.json()
          console.error('PayPal verification error:', error)
          throw new Error(`Failed to verify subscription: ${error.message}`)
        }

        const paypalSubscription = await verifyResponse.json()
        
        if (paypalSubscription.status !== 'ACTIVE') {
          throw new Error(`Invalid subscription status: ${paypalSubscription.status}`)
        }

        // Update subscription status in database
        const { error: updateError } = await supabaseClient
          .from('user_subscriptions')
          .update({ 
            status: 'active',
            current_period_start: paypalSubscription.start_time,
            current_period_end: paypalSubscription.billing_info.next_billing_time
          })
          .eq('user_id', userId)
          .eq('plan_id', planId)
          .eq('paypal_subscription_id', subscriptionId)

        if (updateError) {
          console.error('Error activating subscription:', updateError)
          throw updateError
        }

        console.log('Subscription activated successfully')
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('PayPal function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
