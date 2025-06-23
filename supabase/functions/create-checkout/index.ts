
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  quantity: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { quantity, customerInfo }: CheckoutRequest = await req.json();

    console.log('Creating checkout session for quantity:', quantity);
    console.log('Customer info:', customerInfo);

    // Price per unit in cents (R$ 49,90 = 4990 cents)
    const unitPriceInCents = 4990;
    const totalAmount = unitPriceInCents * quantity;

    // Check if customer already exists in Stripe
    const customers = await stripe.customers.list({ 
      email: customerInfo.email, 
      limit: 1 
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('Existing customer found:', customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address.street,
          city: customerInfo.address.city,
          postal_code: customerInfo.address.zipCode,
          country: 'BR',
        },
      });
      customerId = customer.id;
      console.log('New customer created:', customerId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Juba de Leão para Pets',
              description: 'Extrato natural de Juba de Leão para pets',
              images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=300&h=300'],
            },
            unit_amount: unitPriceInCents,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      automatic_tax: { enabled: false },
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    console.log('Checkout session created:', session.id);

    // Store order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null, // Guest checkout
        valor_total: totalAmount / 100, // Convert back to reais
        status: 'aguardando_pagamento',
        forma_pagamento: 'cartao',
        stripe_payment_intent_id: session.id,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
    } else {
      console.log('Order created:', order);
      
      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: null, // We'll need to create a product record or use a default one
          quantidade: quantity,
          preco_unitario: unitPriceInCents / 100,
          subtotal: totalAmount / 100,
        });

      if (itemError) {
        console.error('Error creating order item:', itemError);
      }
    }

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
