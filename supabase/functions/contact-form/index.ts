
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting implementation (simple in-memory approach)
const rateLimits = new Map<string, { count: number; timestamp: number }>()
const MAX_REQUESTS = 5 // Maximum 5 requests per hour
const HOUR_IN_MS = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimits.get(ip)
  
  if (!record) {
    rateLimits.set(ip, { count: 1, timestamp: now })
    return false
  }
  
  if (now - record.timestamp > HOUR_IN_MS) {
    // Reset if more than an hour has passed
    rateLimits.set(ip, { count: 1, timestamp: now })
    return false
  }
  
  if (record.count >= MAX_REQUESTS) {
    return true
  }
  
  record.count++
  return false
}

interface ContactRequest {
  name: string
  email: string
  phone?: string
  organization?: string
  subject: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Rate limit exceeded. Please try again later.' 
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const contactData: ContactRequest = await req.json()
    
    // Input validation
    if (!contactData.name || !contactData.email || !contactData.message || !contactData.subject) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactData.email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client with service role key (for admin access)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Store in database
    const { error: dbError } = await supabaseAdmin
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

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save contact submission')
    }

    // Send email notification using Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    
    await resend.emails.send({
      from: 'AIDoctorNotes <notifications@aidoctornotes.com>',
      to: ['support@aidoctornotes.com'],
      subject: `New Contact Form: ${contactData.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
        ${contactData.organization ? `<p><strong>Organization:</strong> ${contactData.organization}</p>` : ''}
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // Send confirmation to the user
    await resend.emails.send({
      from: 'AIDoctorNotes <support@aidoctornotes.com>',
      to: [contactData.email],
      subject: 'We received your message - AIDoctorNotes',
      html: `
        <h1>Thank you for contacting us!</h1>
        <p>Hello ${contactData.name},</p>
        <p>We've received your message regarding "${contactData.subject}" and will get back to you as soon as possible.</p>
        <p>Your message has been assigned a tracking number and our support team will review it shortly.</p>
        <p>Best regards,<br>The AIDoctorNotes Team</p>
      `,
    })

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully! We\'ll get back to you soon.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'An error occurred while processing your message. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
