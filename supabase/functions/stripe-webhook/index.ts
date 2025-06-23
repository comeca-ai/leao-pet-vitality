
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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
    
    // Import Stripe
    const Stripe = (await import('https://esm.sh/stripe@12.18.0')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Construir o webhook endpoint secret
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    let event
    try {
      if (endpointSecret) {
        // Verificar a assinatura do webhook
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
      } else {
        // Se não há secret, apenas parse o body
        event = JSON.parse(body)
      }
    } catch (err) {
      console.log('Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { 
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log('Webhook event type:', event.type)

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        
        // Atualizar o pedido no banco
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'pago',
            atualizado_em: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating order:', updateError)
          throw updateError
        }

        console.log('Order updated successfully')
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Payment failed:', paymentIntent.id)
        
        // Atualizar o pedido como cancelado
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'cancelado',
            atualizado_em: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating failed order:', updateError)
          throw updateError
        }

        console.log('Order marked as cancelled')
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout session completed:', session.id)
        
        if (session.payment_intent) {
          // Atualizar o pedido com o payment_intent_id se ainda não tiver
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              stripe_payment_intent_id: session.payment_intent,
              status: 'aguardando_pagamento',
              atualizado_em: new Date().toISOString()
            })
            .eq('id', session.metadata?.order_id)

          if (updateError) {
            console.error('Error updating order with payment intent:', updateError)
          }
        }
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
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
