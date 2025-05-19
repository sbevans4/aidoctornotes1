
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

    // Get request data
    const { transcription, noteId } = await req.json();
    
    if (!transcription) {
      return new Response(
        JSON.stringify({ error: 'Transcription is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // For now, we'll simulate SOAP note generation since we don't have actual NLP integration
    // In a real implementation, this would use OpenAI's GPT or another NLP service
    const mockSoapNote = {
      subjective: "Patient reports chest pain for the past 2 days, radiating to the left arm. Pain is described as 7/10, worse with exertion. Patient also notes shortness of breath when climbing stairs. No previous cardiac history.",
      objective: "Vital signs: BP 140/90, HR 92, RR 18, Temp 98.6F. Heart exam: Regular rhythm, no murmurs. Lungs clear bilaterally.",
      assessment: "Acute chest pain concerning for possible angina. Differential diagnosis includes myocardial infarction, unstable angina, musculoskeletal pain, and gastroesophageal reflux disease.",
      plan: "1. ECG\n2. Cardiac enzymes\n3. Chest X-ray\n4. Consider stress test if initial evaluation is negative\n5. Aspirin 325mg PO\n6. Follow up in 2 days or sooner if symptoms worsen"
    };

    // Update the note with the SOAP note content
    if (noteId) {
      const { error: updateError } = await supabase
        .from('notes')
        .update({ 
          soap_note: mockSoapNote,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating note:', updateError);
        throw updateError;
      }
    }

    // Create an audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'generate_soap_note',
        resource_type: 'note',
        resource_id: noteId,
        details: { note_id: noteId }
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue despite error in audit logging
    }

    // Return the SOAP note
    return new Response(
      JSON.stringify({ 
        soap_note: mockSoapNote
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error generating SOAP note:', error);
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
