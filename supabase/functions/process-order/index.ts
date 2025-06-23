
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, logStep, validateEnvironmentVariables } from './utils.ts'
import { authenticateUser } from './auth.ts'
import { updateUserProfile } from './profile.ts'
import { handleAddress } from './address.ts'
import { createOrder, createOrderItems } from './order.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep("Process order started")

    const { supabaseUrl, supabaseKey } = validateEnvironmentVariables()
    const supabase = createClient(supabaseUrl, supabaseKey)

    const user = await authenticateUser(req, supabase)
    logStep("User authenticated", { userId: user.id, email: user.email })

    const { orderData, address } = await req.json()
    logStep("Request data received", { orderData, address })

    await updateUserProfile(supabase, user.id, orderData, address, logStep)

    const addressId = await handleAddress(supabase, user.id, address, logStep)

    const order = await createOrder(supabase, user.id, addressId, orderData, logStep)

    await createOrderItems(supabase, order.id, orderData, logStep)

    logStep("Process order completed successfully", { orderId: order.id })

    return new Response(
      JSON.stringify({ 
        success: true,
        order: order,
        address_id: addressId
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    logStep("Process order error", { error: error.message })
    console.error('Process order error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
