
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function handleAddress(supabase: any, userId: string, addressData: any) {
  console.log('[PROCESS-ORDER] Processing address for user:', userId)
  
  try {
    // Primeiro, verificar se já existe um endereço para este usuário
    const { data: existingAddresses, error: checkError } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('cep', addressData.cep)
      .eq('rua', addressData.rua)
      .limit(1)

    if (checkError) {
      console.log('[PROCESS-ORDER] Error checking existing address:', checkError)
      throw checkError
    }

    let addressId

    if (existingAddresses && existingAddresses.length > 0) {
      // Usar endereço existente
      addressId = existingAddresses[0].id
      console.log('[PROCESS-ORDER] Using existing address:', addressId)
    } else {
      // Criar novo endereço
      const { data: newAddress, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          telefone: addressData.telefone,
          cep: addressData.cep,
          rua: addressData.rua,
          numero: addressData.numero || '0',
          bairro: addressData.bairro || 'Centro',
          cidade: addressData.cidade,
          estado: addressData.estado || 'SP'
        })
        .select()
        .single()

      if (addressError) {
        console.log('[PROCESS-ORDER] Error creating address:', addressError)
        throw addressError
      }

      addressId = newAddress.id
      console.log('[PROCESS-ORDER] Created new address:', addressId)
    }

    return addressId
  } catch (error) {
    console.error('[PROCESS-ORDER] Address handling error:', error)
    throw error
  }
}
