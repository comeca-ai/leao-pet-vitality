
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateEnvironmentVariables } from './validation.ts'
import { createStripeSession } from './stripe.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function authenticateUser(req: Request, supabase: any) {
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

  return user
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { supabaseUrl, supabaseKey, stripeSecretKey } = validateEnvironmentVariables()
    const supabase = createClient(supabaseUrl, supabaseKey)

    const user = await authenticateUser(req, supabase)
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

    const Stripe = (await import('https://esm.sh/stripe@12.18.0')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const origin = req.headers.get('origin') || 'http://localhost:5173'
    console.log('Request origin:', origin)

    const session = await createStripeSession(stripe, { ...order, user_email: user.email }, origin)

    console.log('Stripe session created successfully:', session.id)
    console.log('Success URL configured:', `${origin}/confirmacao?session_id={CHECKOUT_SESSION_ID}`)
    console.log('Cancel URL configured:', `${origin}/checkout`)

    // Atualizar o pedido
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
