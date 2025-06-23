
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface ProcessOrderData {
  productId?: string
  quantity: number
  addressId?: string
  paymentMethod: 'pix' | 'cartao' | 'boleto' | 'whatsapp'
  customerInfo?: {
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

interface ProcessOrderResponse {
  success: boolean
  order?: {
    id: string
    status: string
    valor_total: number
    forma_pagamento: string
    criado_em: string
    numero_pedido: string
  }
  whatsappLink?: string
  stripeUrl?: string
  error?: string
}

export const useProcessOrder = () => {
  const { session, user } = useAuth()

  return useMutation({
    mutationFn: async (orderData: ProcessOrderData): Promise<ProcessOrderResponse> => {
      console.log('Processing order:', orderData)

      // Para pedidos via WhatsApp, não precisa de autenticação
      if (orderData.paymentMethod === 'whatsapp') {
        if (!orderData.customerInfo) {
          throw new Error('Customer info required for WhatsApp orders')
        }

        const total = 49.90 * orderData.quantity
        const orderNumber = `WA${Date.now().toString().slice(-8)}`

        const message = `🛒 *Novo Pedido #${orderNumber}*

📦 *Produto:* Extrato de Juba de Leão 30ml
📊 *Quantidade:* ${orderData.quantity}
💰 *Valor Total:* R$ ${total.toFixed(2).replace('.', ',')}

👤 *Dados do Cliente:*
Nome: ${orderData.customerInfo.name}
Email: ${orderData.customerInfo.email}
Telefone: ${orderData.customerInfo.phone}

📍 *Endereço de Entrega:*
${orderData.customerInfo.address.street}
${orderData.customerInfo.address.city} - ${orderData.customerInfo.address.zipCode}

Gostaria de finalizar este pedido!`

        const encodedMessage = encodeURIComponent(message)
        const whatsappNumber = '5511999999999'
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

        return {
          success: true,
          whatsappLink: whatsappUrl,
          order: {
            id: orderNumber,
            status: 'whatsapp',
            valor_total: total,
            forma_pagamento: 'whatsapp',
            criado_em: new Date().toISOString(),
            numero_pedido: orderNumber
          }
        }
      }

      // Para outros métodos de pagamento, requer autenticação
      if (!session?.access_token) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase.functions.invoke('process-order', {
        body: orderData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) {
        console.error('Error processing order:', error)
        throw error
      }

      console.log('Order processed successfully:', data)
      return data as ProcessOrderResponse
    },
  })
}
