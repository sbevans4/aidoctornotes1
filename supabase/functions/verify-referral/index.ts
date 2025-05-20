
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyReferralRequest {
  email: string;
  code: string;
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
    const { email, code }: VerifyReferralRequest = await req.json();
    
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and code are required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check rate limiting
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
    
    // Check attempts in the last hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { data: attemptData, error: attemptError } = await supabase
      .from('referral_verification_attempts')
      .select('count')
      .eq('ip_address', ipAddress)
      .gt('created_at', oneHourAgo.toISOString())
      .single();

    if (attemptError && attemptError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking verification attempts:', attemptError);
    }
    
    const attempts = attemptData?.count || 0;
    if (attempts >= 10) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { 
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Record this attempt
    await supabase
      .from('referral_verification_attempts')
      .insert({ ip_address: ipAddress });
    
    // Verify the referral code against the database
    const { data: invite, error: inviteError } = await supabase
      .from('referral_invites')
      .select('id, referrer_id, status, code')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .single();

    if (inviteError || !invite) {
      return new Response(
        JSON.stringify({ error: "Invalid referral code or email" }),
        { 
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (invite.status === 'completed') {
      return new Response(
        JSON.stringify({ error: "This referral has already been used" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Update the invite status
    await supabase
      .from('referral_invites')
      .update({ status: 'verified', updated_at: new Date().toISOString() })
      .eq('id', invite.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Referral code verified successfully",
        referrerId: invite.referrer_id,
        inviteId: invite.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`[VERIFY-REFERRAL] Unexpected error:`, error);
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
