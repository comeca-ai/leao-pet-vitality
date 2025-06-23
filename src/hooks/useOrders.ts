import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Order, OrderWithItems } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useOrders = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Fetching orders for user:', user.id)
      
      // Buscar pedidos, mas filtrar pedidos "iniciados" muito antigos (mais de 1 hora)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          ),
          address:addresses (*)
        `)
        .eq('user_id', user.id)
        .or(`status.neq.iniciado,and(status.eq.iniciado,criado_em.gt.${oneHourAgo})`)
        .order('criado_em', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        throw error
      }

      console.log('Orders fetched successfully:', data?.length || 0, 'orders found')
      
      // Filtro adicional no frontend para garantir consistência
      const filteredData = data?.filter(order => {
        const isOldInitiated = order.status === 'iniciado' && 
          new Date(order.criado_em) < new Date(Date.now() - 60 * 60 * 1000)
        return !isOldInitiated
      }) || []

      console.log('Orders after filtering:', filteredData.length, 'orders remaining')
      
      return filteredData as OrderWithItems[]
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache por 30 segundos para evitar muitas requisições
    retry: 2, // Tentar novamente em caso de erro
  })
}

export const useOrder = (orderId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Fetching order:', orderId)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          ),
          address:addresses (*)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        throw error
      }

      console.log('Order fetched successfully:', data)
      return data as OrderWithItems
    },
    enabled: !!user?.id && !!orderId,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (orderData: Omit<Order, 'id' | 'user_id' | 'criado_em' | 'atualizado_em'>) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Creating order:', orderData)
      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating order:', error)
        throw error
      }

      console.log('Order created successfully:', data)
      return data as Order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] })
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, ...orderData }: Partial<Order> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Updating order:', id, orderData)
      const { data, error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating order:', error)
        throw error
      }

      console.log('Order updated successfully:', data)
      return data as Order
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['order', data.id] })
    },
  })
}
