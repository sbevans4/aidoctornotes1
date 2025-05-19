
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.22.4";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define the contact form schema using Zod
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactForm = z.infer<typeof ContactFormSchema>;

// Rate limiting helper - uses a simple memory store (would need a Redis implementation in production)
const ipRequests = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5; // Maximum requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    // Reset if outside window
    ipRequests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded
  }

  // Increment count
  ipRequests.set(ip, { count: record.count + 1, timestamp: record.timestamp });
  return true;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Check if request method is POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Check rate limit using the client IP
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later." 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Parse request body
    const contactData: ContactForm = await req.json();

    // Validate the form data
    const validationResult = ContactFormSchema.safeParse(contactData);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: errors 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store the submission in the database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || null,
        organization: contactData.organization || null,
        subject: contactData.subject,
        message: contactData.message,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing contact submission:", error);
      return new Response(
        JSON.stringify({ error: "Failed to store submission" }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // TODO: In the future, implement actual email notification to the support team
    // For now, we'll just log the form submission
    console.log("Contact form submission received:", {
      id: data.id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      timestamp: data.created_at
    });

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent! Our team will contact you soon.",
        id: data.id
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (err) {
    console.error("Unexpected error processing contact form:", err);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred" 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
