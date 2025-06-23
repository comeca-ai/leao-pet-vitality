
import { useMutation } from '@tanstack/react-query'

interface WhatsAppCheckoutData {
  quantity: number
  customerInfo: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      zipCode: string
    }
  }
}

export const useWhatsAppCheckout = () => {
  return useMutation({
    mutationFn: async (checkoutData: WhatsAppCheckoutData) => {
      console.log('Creating WhatsApp checkout:', checkoutData)

      const { quantity, customerInfo } = checkoutData
      const total = 49.90 * quantity

      // Gerar número do pedido baseado no timestamp
      const orderNumber = `WA${Date.now().toString().slice(-8)}`

      // Criar mensagem para WhatsApp
      const message = `🛒 *Novo Pedido #${orderNumber}*

📦 *Produto:* Extrato de Juba de Leão 30ml
📊 *Quantidade:* ${quantity}
💰 *Valor Total:* R$ ${total.toFixed(2).replace('.', ',')}

👤 *Dados do Cliente:*
Nome: ${customerInfo.name}
Email: ${customerInfo.email}
Telefone: ${customerInfo.phone}

📍 *Endereço de Entrega:*
${customerInfo.address.street}
${customerInfo.address.city} - ${customerInfo.address.zipCode}

Gostaria de finalizar este pedido!`

      const encodedMessage = encodeURIComponent(message)
      const whatsappNumber = '5511999999999' // Número da empresa
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

      return {
        whatsappUrl,
        orderNumber,
        message
      }
    },
  })
}
