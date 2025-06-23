
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function handleAddress(supabase: any, userId: string, addressData: any) {
  console.log('[PROCESS-ORDER] Processing address for user:', userId)
  
  try {
    // Verificar se já existe um endereço EXATAMENTE igual para este usuário
    const { data: existingAddresses, error: checkError } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('cep', addressData.cep)
      .eq('rua', addressData.rua)
      .eq('numero', addressData.numero || '0')
      .eq('bairro', addressData.bairro || 'Centro')
      .eq('cidade', addressData.cidade)
      .eq('estado', addressData.estado || 'SP')
      .limit(1)

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('[PROCESS-ORDER] Error checking existing address:', checkError)
      throw checkError
    }

    let addressId

    if (existingAddresses && existingAddresses.length > 0) {
      // Usar endereço existente
      addressId = existingAddresses[0].id
      console.log('[PROCESS-ORDER] Using existing address:', addressId)
      
      // Atualizar telefone se necessário
      if (existingAddresses[0].telefone !== addressData.telefone) {
        await supabase
          .from('addresses')
          .update({ telefone: addressData.telefone })
          .eq('id', addressId)
        
        console.log('[PROCESS-ORDER] Updated phone for existing address')
      }
    } else {
      // Criar novo endereço apenas se não existir
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
