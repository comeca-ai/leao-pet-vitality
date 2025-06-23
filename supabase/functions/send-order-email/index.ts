
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { OrderConfirmationEmail } from "./_templates/order-confirmation.tsx";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderEmailRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  emailType?: 'confirmation' | 'payment_success' | 'payment_failed' | 'whatsapp_created';
  whatsappLink?: string;
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const {
      customerName,
      customerEmail,
      orderNumber,
      orderTotal,
      orderItems,
      emailType = 'confirmation',
      whatsappLink
    }: OrderEmailRequest = await req.json();

    console.log('Sending order email:', {
      customerEmail,
      orderNumber,
      emailType
    });

    // Validate required fields
    if (!customerName || !customerEmail || !orderNumber || !orderItems) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Render email template
    const emailHtml = await renderAsync(
      React.createElement(OrderConfirmationEmail, {
        customerName,
        orderNumber,
        orderTotal,
        orderItems,
        customerEmail,
        emailType,
        whatsappLink,
      })
    );

    // Determine subject based on email type
    let subject = '';
    switch (emailType) {
      case 'confirmation':
        subject = `✅ Pedido Confirmado #${orderNumber} - Juba de Leão`;
        break;
      case 'payment_success':
        subject = `💳 Pagamento Aprovado #${orderNumber} - Juba de Leão`;
        break;
      case 'payment_failed':
        subject = `❌ Problema no Pagamento #${orderNumber} - Juba de Leão`;
        break;
      case 'whatsapp_created':
        subject = `📱 Pedido via WhatsApp #${orderNumber} - Juba de Leão`;
        break;
      default:
        subject = `Pedido #${orderNumber} - Juba de Leão`;
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Juba de Leão <noreply@resend.dev>',
      to: [customerEmail],
      subject,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data?.id,
        message: 'Email sent successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Send email function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
