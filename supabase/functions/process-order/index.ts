
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessOrderRequest {
  productId: string;
  quantity: number;
  addressId: string;
  paymentMethod: 'pix' | 'cartao' | 'boleto' | 'whatsapp';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid token');
    }

    const { productId, quantity, addressId, paymentMethod }: ProcessOrderRequest = await req.json();

    console.log('Processing order for user:', user.id);
    console.log('Order data:', { productId, quantity, addressId, paymentMethod });

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('ativo', true)
      .single();

    if (productError || !product) {
      throw new Error('Product not found or inactive');
    }

    // Calculate total price
    const unitPrice = product.preco_promocional || product.preco;
    const subtotal = unitPrice * quantity;
    const shipping = 15.00; // Frete fixo
    const total = subtotal + shipping;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: addressId,
        valor_total: total,
        status: paymentMethod === 'whatsapp' ? 'whatsapp' : 'aguardando_pagamento',
        forma_pagamento: paymentMethod,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created:', order);

    // Create order item
    const { data: orderItem, error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: productId,
        quantidade: quantity,
        preco_unitario: unitPrice,
        subtotal: subtotal,
      })
      .select()
      .single();

    if (itemError) {
      console.error('Error creating order item:', itemError);
      throw new Error('Failed to create order item');
    }

    console.log('Order item created:', orderItem);

    // Generate WhatsApp link if payment method is WhatsApp
    let whatsappLink = '';
    if (paymentMethod === 'whatsapp') {
      const message = `Olá! Gostaria de finalizar meu pedido:
Produto: ${product.nome}
Quantidade: ${quantity}
Total: R$ ${total.toFixed(2).replace('.', ',')}
Pedido: ${order.id}`;
      
      whatsappLink = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    }

    const response = {
      success: true,
      order: {
        id: order.id,
        status: order.status,
        valor_total: order.valor_total,
        forma_pagamento: order.forma_pagamento,
        criado_em: order.criado_em,
      },
      whatsappLink: whatsappLink || undefined,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-order function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
