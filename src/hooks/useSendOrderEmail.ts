
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  orderTotal: number
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  emailType?: 'confirmation' | 'payment_success' | 'payment_failed' | 'whatsapp_created'
  whatsappLink?: string
}

export const useSendOrderEmail = () => {
  return useMutation({
    mutationFn: async (emailData: OrderEmailData) => {
      console.log('Sending order email:', emailData)

      const { data, error } = await supabase.functions.invoke('send-order-email', {
        body: emailData,
      })

      if (error) {
        console.error('Error sending order email:', error)
        throw error
      }

      console.log('Order email sent successfully:', data)
      return data
    },
  })
}
