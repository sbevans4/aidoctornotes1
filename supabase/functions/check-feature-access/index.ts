
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { featureName } = await req.json();
    
    // Get the JWT from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Create a Supabase client with the user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Get the user from their JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      throw userError;
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Call the has_feature RPC function
    const { data, error } = await supabaseClient.rpc('has_feature', {
      user_id: user.id,
      feature_name: featureName
    });
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        hasAccess: data,
        featureName,
        userId: user.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
