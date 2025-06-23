
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
    // Verificar todas as variáveis de ambiente necessárias
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    
    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasStripeKey: !!stripeSecretKey
    })
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is missing')
    }
    
    if (!supabaseKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is missing')
    }
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is missing')
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
      console.error('Authentication error:', authError)
      throw new Error('Invalid authentication')
    }

    console.log('User authenticated:', user.id)

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
      throw new Error('Order not found or access denied')
    }

    console.log('Order found:', order.id, 'with', order.order_items?.length || 0, 'items')

    // Import Stripe
    const Stripe = (await import('https://esm.sh/stripe@12.18.0')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Verificar se há itens no pedido
    if (!order.order_items || order.order_items.length === 0) {
      throw new Error('Order has no items')
    }

    // Criar line items para o Stripe
    const lineItems = order.order_items.map((item: any) => {
      const product = item.product
      if (!product) {
        throw new Error(`Product not found for item ${item.id}`)
      }

      console.log('Creating line item for product:', product.nome, 'price:', item.preco_unitario)

      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: product.nome,
            description: product.descricao || undefined,
            images: product.imagem_url ? [product.imagem_url] : undefined,
          },
          unit_amount: Math.round(item.preco_unitario * 100), // Converter para centavos
        },
        quantity: item.quantidade,
      }
    })

    console.log('Creating Stripe session with', lineItems.length, 'items')

    // Obter o origin da requisição para construir URLs corretas
    const origin = req.headers.get('origin') || 'http://localhost:5173'
    console.log('Request origin:', origin)

    // Criar sessão do Stripe Checkout com URLs corretas
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
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

    console.log('Stripe session created successfully:', session.id)
    console.log('Success URL configured:', `${origin}/confirmacao?session_id={CHECKOUT_SESSION_ID}`)
    console.log('Cancel URL configured:', `${origin}/checkout`)

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
    
    // Retornar erro mais detalhado
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorDetails = {
      error: errorMessage,
      timestamp: new Date().toISOString()
    }
    
    return new Response(
      JSON.stringify(errorDetails),
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
