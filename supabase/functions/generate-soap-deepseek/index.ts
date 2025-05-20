
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
    
    // Parse request body
    const { transcription, noteId, procedureCodes = [], templateId = "general" } = await req.json();
    
    if (!transcription) {
      return new Response(
        JSON.stringify({ error: 'Transcription is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    // Call DeepSeek API to generate SOAP note
    const systemPrompt = `
      You are a medical documentation specialist helping healthcare providers create SOAP notes.
      Based on the provided transcription and procedure codes, generate a well-structured SOAP note.
      
      Format your response as a JSON object with these fields:
      - subjective: Patient's history, complaints, and self-reported symptoms
      - objective: Physical examination findings, vital signs, and test results
      - assessment: Diagnosis, differential diagnoses, and clinical reasoning
      - plan: Treatment plan, medications, follow-up instructions, and recommendations
      
      Focus on medically relevant information and ensure the documentation properly justifies the procedure codes if provided.
      Maintain HIPAA compliance by avoiding any patient-identifying information.
      Make the note concise but comprehensive enough for billing and medical record purposes.
    `;
    
    const userPrompt = `
      Transcription: ${transcription}
      ${procedureCodes.length > 0 ? `Procedure Codes: ${procedureCodes.join(', ')}` : ''}
      
      Please generate a complete SOAP note based on this information.
    `;
    
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!deepseekApiKey) {
      throw new Error('DeepSeek API key not found in environment variables');
    }
    
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Update with the appropriate DeepSeek model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });
    
    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      throw new Error(`DeepSeek API error: ${errorText}`);
    }
    
    const deepseekResult = await deepseekResponse.json();
    const soapNoteText = deepseekResult.choices[0].message.content;
    
    // Parse the SOAP note from JSON string
    let soapNote;
    try {
      soapNote = JSON.parse(soapNoteText);
    } catch (parseError) {
      console.error('Error parsing SOAP note JSON:', parseError);
      throw new Error('Failed to parse DeepSeek response');
    }
    
    // Update the note with the SOAP note content if noteId is provided
    if (noteId) {
      const { error: updateError } = await supabase
        .from('notes')
        .update({ 
          soap_note: soapNote,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating note:', updateError);
        throw updateError;
      }
    } else {
      // If no noteId, create a new note
      const { error: insertError } = await supabase
        .from('notes')
        .insert({ 
          user_id: user.id,
          title: "Medical Note - " + new Date().toLocaleString(),
          transcription: transcription,
          soap_note: soapNote,
          status: 'completed'
        });

      if (insertError) {
        console.error('Error creating note:', insertError);
        throw insertError;
      }
    }

    // Return the SOAP note
    return new Response(
      JSON.stringify({ 
        success: true,
        soap_note: soapNote
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
