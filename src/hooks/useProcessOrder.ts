
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface ProcessOrderData {
  productId: string
  quantity: number
  addressId: string
  paymentMethod: 'pix' | 'cartao' | 'boleto' | 'whatsapp'
}

interface ProcessOrderResponse {
  success: boolean
  order?: {
    id: string
    status: string
    valor_total: number
    forma_pagamento: string
    criado_em: string
  }
  whatsappLink?: string
  error?: string
}

export const useProcessOrder = () => {
  const { session } = useAuth()

  return useMutation({
    mutationFn: async (orderData: ProcessOrderData): Promise<ProcessOrderResponse> => {
      if (!session?.access_token) {
        throw new Error('User not authenticated')
      }

      console.log('Processing order:', orderData)

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
