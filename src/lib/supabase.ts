import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wezlahokdkfhaveylnxo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlemxhaG9rZGtmaGF2ZXlsbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjM2NDcsImV4cCI6MjA2NjIzOTY0N30.-yRWaW8kw0ayXzlyPq3HpqN-Ns2BCQUtWVm1qKuMajk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface Profile {
  id: string
  nome: string
  email: string
  telefone?: string
  data_cadastro: string
  stripe_customer_id?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  nome: string
  descricao?: string
  imagem_url?: string
  preco: number
  preco_promocional?: number
  estoque: number
  ativo: boolean
  stripe_product_id?: string
  stripe_price_id?: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  nome: string
  foto_url?: string
  texto: string
  data: string
  aprovado: boolean
  destaque: boolean
  created_at: string
  updated_at: string
}

export interface FAQ {
  id: string
  pergunta: string
  resposta: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

// Novos tipos para as tabelas com relacionamentos
export interface Address {
  id: string
  user_id: string
  telefone: string
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  address_id?: string
  valor_total: number
  status: 'iniciado' | 'aguardando_pagamento' | 'pago' | 'cancelado' | 'whatsapp'
  forma_pagamento?: 'pix' | 'cartao' | 'boleto' | 'whatsapp'
  stripe_payment_intent_id?: string
  criado_em: string
  atualizado_em: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantidade: number
  preco_unitario: number
  subtotal: number
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id?: string
  product_id?: string
  status: 'ativa' | 'cancelada' | 'trial' | 'incompleta'
  data_inicio: string
  data_fim?: string
  created_at: string
  updated_at: string
}

// Tipos para queries com relacionamentos
export interface OrderWithItems extends Order {
  order_items: (OrderItem & { product: Product })[]
  address?: Address
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product
}
