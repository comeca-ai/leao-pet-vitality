
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface CheckoutData {
  quantity: number
  customerInfo: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      zipCode: string
    }
  }
}

interface CheckoutResponse {
  sessionId: string
  url: string
}

export const useStripeCheckout = () => {
  return useMutation({
    mutationFn: async (checkoutData: CheckoutData): Promise<CheckoutResponse> => {
      console.log('Creating Stripe checkout:', checkoutData)

      // Primeiro criar o pedido no banco de dados
      const orderData = {
        valor_total: 49.90 * checkoutData.quantity,
        status: 'iniciado',
        forma_pagamento: 'cartao',
        // Incluir informações do cliente no orderData
        customerInfo: {
          name: checkoutData.customerInfo.name,
          email: checkoutData.customerInfo.email,
          phone: checkoutData.customerInfo.phone
        }
      }

      const addressData = {
        telefone: checkoutData.customerInfo.phone,
        cep: checkoutData.customerInfo.address.zipCode,
        rua: checkoutData.customerInfo.address.street,
        numero: '0',
        bairro: 'Centro',
        cidade: checkoutData.customerInfo.address.city,
        estado: 'SP'
      }

      // Criar o pedido primeiro
      const { data: orderResponse, error: orderError } = await supabase.functions.invoke('process-order', {
        body: {
          orderData: {
            ...orderData,
            items: [{
              product_id: '123e4567-e89b-12d3-a456-426614174000', // ID fictício do produto
              quantidade: checkoutData.quantity,
              preco_unitario: 49.90
            }]
          },
          address: addressData
        }
      })

      if (orderError) {
        console.error('Error creating order:', orderError)
        throw orderError
      }

      // Agora criar a sessão do Stripe com URLs corretas
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          orderId: orderResponse.order.id,
          successUrl: `${window.location.origin}/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`
        }
      })

      if (error) {
        console.error('Error creating checkout:', error)
        throw error
      }

      console.log('Checkout created successfully:', data)
      console.log('Configured success URL:', `${window.location.origin}/confirmacao?session_id={CHECKOUT_SESSION_ID}`)
      console.log('Configured cancel URL:', `${window.location.origin}/checkout`)
      
      return data as CheckoutResponse
    },
  })
}
