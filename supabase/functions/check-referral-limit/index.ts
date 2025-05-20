
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RateLimitRequest {
  userId: string;
}

serve(async (req: Request) => {
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

    // Get request data
    const { userId }: RateLimitRequest = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Get the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the start of this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Count invites sent today
    const { count: dailyCount, error: dailyError } = await supabase
      .from('referral_invites')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .gte('created_at', today.toISOString());

    if (dailyError) {
      console.error("Error counting daily invites:", dailyError);
      throw new Error("Failed to check daily rate limit");
    }

    // Count invites sent this month
    const { count: monthlyCount, error: monthlyError } = await supabase
      .from('referral_invites')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    if (monthlyError) {
      console.error("Error counting monthly invites:", monthlyError);
      throw new Error("Failed to check monthly rate limit");
    }

    // Define rate limits
    const dailyLimit = 10;  // Max 10 invites per day
    const monthlyLimit = 50; // Max 50 invites per month

    const response = {
      canSendMore: dailyCount < dailyLimit && monthlyCount < monthlyLimit,
      dailyRemaining: Math.max(0, dailyLimit - dailyCount),
      monthlyRemaining: Math.max(0, monthlyLimit - monthlyCount),
      dailyLimit,
      monthlyLimit
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`[CHECK-REFERRAL-LIMIT] Unexpected error:`, error);
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
