
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-ORDER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep("Process order started");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseUrl || !supabaseKey) {
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
      console.error('Authentication error:', authError)
      throw new Error('Invalid authentication')
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { orderData, address } = await req.json()
    logStep("Request data received", { orderData, address });

    // Atualizar o perfil do usuário com as informações do checkout se fornecidas
    if (address && address.telefone) {
      const profileUpdateData: any = {};
      
      // Se há telefone no endereço, usar para atualizar o perfil
      if (address.telefone) {
        profileUpdateData.telefone = address.telefone;
      }

      // Se há informações do cliente no orderData, usar para atualizar o nome
      if (orderData.customerInfo && orderData.customerInfo.name) {
        profileUpdateData.nome = orderData.customerInfo.name;
      }

      if (Object.keys(profileUpdateData).length > 0) {
        logStep("Updating user profile", profileUpdateData);
        
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            ...profileUpdateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileUpdateError) {
          console.error('Error updating profile:', profileUpdateError);
          // Não falhar o processo todo por causa do erro de atualização do perfil
        } else {
          logStep("Profile updated successfully");
        }
      }
    }

    // Criar/atualizar endereço
    const { data: existingAddress, error: addressSelectError } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .eq('cep', address.cep)
      .eq('rua', address.rua)
      .maybeSingle()

    let addressId;
    
    if (existingAddress) {
      // Atualizar endereço existente
      const { data: updatedAddress, error: addressUpdateError } = await supabase
        .from('addresses')
        .update({
          ...address,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAddress.id)
        .select()
        .single()

      if (addressUpdateError) {
        logStep("Error updating address", addressUpdateError);
        throw addressUpdateError
      }
      
      addressId = updatedAddress.id
      logStep("Address updated", { addressId });
    } else {
      // Criar novo endereço
      const { data: newAddress, error: addressInsertError } = await supabase
        .from('addresses')
        .insert({
          ...address,
          user_id: user.id
        })
        .select()
        .single()

      if (addressInsertError) {
        logStep("Error creating address", addressInsertError);
        throw addressInsertError
      }
      
      addressId = newAddress.id
      logStep("Address created", { addressId });
    }

    // Criar o pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: addressId,
        valor_total: orderData.valor_total,
        status: orderData.status || 'iniciado',
        forma_pagamento: orderData.forma_pagamento
      })
      .select()
      .single()

    if (orderError) {
      logStep("Error creating order", orderError);
      throw orderError
    }

    logStep("Order created", { orderId: order.id });

    // Criar itens do pedido
    if (orderData.items && orderData.items.length > 0) {
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
        logStep("Error creating order items", itemsError);
        throw itemsError
      }

      logStep("Order items created", { itemsCount: orderItems.length });
    }

    logStep("Process order completed successfully", { orderId: order.id });

    return new Response(
      JSON.stringify({ 
        success: true,
        order: order,
        address_id: addressId
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    logStep("Process order error", { error: error.message });
    console.error('Process order error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred' 
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
