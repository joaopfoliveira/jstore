import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key needed for email
);

export async function POST(request: NextRequest) {
    try {
        const { email, customerName, orderCode, items } = await request.json();

        if (!email || !customerName || !orderCode || !items) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const itemsList = items.map((item: any) => 
            `• ${item.product_name} (Size: ${item.size})${item.print ? ` - Custom: ${item.print_name || 'N/A'} #${item.print_number || 'N/A'}` : ''} (Qty: ${item.quantity || 1})`
        ).join('\n');

        const emailBody = `
Hello ${customerName},

Thank you for your order with JStore! 🏆

Your Order Code: ${orderCode}

Order Details:
${itemsList}

You can track your order anytime using your order code at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/track

We will contact you soon to confirm delivery details.

Best regards,
JStore Team
⚽ Premium Football Jerseys
        `.trim();

        // Use Supabase Edge Function for real email sending
        const { data, error: functionError } = await supabase.functions.invoke('send-email', {
            body: {
                email,
                customerName,
                orderCode,
                items
            }
        });

        if (functionError) {
            console.error('Edge function error:', functionError);
            throw new Error(`Failed to send email: ${functionError.message}`);
        }

        console.log("✅ Email sent successfully via Edge Function:", data);

        return NextResponse.json({ 
            success: true, 
            message: 'Email sent successfully' 
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
