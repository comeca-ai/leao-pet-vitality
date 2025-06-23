
import { useQuery } from '@tanstack/react-query'
import { supabase, FAQ } from '@/lib/supabase'

export const useFAQs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      console.log('Fetching FAQs from Supabase...')
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })

      if (error) {
        console.error('Error fetching FAQs:', error)
        throw error
      }

      console.log('FAQs fetched successfully:', data)
      return data as FAQ[]
    },
  })
}
