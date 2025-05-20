
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    
    // Check if user has transcription feature access
    const { data: userFeatures, error: featureError } = await supabase.rpc(
      'has_feature', 
      { user_id: user.id, feature_name: 'soap_notes' }
    );
    
    if (featureError) {
      console.error('Error checking feature access:', featureError);
      return new Response(
        JSON.stringify({ error: 'Unable to verify feature access' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    if (!userFeatures) {
      return new Response(
        JSON.stringify({ error: 'Your subscription does not include this feature' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      );
    }

    // Get request data - for now we'll use the OpenAI API directly
    const formData = await req.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile || !(audioFile instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'Audio file is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Convert File to ArrayBuffer
    const audioBuffer = await audioFile.arrayBuffer();
    
    // Create form data for OpenAI API
    const openAIFormData = new FormData();
    const openAIFile = new File([audioBuffer], 'audio.webm', { type: audioFile.type });
    openAIFormData.append('file', openAIFile);
    openAIFormData.append('model', 'whisper-1');
    
    // Call OpenAI API for transcription
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: openAIFormData
    });
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }
    
    const transcriptionResult = await openaiResponse.json();
    const transcriptionText = transcriptionResult.text;
    
    // Store the transcription in the database
    const { data: noteData, error: noteError } = await supabase.from('notes').insert({
      user_id: user.id,
      title: "Medical Note - " + new Date().toLocaleString(),
      transcription: transcriptionText,
      status: 'draft'
    }).select();
    
    if (noteError) {
      console.error('Error creating note:', noteError);
      throw noteError;
    }
    
    // Return the transcription
    return new Response(
      JSON.stringify({ 
        success: true, 
        noteId: noteData?.[0]?.id,
        transcription: transcriptionText,
        speakers: [
          { id: "speaker_1", name: "Doctor" },
          { id: "speaker_2", name: "Patient" }
        ],
        segments: [
          { 
            start: 0, 
            end: 30, 
            text: transcriptionText,
            speaker: "speaker_1" 
          }
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing audio transcription:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
