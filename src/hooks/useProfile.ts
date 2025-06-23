
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Profile } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useProfile = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Fetching profile for user:', user.id)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      console.log('Profile fetched successfully:', data)
      return data as Profile
    },
    enabled: !!user?.id,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('Updating profile:', profileData)
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }

      console.log('Profile updated successfully:', data)
      return data as Profile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
    },
  })
}
