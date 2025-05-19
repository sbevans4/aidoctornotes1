
// supabase/functions/analyze-image/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  imageBase64: string;
  noteId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the API key from environment variables
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("API key not found");
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the JWT token from the request headers
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    // Validate the JWT token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }
    
    // Get the user's profile to check their role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profileError || !profile) {
      console.error("Error getting user profile:", profileError);
      throw new Error("User profile not found");
    }
    
    // Check if the user's role has access to image analysis
    const hasAccess = profile.role === 'enterprise';
    
    if (!hasAccess) {
      throw new Error("Feature not available with your current subscription");
    }
    
    // Parse request body
    const requestData: RequestBody = await req.json();
    
    if (!requestData.imageBase64) {
      throw new Error("No image data provided");
    }
    
    // Generate a random ID for this analysis
    const analysisId = crypto.randomUUID();
    
    // Simulate AI analysis of the image (replace with actual AI service)
    // In a production environment, you would call a service like OpenAI's API
    const analysisResult = {
      id: analysisId,
      type: "X-ray",
      findings: "The image appears to show a chest X-ray with no obvious abnormalities. The lung fields are clear, and the cardiac silhouette appears within normal limits.",
      confidence: 0.85,
      detailedFindings: [
        {
          name: "Clear lung fields",
          probability: 0.92,
          description: "No evidence of infiltrates, effusions, or pneumothorax"
        },
        {
          name: "Normal cardiac silhouette",
          probability: 0.88,
          description: "Heart size appears within normal limits"
        },
        {
          name: "No active disease",
          probability: 0.85,
          description: "No findings suggestive of acute cardiopulmonary process"
        }
      ],
      suggestedCodes: ["R93.1", "Z01.89", "Z87.891"]
    };
    
    // Store the analysis in the database
    await supabase.from("image_analyses").insert({
      id: analysisId,
      user_id: user.id,
      findings: analysisResult.findings,
      confidence: analysisResult.confidence,
      detailed_findings: analysisResult.detailedFindings,
      suggested_codes: analysisResult.suggestedCodes
    });
    
    // Log the analysis request (without the image data for privacy)
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "image_analysis",
      resource_type: "medical_image",
      resource_id: analysisId,
      details: { note_id: requestData.noteId || null }
    });
    
    // Return the analysis result
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in analyze-image function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred during image analysis",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.message.includes("Feature not available") ? 403 : 500,
      }
    );
  }
});
