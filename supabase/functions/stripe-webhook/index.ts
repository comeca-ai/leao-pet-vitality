
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep("Webhook started");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!
    
    if (!supabaseUrl || !supabaseKey || !stripeSecretKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('Missing stripe-signature header')
    }

    const body = await req.text()
    logStep("Request body received", { bodyLength: body.length });
    
    // Import Stripe
    const Stripe = (await import('https://esm.sh/stripe@12.18.0')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Verificar a assinatura do webhook
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    let event
    try {
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
        logStep("Webhook signature verified");
      } else {
        event = JSON.parse(body)
        logStep("Using raw event (no signature verification)");
      }
    } catch (err) {
      logStep('Webhook signature verification failed', { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { 
        status: 400,
        headers: corsHeaders 
      })
    }

    logStep('Processing webhook event', { type: event.type, id: event.id });

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        logStep('Checkout session completed', { sessionId: session.id });
        
        // Buscar o pedido pela session ID
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_payment_intent_id', session.id)
          .single()

        if (orderError && orderError.code !== 'PGRST116') {
          logStep('Error finding order', { error: orderError });
          throw orderError
        }

        if (order) {
          // Atualizar status para aguardando pagamento
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: 'aguardando_pagamento',
              stripe_payment_intent_id: session.payment_intent,
              atualizado_em: new Date().toISOString()
            })
            .eq('id', order.id)

          if (updateError) {
            logStep('Error updating order status', { error: updateError });
            throw updateError
          }

          logStep('Order status updated to aguardando_pagamento', { orderId: order.id });
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        logStep('Payment succeeded', { paymentIntentId: paymentIntent.id });
        
        // Buscar o pedido pelo payment intent ID
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            profiles!inner(nome, email),
            order_items(*, products(*))
          `)
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single()

        if (orderError) {
          logStep('Error finding order for payment success', { error: orderError });
          throw orderError
        }

        // Atualizar status para pago
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'pago',
            atualizado_em: new Date().toISOString()
          })
          .eq('id', order.id)

        if (updateError) {
          logStep('Error updating order to paid', { error: updateError });
          throw updateError
        }

        logStep('Order marked as paid', { orderId: order.id });

        // Enviar e-mail de confirmação de pagamento
        try {
          const orderNumber = order.id.slice(-8).toUpperCase();
          const orderItems = order.order_items.map((item: any) => ({
            name: item.products.nome,
            quantity: item.quantidade,
            price: item.preco_unitario,
          }));

          const { error: emailError } = await supabase.functions.invoke('send-order-email', {
            body: {
              customerName: order.profiles.nome,
              customerEmail: order.profiles.email,
              orderNumber: orderNumber,
              orderTotal: order.valor_total,
              orderItems: orderItems,
              emailType: 'payment_success',
            }
          });

          if (emailError) {
            logStep('Error sending payment success email', { error: emailError });
          } else {
            logStep('Payment success email sent', { orderId: order.id });
          }
        } catch (emailError) {
          logStep('Failed to send payment success email', { error: emailError });
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        logStep('Payment failed', { paymentIntentId: paymentIntent.id });
        
        // Atualizar o pedido como cancelado
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'cancelado',
            atualizado_em: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          logStep('Error updating failed order', { error: updateError });
          throw updateError
        }

        logStep('Order marked as cancelled due to payment failure');

        // Enviar e-mail de falha no pagamento
        try {
          const { data: order } = await supabase
            .from('orders')
            .select(`
              *,
              profiles!inner(nome, email),
              order_items(*, products(*))
            `)
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .single()

          if (order) {
            const orderNumber = order.id.slice(-8).toUpperCase();
            const orderItems = order.order_items.map((item: any) => ({
              name: item.products.nome,
              quantity: item.quantidade,
              price: item.preco_unitario,
            }));

            await supabase.functions.invoke('send-order-email', {
              body: {
                customerName: order.profiles.nome,
                customerEmail: order.profiles.email,
                orderNumber: orderNumber,
                orderTotal: order.valor_total,
                orderItems: orderItems,
                emailType: 'payment_failed',
              }
            });

            logStep('Payment failed email sent', { orderId: order.id });
          }
        } catch (emailError) {
          logStep('Failed to send payment failed email', { error: emailError });
        }
        break
      }

      default:
        logStep('Unhandled event type', { type: event.type });
    }

    logStep('Webhook processing completed successfully');

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    logStep('Webhook error', { error: error.message });
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
