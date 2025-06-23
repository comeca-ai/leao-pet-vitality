
import { useQuery } from '@tanstack/react-query'
import { supabase, Testimonial } from '@/lib/supabase'

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      console.log('Fetching testimonials from Supabase...')
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('aprovado', true)
        .order('destaque', { ascending: false })
        .order('data', { ascending: false })

      if (error) {
        console.error('Error fetching testimonials:', error)
        throw error
      }

      console.log('Testimonials fetched successfully:', data)
      return data as Testimonial[]
    },
  })
}
