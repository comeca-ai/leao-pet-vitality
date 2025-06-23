
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
