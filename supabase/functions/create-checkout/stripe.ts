
export async function createStripeSession(stripe: any, order: any, origin: string) {
  if (!order.order_items || order.order_items.length === 0) {
    throw new Error('Order has no items')
  }

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
        unit_amount: Math.round(item.preco_unitario * 100),
      },
      quantity: item.quantidade,
    }
  })

  console.log('Creating Stripe session with', lineItems.length, 'items')

  return await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'boleto'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${origin}/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    metadata: {
      order_id: order.id,
      user_id: order.user_id,
    },
    customer_email: order.user_email,
    locale: 'pt-BR',
    billing_address_collection: 'required',
    payment_intent_data: {
      metadata: {
        order_id: order.id,
        user_id: order.user_id,
      }
    }
  })
}
