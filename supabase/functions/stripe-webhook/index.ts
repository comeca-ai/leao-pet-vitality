
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || "", {
      apiVersion: "2023-10-16",
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    if (!signature) {
      console.error('Missing stripe-signature header');
      return new Response('Missing signature', { status: 400, headers: corsHeaders });
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return new Response('Webhook secret not configured', { status: 500, headers: corsHeaders });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Invalid signature', { status: 400, headers: corsHeaders });
    }

    console.log('Received webhook event:', event.type, 'ID:', event.id);

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Helper function to send order email
    const sendOrderEmail = async (orderId: string, emailType: 'payment_success' | 'payment_failed') => {
      try {
        // Get order details with customer info
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              product:products (*)
            ),
            profile:profiles (nome, email)
          `)
          .eq('id', orderId)
          .single();

        if (orderError || !orderData) {
          console.error('Error fetching order for email:', orderError);
          return;
        }

        // Prepare email data
        const emailData = {
          customerName: orderData.profile?.nome || 'Cliente',
          customerEmail: orderData.profile?.email || '',
          orderNumber: orderId.slice(-8).toUpperCase(),
          orderTotal: orderData.valor_total,
          orderItems: orderData.order_items.map((item: any) => ({
            name: item.product.nome,
            quantity: item.quantidade,
            price: item.preco_unitario,
          })),
          emailType,
        };

        // Send email via edge function
        const { error: emailError } = await supabase.functions.invoke('send-order-email', {
          body: emailData,
        });

        if (emailError) {
          console.error('Error sending order email:', emailError);
        } else {
          console.log('Order email sent successfully for order:', orderId);
        }
      } catch (error) {
        console.error('Error in sendOrderEmail:', error);
      }
    };

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout.session.completed:', session.id);
        
        // Update order status to paid
        const { data: order, error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'pago',
            stripe_payment_intent_id: session.payment_intent as string
          })
          .eq('stripe_payment_intent_id', session.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating order status:', updateError);
        } else {
          console.log('Order updated successfully:', order);
          
          // Send payment success email
          if (order?.id) {
            await sendOrderEmail(order.id, 'payment_success');
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Processing payment_intent.succeeded:', paymentIntent.id);
        
        // Update order status to paid
        const { data: order, error: updateError } = await supabase
          .from('orders')
          .update({ status: 'pago' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating order status for payment intent:', updateError);
        } else {
          console.log('Order updated for payment intent:', order);
          
          // Send payment success email
          if (order?.id) {
            await sendOrderEmail(order.id, 'payment_success');
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Processing payment_intent.payment_failed:', paymentIntent.id);
        
        // Update order status to failed
        const { data: order, error: updateError } = await supabase
          .from('orders')
          .update({ status: 'cancelado' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating order status for failed payment:', updateError);
        } else {
          console.log('Order marked as cancelled for failed payment:', order);
          
          // Send payment failed email
          if (order?.id) {
            await sendOrderEmail(order.id, 'payment_failed');
          }
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
