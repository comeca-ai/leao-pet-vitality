
export async function handleAddress(supabase: any, userId: string, address: any, logStep: Function) {
  // Verificar se existe um endereço similar
  const { data: existingAddress, error: addressSelectError } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('cep', address.cep)
    .eq('rua', address.rua)
    .eq('numero', address.numero)
    .eq('cidade', address.cidade)
    .maybeSingle()

  if (addressSelectError) {
    logStep("Error checking existing address", addressSelectError)
    throw addressSelectError
  }

  if (existingAddress) {
    return await updateExistingAddress(supabase, existingAddress, address, logStep)
  } else {
    return await createNewAddress(supabase, userId, address, logStep)
  }
}

async function updateExistingAddress(supabase: any, existingAddress: any, address: any, logStep: Function) {
  const hasChanges = 
    existingAddress.bairro !== address.bairro ||
    existingAddress.estado !== address.estado ||
    existingAddress.complemento !== address.complemento ||
    existingAddress.telefone !== address.telefone

  if (hasChanges) {
    const { data: updatedAddress, error: addressUpdateError } = await supabase
      .from('addresses')
      .update({
        ...address,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingAddress.id)
      .select()
      .single()

    if (addressUpdateError) {
      logStep("Error updating address", addressUpdateError)
      throw addressUpdateError
    }
    
    logStep("Address updated", { addressId: existingAddress.id })
  } else {
    logStep("Using existing address without changes", { addressId: existingAddress.id })
  }
  
  return existingAddress.id
}

async function createNewAddress(supabase: any, userId: string, address: any, logStep: Function) {
  const { data: newAddress, error: addressInsertError } = await supabase
    .from('addresses')
    .insert({
      ...address,
      user_id: userId
    })
    .select()
    .single()

  if (addressInsertError) {
    logStep("Error creating address", addressInsertError)
    throw addressInsertError
  }
  
  logStep("New address created", { addressId: newAddress.id })
  return newAddress.id
}
