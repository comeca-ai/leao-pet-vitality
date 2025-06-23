
import { useQuery } from '@tanstack/react-query'
import { supabase, Product } from '@/lib/supabase'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }

      console.log('Products fetched successfully:', data)
      return data as Product[]
    },
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product:', id)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        throw error
      }

      console.log('Product fetched successfully:', data)
      return data as Product
    },
    enabled: !!id,
  })
}
