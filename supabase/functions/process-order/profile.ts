
export async function updateUserProfile(supabase: any, userId: string, orderData: any, address: any, logStep: Function) {
  if (!address?.telefone) return

  const profileUpdateData: any = {}
  
  if (address.telefone) {
    profileUpdateData.telefone = address.telefone
  }

  if (orderData.customerInfo?.name) {
    profileUpdateData.nome = orderData.customerInfo.name
  }

  if (Object.keys(profileUpdateData).length === 0) return

  logStep("Updating user profile", profileUpdateData)
  
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({
      ...profileUpdateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (profileUpdateError) {
    console.error('Error updating profile:', profileUpdateError)
  } else {
    logStep("Profile updated successfully")
  }
}
