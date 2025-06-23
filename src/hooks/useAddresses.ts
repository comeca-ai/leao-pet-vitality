import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Address } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useAddresses = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Fetching addresses for user:', user.id)
      
      // Buscar endereços únicos usando DISTINCT ON para evitar duplicatas
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching addresses:', error)
        throw error
      }

      // Filtrar endereços duplicados no frontend como medida extra de segurança
      const uniqueAddresses = data?.reduce((acc: Address[], current) => {
        const exists = acc.find(addr => 
          addr.cep === current.cep && 
          addr.rua === current.rua && 
          addr.numero === current.numero &&
          addr.bairro === current.bairro &&
          addr.cidade === current.cidade
        )
        
        if (!exists) {
          acc.push(current)
        }
        
        return acc
      }, []) || []

      console.log('Addresses fetched successfully:', uniqueAddresses.length, 'unique addresses found')
      return uniqueAddresses as Address[]
    },
    enabled: !!user?.id,
    staleTime: 60000, // Cache por 1 minuto para evitar consultas desnecessárias
  })
}

export const useCreateAddress = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Creating address:', addressData)
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          ...addressData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating address:', error)
        throw error
      }

      console.log('Address created successfully:', data)
      return data as Address
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] })
    },
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, ...addressData }: Partial<Address> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Updating address:', id, addressData)
      const { data, error } = await supabase
        .from('addresses')
        .update(addressData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating address:', error)
        throw error
      }

      console.log('Address updated successfully:', data)
      return data as Address
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] })
    },
  })
}
