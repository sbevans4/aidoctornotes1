
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
