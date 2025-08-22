import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, customerName, orderCode, items } = await req.json()

    if (!email || !customerName || !orderCode || !items) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Format items list
    const itemsList = items.map((item: any) => 
      `• ${item.product_name} (Size: ${item.size})${item.print ? ` - Custom: ${item.print_name || 'N/A'} #${item.print_number || 'N/A'}` : ''} (Qty: ${item.quantity || 1})`
    ).join('\n')

    // Create email content
    const subject = `JStore Order Confirmation - ${orderCode}`
    const emailBody = `Hello ${customerName},

Thank you for your order with JStore! 🏆

Your Order Code: ${orderCode}

Order Details:
${itemsList}

You can track your order anytime using your order code at: https://your-domain.com/track

We will contact you soon to confirm delivery details.

Best regards,
JStore Team
🏅 JPlus`

    // Send email using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'JStore <onboarding@resend.dev>', // Resend sandbox domain for testing
        to: [email],
        subject: subject,
        text: emailBody,
        html: `<pre style="font-family: Arial, sans-serif; line-height: 1.6;">${emailBody.replace(/\n/g, '<br>')}</pre>`,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Resend API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: emailResult.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
