
-- 1. Adiciona a coluna para o snapshot do endereço de entrega na tabela de pedidos.
ALTER TABLE public.orders
ADD COLUMN shipping_address JSONB;

-- 2. Cria a tabela para armazenar logs de eventos do Stripe.
CREATE TABLE public.payment_logs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    stripe_event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Habilita Row Level Security (RLS) na nova tabela.
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- 4. Cria políticas de segurança para a tabela de logs.
-- Apenas administradores (role 'service_role') podem ver ou modificar os logs.
CREATE POLICY "Allow admin full access on payment_logs"
ON public.payment_logs
FOR ALL
USING (auth.role() = 'service_role');

-- 5. Adiciona índices de performance em todas as chaves estrangeiras importantes.

-- Índice na tabela de endereços para buscas por usuário
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- Índices na tabela de pedidos
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_address_id ON public.orders(address_id);

-- Índices na tabela de itens do pedido
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Índices na tabela de assinaturas
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_product_id ON public.subscriptions(product_id);

-- Índice na nova tabela de logs de pagamento
CREATE INDEX IF NOT EXISTS idx_payment_logs_order_id ON public.payment_logs(order_id);