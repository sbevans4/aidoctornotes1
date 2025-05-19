
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

interface AnalysisResult {
  id: string;
  type: string;
  findings: string;
  confidence: number;
  detailedFindings: Array<{
    name: string;
    probability: number;
    description: string;
  }>;
  suggestedCodes: string[];
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
    
    // Check if the user has access to image analysis feature using a direct query
    // instead of the RPC call that expects user_id parameter
    const { data: userProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !userProfiles) {
      throw new Error("User profile not found");
    }
    
    const { data: rolePermissions, error: roleError } = await supabase
      .from('roles')
      .select('permissions')
      .eq('role', userProfiles.role)
      .single();
    
    if (roleError || !rolePermissions) {
      throw new Error("Role permissions not found");
    }
    
    const hasAccess = rolePermissions.permissions?.image_analysis === true;
    
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
    // In a production environment, you would call a service like Google Cloud Vision API
    // or a specialized medical imaging API
    
    // Mock analysis for demonstration
    const mockAnalysis: AnalysisResult = {
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
    
    // Log the analysis request (without the image data for privacy)
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "image_analysis",
      resource_type: "medical_image",
      resource_id: analysisId,
      details: { note_id: requestData.noteId || null }
    });
    
    // Return the analysis result
    return new Response(JSON.stringify(mockAnalysis), {
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
