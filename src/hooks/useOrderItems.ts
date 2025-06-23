
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, OrderItem, OrderItemWithProduct } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useOrderItems = (orderId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['order-items', orderId],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Fetching order items for order:', orderId)
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products (*)
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching order items:', error)
        throw error
      }

      console.log('Order items fetched successfully:', data)
      return data as OrderItemWithProduct[]
    },
    enabled: !!user?.id && !!orderId,
  })
}

export const useCreateOrderItem = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (itemData: Omit<OrderItem, 'id' | 'created_at'>) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Creating order item:', itemData)
      const { data, error } = await supabase
        .from('order_items')
        .insert(itemData)
        .select()
        .single()

      if (error) {
        console.error('Error creating order item:', error)
        throw error
      }

      console.log('Order item created successfully:', data)
      return data as OrderItem
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order-items', data.order_id] })
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] })
    },
  })
}
