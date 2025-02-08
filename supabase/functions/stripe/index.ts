
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const { action, ...body } = await req.json()
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'create_payment_method': {
        const { paymentMethodId, userId } = body
        
        // Retrieve the payment method to get card details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
        
        if (paymentMethod.type !== 'card') {
          throw new Error('Unsupported payment method type')
        }

        // Store payment method in database
        const { error } = await supabaseClient
          .from('payment_methods')
          .insert({
            user_id: userId,
            type: 'credit_card',
            stripe_payment_method_id: paymentMethodId,
            last_four: paymentMethod.card?.last4,
          })

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'create_subscription': {
        const { paymentMethodId, userId, planId } = body

        // Get plan details from database
        const { data: plan, error: planError } = await supabaseClient
          .from('subscription_plans')
          .select('*')
          .eq('id', planId)
          .single()

        if (planError || !plan) throw new Error('Plan not found')

        // Create a customer in Stripe
        const customer = await stripe.customers.create({
          payment_method: paymentMethodId,
          email: body.email,
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        })

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: plan.stripe_price_id }],
          payment_settings: {
            payment_method_types: ['card'],
            save_default_payment_method: 'on_subscription',
          },
          expand: ['latest_invoice.payment_intent'],
        })

        // Update the subscription in our database
        const { error: subError } = await supabaseClient
          .from('user_subscriptions')
          .update({
            stripe_subscription_id: subscription.id,
            status: subscription.status,
          })
          .eq('user_id', userId)
          .eq('plan_id', planId)

        if (subError) throw subError

        return new Response(
          JSON.stringify({ 
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Stripe function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
