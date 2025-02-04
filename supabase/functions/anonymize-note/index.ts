import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { noteId, soapNote } = await req.json() as { noteId: string, soapNote: SoapNote }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create anonymized content
    const anonymizedContent = `SOAP NOTE

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}
`
    const fileName = `soap_note_${crypto.randomUUID()}.txt`
    const filePath = `anonymized_notes/${fileName}`

    // Create storage bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket('anonymized_notes')

    if (!bucketData) {
      await supabase
        .storage
        .createBucket('anonymized_notes', {
          public: false,
          fileSizeLimit: 1024 * 1024, // 1MB
        })
    }

    // Upload anonymized file
    const { error: uploadError } = await supabase
      .storage
      .from('anonymized_notes')
      .upload(fileName, new Blob([anonymizedContent], { type: 'text/plain' }))

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`)
    }

    // Update clinical note with file path
    const { error: updateError } = await supabase
      .from('clinical_notes')
      .update({ anonymized_file_path: filePath })
      .eq('id', noteId)

    if (updateError) {
      throw new Error(`Failed to update clinical note: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({ filePath }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})