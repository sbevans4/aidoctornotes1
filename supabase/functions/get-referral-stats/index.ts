
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ReferralStats = {
  total_referrals: number;
  pending_referrals: number;
  completed_referrals: number;
  successful_conversions: number;
  earnings: number;
  recent_referrals: Array<{
    id: string;
    email: string;
    status: string;
    created_at: string;
  }>;
  monthly_referrals?: {
    [month: string]: number;
  };
  conversion_rate?: number;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client using service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get user ID from request body
    const { user_id } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Call the database function to get referral stats
    const { data, error } = await supabase.rpc('get_referral_stats', { user_id });
    
    if (error) {
      console.error(`[GET-REFERRAL-STATS] Error calling function:`, error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Fetch additional referral data to calculate monthly stats
    const { data: referralInvites, error: invitesError } = await supabase
      .from('referral_invites')
      .select('id, created_at, status')
      .eq('referrer_id', user_id);

    if (invitesError) {
      console.error(`[GET-REFERRAL-STATS] Error fetching invites:`, invitesError);
    }

    // Calculate monthly referrals for the past 6 months
    const monthlyReferrals: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize the last 6 months with zero values
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyReferrals[monthKey] = 0;
    }
    
    // Populate with actual data
    if (referralInvites) {
      referralInvites.forEach(invite => {
        const date = new Date(invite.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        // Only count months in our tracking period
        if (monthlyReferrals[monthKey] !== undefined) {
          monthlyReferrals[monthKey]++;
        }
      });
    }

    // Calculate conversion rate
    const conversionRate = data.total_referrals > 0 
      ? (data.successful_conversions / data.total_referrals) * 100
      : 0;

    // Enhance the stats with additional data
    const enhancedStats: ReferralStats = {
      ...data,
      monthly_referrals: monthlyReferrals,
      conversion_rate: parseFloat(conversionRate.toFixed(2))
    };

    // Return the stats with additional metadata
    return new Response(
      JSON.stringify({
        ...enhancedStats,
        retrieved_at: new Date().toISOString(),
        version: '1.2'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`[GET-REFERRAL-STATS] Unexpected error:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
