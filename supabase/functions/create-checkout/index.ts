
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    const { orderId, successUrl, cancelUrl } = await req.json()

    console.log('Creating checkout for order:', orderId)

    // Buscar o pedido com itens
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', orderError)
      throw new Error('Order not found')
    }

    // Import Stripe
    const Stripe = (await import('https://esm.sh/stripe@12.18.0')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Criar line items para o Stripe
    const lineItems = order.order_items.map((item: any) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.product.nome,
          description: item.product.descricao || undefined,
          images: item.product.imagem_url ? [item.product.imagem_url] : undefined,
        },
        unit_amount: Math.round(item.preco_unitario * 100), // Converter para centavos
      },
      quantity: item.quantidade,
    }))

    // Criar sessão do Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        order_id: orderId,
        user_id: user.id,
      },
      customer_email: user.email,
      locale: 'pt-BR',
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          order_id: orderId,
          user_id: user.id,
        }
      }
    })

    console.log('Stripe session created:', session.id)

    // Atualizar o pedido com o status e payment_intent_id se disponível
    const updateData: any = {
      status: 'aguardando_pagamento',
      atualizado_em: new Date().toISOString()
    }

    if (session.payment_intent) {
      updateData.stripe_payment_intent_id = session.payment_intent
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      // Não falhar a criação do checkout por isso
    }

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Create checkout error:', error)
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
