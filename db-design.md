
# Database Design - Juba de Leão Pets

## 1. users
**Finalidade:** Dados dos usuários (tutores de pets).

- `id`: UUID, PK (referência ao Auth)
- `nome`: Nome completo
- `email`: E-mail único
- `data_cadastro`: Data de criação
- `stripe_customer_id`: ID do cliente na Stripe
- `is_admin`: Boolean (usuário administrador)

## 2. addresses
**Finalidade:** Endereços de entrega do usuário.

- `id`: UUID, PK
- `user_id`: FK → users.id
- `telefone`: Telefone com DDD
- `cep`: CEP
- `rua`: Rua
- `numero`: Número
- `complemento`: Complemento
- `bairro`: Bairro
- `cidade`: Cidade
- `estado`: Estado

## 3. products
**Finalidade:** Catálogo dos produtos.

- `id`: UUID, PK
- `nome`: Nome do produto
- `descricao`: Descrição detalhada
- `imagem_url`: URL da imagem
- `preco`: Preço unitário
- `preco_promocional`: Preço promocional (opcional)
- `estoque`: Quantidade disponível
- `ativo`: Boolean (produto ativo)
- `stripe_product_id`: ID do produto na Stripe
- `stripe_price_id`: ID do preço na Stripe

## 4. orders
**Finalidade:** Registro dos pedidos.

- `id`: UUID, PK
- `user_id`: FK → users.id
- `address_id`: FK → addresses.id
- `valor_total`: Valor total do pedido
- `status`: iniciado, aguardando_pagamento, pago, cancelado, whatsapp
- `forma_pagamento`: pix, cartão, boleto, whatsapp
- `stripe_payment_intent_id`: ID do pagamento na Stripe
- `criado_em`: Timestamp de criação
- `atualizado_em`: Timestamp de atualização

## 5. order_items
**Finalidade:** Produtos de cada pedido.

- `id`: UUID, PK
- `order_id`: FK → orders.id
- `product_id`: FK → products.id
- `quantidade`: Quantidade do produto
- `preco_unitario`: Preço unitário no momento da compra
- `subtotal`: Total do item (quantidade × preço_unitário)

## 6. subscriptions
**Finalidade:** Gerenciar assinaturas recorrentes.

- `id`: UUID, PK
- `user_id`: FK → users.id
- `stripe_subscription_id`: ID da assinatura na Stripe
- `product_id`: FK → products.id (opcional)
- `status`: ativa, cancelada, trial, incompleta, etc.
- `data_inicio`: Data de início
- `data_fim`: Data de fim (opcional)

## 7. testimonials
**Finalidade:** Depoimentos de clientes (prova social).

- `id`: UUID, PK
- `nome`: Nome do autor
- `foto_url`: Foto do autor (opcional)
- `texto`: Texto do depoimento
- `data`: Data do depoimento
- `aprovado`: Boolean (aprovado para exibição)
- `destaque`: Boolean (destaque na landing)

## 8. faqs
**Finalidade:** Perguntas e respostas frequentes.

- `id`: UUID, PK
- `pergunta`: Texto da pergunta
- `resposta`: Texto da resposta
- `ordem`: Ordem de exibição
- `ativo`: Boolean (exibir ou não)

## 9. payment_logs
**Finalidade:** Logs de eventos de pagamento.

- `id`: UUID, PK
- `order_id`: FK → orders.id
- `stripe_event_id`: ID do evento na Stripe
- `status`: Status do evento
- `detalhes`: Texto ou JSON com detalhes
- `data`: Data do evento

## 10. admin_logs (opcional)
**Finalidade:** Logs de ações administrativas.

- `id`: UUID, PK
- `user_id`: FK → users.id
- `acao`: Descrição da ação
- `detalhe`: Detalhes da operação
- `data`: Data/hora da ação

## Principais Relacionamentos

- users 1:N addresses
- users 1:N orders
- orders 1:N order_items
- products 1:N order_items
- users 1:N subscriptions
- orders 1:N payment_logs
- users 1:N admin_logs

**Usuários e produtos conectados à Stripe via IDs externos**
