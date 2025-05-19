
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

    // Check if user is within their note limit
    const { data: limitData, error: limitError } = await supabase.rpc(
      'check_note_limit', 
      { user_uuid: user.id }
    );

    if (limitError) {
      console.error('Error checking note limit:', limitError);
      throw limitError;
    }

    if (!limitData) {
      return new Response(
        JSON.stringify({ 
          error: 'Limit exceeded', 
          message: 'You have reached your monthly note limit. Please upgrade to premium for unlimited notes.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      );
    }

    // Get request data
    const requestData = await req.json();
    const audioBase64 = requestData.audio;
    
    if (!audioBase64) {
      return new Response(
        JSON.stringify({ error: 'Audio data is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // For now, we'll simulate transcription since we don't have actual AWS or Google Cloud integration
    // In a real implementation, this would call AWS Transcribe Medical or Google Speech-to-Text
    
    // Create a mock transcription (in a real app, this would be the result from a transcription service)
    const mockTranscription = "Patient reports chest pain for the past 2 days, radiating to the left arm. " +
                      "Pain is described as 7/10, worse with exertion. Patient also notes shortness of breath " +
                      "when climbing stairs. No previous cardiac history. Vital signs show BP 140/90, " +
                      "heart rate 92, respiratory rate 18, temperature 98.6F. Heart exam shows regular rhythm " +
                      "with no murmurs. Lungs clear bilaterally.";
    
    // Record the usage
    const { error: usageError } = await supabase.from('usage').insert({
      user_id: user.id,
      feature: 'note_generation'
    });

    if (usageError) {
      console.error('Error recording usage:', usageError);
      // Continue despite error in recording usage
    }
    
    // Create a note record
    const { data: noteData, error: noteError } = await supabase.from('notes').insert({
      user_id: user.id,
      title: "Medical Note - " + new Date().toLocaleString(),
      transcription: mockTranscription,
      status: 'draft'
    }).select();

    if (noteError) {
      console.error('Error creating note:', noteError);
      throw noteError;
    }

    // Return the transcription
    return new Response(
      JSON.stringify({ 
        id: noteData?.[0]?.id,
        transcription: mockTranscription,
        speakers: [
          { id: "speaker_1", name: "Doctor" },
          { id: "speaker_2", name: "Patient" }
        ],
        segments: [
          { start: 0, end: 10, text: "Patient reports chest pain for the past 2 days...", speaker: "speaker_2" }
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
