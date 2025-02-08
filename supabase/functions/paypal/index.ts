
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, ...body } = await req.json()
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'create_subscription': {
        const { userId, planId } = body

        // Get plan details from database
        const { data: plan, error: planError } = await supabaseClient
          .from('subscription_plans')
          .select('*')
          .eq('id', planId)
          .single()

        if (planError || !plan) throw new Error('Plan not found')

        // For sandbox testing, we'll use a fixed subscription ID
        const subscriptionId = `test_sub_${Date.now()}`

        // Store subscription in database
        const { error: subError } = await supabaseClient
          .from('user_subscriptions')
          .insert({
            user_id: userId,
            plan_id: planId,
            paypal_subscription_id: subscriptionId,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          })

        if (subError) throw subError

        return new Response(
          JSON.stringify({ subscriptionId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'activate_subscription': {
        const { userId, subscriptionId, planId } = body

        // Update subscription status in database
        const { error: updateError } = await supabaseClient
          .from('user_subscriptions')
          .update({ status: 'active' })
          .eq('user_id', userId)
          .eq('plan_id', planId)
          .eq('paypal_subscription_id', subscriptionId)

        if (updateError) throw updateError

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
