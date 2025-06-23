
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function authenticateUser(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('No authorization header')
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    console.error('Authentication error:', authError)
    throw new Error('Invalid authentication')
  }

  return user
}
