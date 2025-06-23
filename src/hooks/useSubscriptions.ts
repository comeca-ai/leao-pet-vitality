
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Subscription } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useSubscriptions = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Fetching subscriptions for user:', user.id)
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          product:products (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching subscriptions:', error)
        throw error
      }

      console.log('Subscriptions fetched successfully:', data)
      return data as (Subscription & { product: any })[]
    },
    enabled: !!user?.id,
  })
}

export const useCreateSubscription = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (subscriptionData: Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Creating subscription:', subscriptionData)
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          ...subscriptionData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating subscription:', error)
        throw error
      }

      console.log('Subscription created successfully:', data)
      return data as Subscription
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', user?.id] })
    },
  })
}

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, ...subscriptionData }: Partial<Subscription> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Updating subscription:', id, subscriptionData)
      const { data, error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating subscription:', error)
        throw error
      }

      console.log('Subscription updated successfully:', data)
      return data as Subscription
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', user?.id] })
    },
  })
}
