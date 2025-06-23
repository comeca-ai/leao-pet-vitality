
export async function createOrder(supabase: any, userId: string, addressId: string, orderData: any, logStep: Function) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      address_id: addressId,
      valor_total: orderData.valor_total,
      status: orderData.status || 'iniciado',
      forma_pagamento: orderData.forma_pagamento
    })
    .select()
    .single()

  if (orderError) {
    logStep("Error creating order", orderError)
    throw orderError
  }

  logStep("Order created", { orderId: order.id })
  return order
}

export async function createOrderItems(supabase: any, orderId: string, orderData: any, logStep: Function) {
  if (!orderData.items || orderData.items.length === 0) return

  const orderItems = orderData.items.map((item: any) => ({
    order_id: orderId,
    product_id: item.product_id,
    quantidade: item.quantidade,
    preco_unitario: item.preco_unitario,
    subtotal: item.quantidade * item.preco_unitario
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    logStep("Error creating order items", itemsError)
    throw itemsError
  }

  logStep("Order items created", { itemsCount: orderItems.length })
}
