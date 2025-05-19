
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const { email, referrerName, code } = await req.json();
    
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and referral code are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Validate email format
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Prevent sending to disposable email domains (basic implementation)
    const disposableDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com', 'throwawaymail.com'];
    const emailDomain = email.split('@')[1];
    if (disposableDomains.includes(emailDomain)) {
      return new Response(
        JSON.stringify({ error: "Disposable email addresses are not allowed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create Supabase client to check if email already has a pending invite
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Check if email already has a pending invite
    const { data: existingInvites, error: queryError } = await supabase
      .from('referral_invites')
      .select('id, created_at')
      .eq('email', email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error(`[SEND-REFERRAL-EMAIL] Database query error:`, queryError);
      return new Response(
        JSON.stringify({ error: "Error checking previous invites" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // If there's an existing invite less than 48 hours old, don't send another
    if (existingInvites && existingInvites.length > 0) {
      const lastInvite = new Date(existingInvites[0].created_at);
      const now = new Date();
      const hoursSinceLastInvite = (now.getTime() - lastInvite.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastInvite < 48) {
        return new Response(
          JSON.stringify({ 
            error: "An invitation was already sent to this email within the last 48 hours",
            lastSent: lastInvite
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
        );
      }
    }
    
    // In a real implementation, you would send an email here using a service like
    // AWS SES, SendGrid, or other email service. For now, we'll just log it.
    console.log(`[SEND-REFERRAL-EMAIL] Sending referral email to ${email} with code ${code} from ${referrerName}`);
    
    // Email content template
    const emailContent = {
      to: email,
      subject: `${referrerName} has invited you to try ConvoNotes Genius`,
      body: `
        <h1>You've Been Invited!</h1>
        <p>${referrerName} thinks you'd love ConvoNotes Genius - the AI-powered therapy notes solution.</p>
        <p>Sign up using this special code and you'll receive a 20% discount on your subscription:</p>
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <span style="font-size: 18px; font-weight: bold; letter-spacing: 1px;">${code}</span>
        </div>
        <p><a href="https://aidoctornotes.com/signup?ref=${code}" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Sign Up Now</a></p>
        <p>This offer is valid for 30 days.</p>
      `
    };
    
    // Log the email content for debugging
    console.log("[SEND-REFERRAL-EMAIL] Email content prepared:", emailContent);
    
    return new Response(
      JSON.stringify({ success: true, message: "Email will be sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[SEND-REFERRAL-EMAIL] Error: ${errorMessage}`);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
