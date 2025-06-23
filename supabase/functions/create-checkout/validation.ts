
export function validateEnvironmentVariables() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
  
  console.log('Environment check:', {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey,
    hasStripeKey: !!stripeSecretKey
  })
  
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is missing')
  }
  
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is missing')
  }
  
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is missing')
  }

  return { supabaseUrl, supabaseKey, stripeSecretKey }
}
