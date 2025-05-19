
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

serve(async (req) => {
  try {
    // This endpoint should only be called by scheduled cron jobs
    // Check for a special header or secret to ensure it's authorized
    const authHeader = req.headers.get('X-Cleanup-Key');
    const expectedKey = Deno.env.get('CLEANUP_SECRET_KEY');
    
    if (!authHeader || authHeader !== expectedKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Call the cleanup function
    const { data, error } = await supabase.rpc('cleanup_expired_data');
    
    if (error) {
      console.error('Error cleaning up expired data:', error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Expired data cleanup completed'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in cleanup operation:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { status: 500 }
    );
  }
});
