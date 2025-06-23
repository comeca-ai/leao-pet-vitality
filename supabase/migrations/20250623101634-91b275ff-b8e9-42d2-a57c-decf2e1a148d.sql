
-- Inserir produto padrão se não existir
INSERT INTO public.products (
  id,
  nome,
  descricao,
  preco,
  preco_promocional,
  estoque,
  ativo,
  stripe_product_id,
  stripe_price_id
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Extrato de Juba de Leão para Pets',
  'Suplemento natural que fortalece o sistema imunológico do seu pet, promovendo mais energia, vitalidade e bem-estar geral.',
  89.90,
  49.90,
  100,
  true,
  null,
  null
) ON CONFLICT (id) DO UPDATE SET
  estoque = 100,
  ativo = true;
