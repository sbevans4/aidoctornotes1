
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
    const requestData = await req.json();
    const { transcription, refresh = false } = requestData;
    
    if (!transcription) {
      return new Response(
        JSON.stringify({ error: 'Transcription is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    // Check for cached codes unless refresh is true
    if (!refresh) {
      // First check if we have cached procedure codes for this user
      const { data: cachedCodes, error: cacheError } = await supabase
        .from('procedure_codes')
        .select('code, frequency')
        .eq('user_id', user.id)
        .order('frequency', { ascending: false })
        .limit(5);
      
      if (!cacheError && cachedCodes && cachedCodes.length > 0) {
        console.log("Using cached procedure codes for user");
        return new Response(
          JSON.stringify({ 
            success: true,
            codes: cachedCodes.map(item => item.code),
            source: 'cache'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }
    
    // No cached codes found or refresh requested, call DeepSeek API to suggest codes
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!deepseekApiKey) {
      throw new Error('DeepSeek API key not found in environment variables');
    }
    
    const systemPrompt = `
      You are a medical coding assistant. Based on the provided transcription of a
      medical conversation, suggest up to 5 appropriate procedure codes (CPT or ICD-10)
      that are likely relevant. Return only the codes without descriptions.
    `;
    
    const userPrompt = `
      Based on this transcription, what procedure codes would be most appropriate?
      
      Transcription: ${transcription}
      
      Return a JSON array of only code strings, like: ["E11.9", "Z79.4", "I10"]
    `;
    
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });
    
    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      throw new Error(`DeepSeek API error: ${errorText}`);
    }
    
    const deepseekResult = await deepseekResponse.json();
    const suggestedCodesText = deepseekResult.choices[0].message.content;
    
    // Parse the codes from JSON string
    let suggestedCodes;
    try {
      const parsedResponse = JSON.parse(suggestedCodesText);
      
      // Try to extract codes from the response
      if (Array.isArray(parsedResponse)) {
        suggestedCodes = parsedResponse;
      } else if (parsedResponse.codes && Array.isArray(parsedResponse.codes)) {
        suggestedCodes = parsedResponse.codes;
      } else {
        // Try to extract codes from any property that's an array
        suggestedCodes = [];
        for (const key in parsedResponse) {
          if (Array.isArray(parsedResponse[key]) && parsedResponse[key].length > 0) {
            suggestedCodes = parsedResponse[key];
            break;
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing suggested codes:', parseError);
      suggestedCodes = [];
    }
    
    // Filter out non-string values and ensure codes look valid
    suggestedCodes = suggestedCodes
      .filter(code => typeof code === 'string')
      .filter(code => /^[A-Z0-9\.\-]{2,10}$/i.test(code.trim()))
      .map(code => code.trim().toUpperCase());
    
    // Ensure we have at least some codes
    if (suggestedCodes.length === 0) {
      suggestedCodes = ["E11.9", "I10", "Z79.4"]; // Default fallback codes
    }
    
    // Store the suggested codes in the database for future caching
    for (const code of suggestedCodes) {
      try {
        const { error: insertError } = await supabase.from('procedure_codes').upsert({
          user_id: user.id,
          code: code,
          frequency: 1
        }, {
          onConflict: 'user_id, code',
          ignoreDuplicates: false
        });
        
        if (insertError) console.error('Error caching procedure code:', insertError);
      } catch (error) {
        console.error('Error upserting procedure code:', error);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        codes: suggestedCodes,
        source: 'deepseek'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error suggesting procedure codes:', error);
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
