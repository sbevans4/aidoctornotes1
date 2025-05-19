
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Check if user has image analysis permission (premium feature)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }

    if (profileData?.role !== 'premium' && profileData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ 
          error: 'Feature not available', 
          message: 'Image analysis requires a premium subscription'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      );
    }

    // Get request data
    const { imageBase64, noteId } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // For now, we'll simulate image analysis since we don't have actual image analysis integration
    // In a real implementation, this would call Google Cloud Vision API or AWS Rekognition
    
    // Create a mock image analysis result (in a real app, this would be the result from an image analysis service)
    const mockAnalysisResult = {
      type: "X-ray",
      findings: "No evidence of fracture or dislocation. Pulmonary fields are clear. Heart size is normal.",
      confidence: 0.92
    };

    // Store image information (in a real app, you would upload the image to S3)
    const { data: imageData, error: imageError } = await supabase
      .from('medical_images')
      .insert({
        user_id: user.id,
        note_id: noteId || null,
        image_path: 'simulated_path/xray_1.jpg', // Simulated path
        analysis_result: mockAnalysisResult
      })
      .select();

    if (imageError) {
      console.error('Error storing image data:', imageError);
      throw imageError;
    }

    // Create an audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'analyze_image',
        resource_type: 'image',
        resource_id: imageData?.[0]?.id,
        details: { note_id: noteId }
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue despite error in audit logging
    }

    // Return the analysis result
    return new Response(
      JSON.stringify(mockAnalysisResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error analyzing image:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
