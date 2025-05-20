
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
    const { email, code } = await req.json();
    
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and verification code are required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create Supabase client using service role key to bypass RLS policies
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Check if the invite exists and matches the email and code
    const { data: invite, error: inviteError } = await supabase
      .from('referral_invites')
      .select('id, referrer_id, code')
      .eq('email', email)
      .eq('code', code)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      console.error('[VERIFY-REFERRAL] No matching invite found:', inviteError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification code" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Mark the invitation as verified
    const { error: updateError } = await supabase
      .from('referral_invites')
      .update({ status: 'verified' })
      .eq('id', invite.id);

    if (updateError) {
      console.error('[VERIFY-REFERRAL] Error updating invite status:', updateError);
      return new Response(
        JSON.stringify({ error: "Failed to verify the invitation" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Referral code verified successfully", 
        referrerId: invite.referrer_id,
        code: invite.code
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error('[VERIFY-REFERRAL] Unexpected error:', error);
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
