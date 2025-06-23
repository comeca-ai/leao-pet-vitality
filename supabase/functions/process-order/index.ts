
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
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Extrair o token JWT
    const token = authHeader.replace('Bearer ', '')
    
    // Verificar o usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    const { orderData, address } = await req.json()

    console.log('Processing order for user:', user.id)
    console.log('Order data:', orderData)
    console.log('Address data:', address)

    // Validar dados obrigatórios
    if (!orderData.valor_total || orderData.valor_total <= 0) {
      throw new Error('Invalid order total')
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('No items in order')
    }

    // Iniciar transação criando o pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        valor_total: orderData.valor_total,
        status: orderData.status || 'iniciado',
        forma_pagamento: orderData.forma_pagamento
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      throw new Error('Failed to create order')
    }

    console.log('Order created:', order.id)

    // Criar endereço se fornecido
    let addressId = null
    if (address) {
      const { data: newAddress, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          telefone: address.telefone,
          cep: address.cep,
          rua: address.rua,
          numero: address.numero,
          complemento: address.complemento,
          bairro: address.bairro,
          cidade: address.cidade,
          estado: address.estado
        })
        .select()
        .single()

      if (addressError) {
        console.error('Error creating address:', addressError)
        // Não falhar o pedido por erro no endereço
      } else {
        addressId = newAddress.id
        console.log('Address created:', addressId)
      }
    }

    // Atualizar pedido com o address_id se foi criado
    if (addressId) {
      await supabase
        .from('orders')
        .update({ address_id: addressId })
        .eq('id', order.id)
    }

    // Criar itens do pedido
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      subtotal: item.quantidade * item.preco_unitario
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      
      // Tentar limpar o pedido criado
      await supabase
        .from('orders')
        .delete()
        .eq('id', order.id)
      
      throw new Error('Failed to create order items')
    }

    console.log('Order items created successfully')

    // Retornar o pedido criado
    const { data: fullOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        ),
        address:addresses (*)
      `)
      .eq('id', order.id)
      .single()

    if (fetchError) {
      console.error('Error fetching created order:', fetchError)
      throw new Error('Order created but failed to fetch details')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: fullOrder 
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Process order error:', error)
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
