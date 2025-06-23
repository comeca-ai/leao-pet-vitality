
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

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: checkoutData,
      })

      if (error) {
        console.error('Error creating checkout:', error)
        throw error
      }

      console.log('Checkout created successfully:', data)
      return data as CheckoutResponse
    },
  })
}
