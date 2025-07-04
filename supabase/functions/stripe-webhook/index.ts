
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

const determinePaymentMethod = (session: any, paymentIntent?: any) => {
  try {
    // Primeiro, verificar session payment_method_types
    if (session?.payment_method_types) {
      if (session.payment_method_types.includes('boleto')) {
        return 'boleto';
      }
      if (session.payment_method_types.includes('pix')) {
        return 'pix';
      }
    }

    // Verificar payment_intent se disponível
    if (paymentIntent?.charges?.data?.[0]?.payment_method_details) {
      const methodDetails = paymentIntent.charges.data[0].payment_method_details;
      if (methodDetails.boleto) return 'boleto';
      if (methodDetails.pix) return 'pix';
      if (methodDetails.card) return 'cartao';
    }

    // Default para cartão
    return 'cartao';
  } catch (error) {
    logStep('Error determining payment method, defaulting to cartao', { error: error.message });
    return 'cartao';
  }
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
        
        // Buscar o pedido pela session ID ou payment_intent
        let order;
        
        // Primeiro tentar buscar pelo session ID
        const { data: orderBySession, error: sessionError } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_payment_intent_id', session.id)
          .maybeSingle()

        if (sessionError && sessionError.code !== 'PGRST116') {
          logStep('Error finding order by session', { error: sessionError });
        }

        if (orderBySession) {
          order = orderBySession;
        } else if (session.payment_intent) {
          // Tentar buscar pelo payment_intent ID
          const { data: orderByIntent, error: intentError } = await supabase
            .from('orders')
            .select('*')
            .eq('stripe_payment_intent_id', session.payment_intent)
            .maybeSingle()

          if (intentError && intentError.code !== 'PGRST116') {
            logStep('Error finding order by payment intent', { error: intentError });
          }

          order = orderByIntent;
        }

        if (order) {
          // Determinar forma de pagamento com função melhorada
          const paymentMethod = determinePaymentMethod(session);
          
          logStep('Payment method determined', { 
            sessionId: session.id,
            paymentMethod: paymentMethod,
            paymentMethodTypes: session.payment_method_types 
          });

          // Atualizar status para aguardando pagamento com forma de pagamento correta
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: 'aguardando_pagamento',
              forma_pagamento: paymentMethod,
              stripe_payment_intent_id: session.payment_intent || session.id,
              atualizado_em: new Date().toISOString()
            })
            .eq('id', order.id)

          if (updateError) {
            logStep('Error updating order status', { error: updateError });
            throw updateError
          }

          logStep('Order status updated to aguardando_pagamento', { 
            orderId: order.id, 
            paymentMethod: paymentMethod 
          });
        } else {
          logStep('No order found for session', { sessionId: session.id, paymentIntent: session.payment_intent });
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
          .maybeSingle()

        if (orderError) {
          logStep('Error finding order for payment success', { error: orderError });
          throw orderError
        }

        if (!order) {
          logStep('No order found for payment intent', { paymentIntentId: paymentIntent.id });
          break;
        }

        // Determinar forma de pagamento pelo método usado
        const finalPaymentMethod = determinePaymentMethod(null, paymentIntent);

        logStep('Final payment method determined', { 
          paymentIntentId: paymentIntent.id,
          paymentMethod: finalPaymentMethod 
        });

        // Atualizar status para pago com forma de pagamento correta
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'pago',
            forma_pagamento: finalPaymentMethod,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', order.id)

        if (updateError) {
          logStep('Error updating order to paid', { error: updateError });
          throw updateError
        }

        logStep('Order marked as paid', { 
          orderId: order.id,
          paymentMethod: finalPaymentMethod
        });

        // Enviar e-mail de confirmação de pagamento
        try {
          if (order.profiles && order.order_items) {
            const orderNumber = order.id.slice(-8).toUpperCase();
            const orderItems = order.order_items.map((item: any) => ({
              name: item.products?.nome || 'Produto',
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
            .maybeSingle()

          if (order && order.profiles && order.order_items) {
            const orderNumber = order.id.slice(-8).toUpperCase();
            const orderItems = order.order_items.map((item: any) => ({
              name: item.products?.nome || 'Produto',
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
