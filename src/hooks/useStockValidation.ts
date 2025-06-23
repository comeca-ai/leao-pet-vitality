
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  nome: string
  estoque: number
  ativo: boolean
}

export const useStockValidation = (productId?: string) => {
  return useQuery({
    queryKey: ['stock-validation', productId],
    queryFn: async () => {
      if (!productId) return null

      console.log('Validating stock for product:', productId)
      
      const { data, error } = await supabase
        .from('products')
        .select('id, nome, estoque, ativo')
        .eq('id', productId)
        .eq('ativo', true)
        .single()

      if (error) {
        console.error('Error validating stock:', error)
        throw error
      }

      console.log('Stock validation result:', data)
      return data as Product
    },
    enabled: !!productId,
  })
}

export const validateStockAvailability = (product: Product | null, requestedQuantity: number) => {
  if (!product) {
    return {
      isAvailable: false,
      message: 'Produto não encontrado'
    }
  }

  if (!product.ativo) {
    return {
      isAvailable: false,
      message: 'Produto não está mais disponível'
    }
  }

  if (product.estoque < requestedQuantity) {
    return {
      isAvailable: false,
      message: `Estoque insuficiente. Disponível: ${product.estoque} unidades`
    }
  }

  if (product.estoque === 0) {
    return {
      isAvailable: false,
      message: 'Produto fora de estoque'
    }
  }

  return {
    isAvailable: true,
    message: `${product.estoque} unidades disponíveis`
  }
}
