
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get JWT token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization token" }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    // Client for authenticated user operations
    const userToken = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${userToken}` } }
    });
    
    // Client with admin privileges for cross-user lookups
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[GET-REFERRAL-STATS] Auth error:', userError);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Count total referrals
    const { count: totalReferrals, error: countError } = await supabase
      .from('referral_invites')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id);

    if (countError) {
      console.error('[GET-REFERRAL-STATS] Error counting referrals:', countError);
      throw new Error("Failed to count referrals");
    }

    // Count pending referrals
    const { count: pendingReferrals, error: pendingError } = await supabase
      .from('referral_invites')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id)
      .eq('status', 'pending');

    if (pendingError) {
      console.error('[GET-REFERRAL-STATS] Error counting pending:', pendingError);
      throw new Error("Failed to count pending referrals");
    }

    // Count completed referrals
    const { count: completedReferrals, error: completedError } = await supabase
      .from('referral_invites')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id)
      .eq('status', 'completed');

    if (completedError) {
      console.error('[GET-REFERRAL-STATS] Error counting completed:', completedError);
      throw new Error("Failed to count completed referrals");
    }
    
    // Count successful conversions and calculate earnings
    const { count: successfulConversions, error: conversionError } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id)
      .eq('status', 'completed')
      .eq('discount_applied', true);

    if (conversionError) {
      console.error('[GET-REFERRAL-STATS] Error counting conversions:', conversionError);
      throw new Error("Failed to count conversions");
    }

    // Get recent referrals
    const { data: recentReferrals, error: recentError } = await supabase
      .from('referral_invites')
      .select('id, email, status, created_at')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('[GET-REFERRAL-STATS] Error getting recent referrals:', recentError);
      throw new Error("Failed to get recent referrals");
    }

    // Calculate monthly referrals for charts
    const { data: monthlyData, error: monthlyError } = await supabase
      .from('referral_invites')
      .select('created_at')
      .eq('referrer_id', user.id);

    if (monthlyError) {
      console.error('[GET-REFERRAL-STATS] Error getting monthly data:', monthlyError);
      throw new Error("Failed to get monthly referral data");
    }

    // Process monthly data
    const monthlyReferrals: Record<string, number> = {};
    monthlyData?.forEach(item => {
      const date = new Date(item.created_at);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (monthlyReferrals[monthYear]) {
        monthlyReferrals[monthYear]++;
      } else {
        monthlyReferrals[monthYear] = 1;
      }
    });

    // Get user's referral code if it exists
    const { data: codeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', user.id)
      .single();

    const code = codeData?.code || null;

    // Get active discount if exists
    const { data: discountData, error: discountError } = await supabase
      .from('referrals')
      .select('discount_percentage, expires_at')
      .eq('referred_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Return all stats in a combined response
    return new Response(
      JSON.stringify({
        userId: user.id,
        totalReferrals: totalReferrals || 0,
        pendingReferrals: pendingReferrals || 0,
        completedReferrals: completedReferrals || 0,
        successfulConversions: successfulConversions || 0,
        earnings: successfulConversions ? successfulConversions * 10 : 0, // $10 per successful referral
        recentReferrals: recentReferrals || [],
        monthlyReferrals,
        code,
        activeDiscount: discountData?.discount_percentage || null,
        expiryDate: discountData?.expires_at || null,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error('[GET-REFERRAL-STATS] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
