
# Checklist Backend MVP – Juba de Leão para Pets (Supabase)

## 1. Estrutura Inicial do Supabase
- [ ] Criar projeto no Supabase.
- [ ] Configurar domínio do frontend autorizado.
- [ ] Definir variáveis de ambiente: chaves Stripe, SMTP etc.

## 2. Modelagem do Banco de Dados

### 2.1. Usuários (supabase.auth.users)
- [ ] Usar autenticação nativa do Supabase para cadastro, login, recuperação de senha.
- [ ] Criar tabela profiles vinculada ao usuário com:
  - id (UUID, FK para user.id)
  - nome completo
  - telefone (com DDD)
  - endereço (rua, número, complemento, bairro, cidade, estado, CEP)
  - data de criação/atualização

### 2.2. Produtos
- [ ] Tabela products
  - id (UUID)
  - nome
  - descrição
  - preço
  - imagem (URL, Supabase Storage)
  - ativo (bool)
  - estoque (opcional)

### 2.3. Depoimentos
- [ ] Tabela testimonials
  - id (UUID)
  - nome
  - texto
  - aprovado (bool)

### 2.4. FAQ
- [ ] Tabela faq
  - id (UUID)
  - pergunta
  - resposta
  - ordem

### 2.5. Pedidos
- [ ] Tabela orders
  - id (UUID)
  - user_id (FK)
  - status (pendente, pago, cancelado)
  - valor_total
  - data de criação
  - endereço entregue (snapshot dos dados do perfil na hora do pedido)
  - forma de pagamento (pix, cartao, boleto, whatsapp)
  - stripe_session_id (opcional)
  - whatsapp_link (opcional)
  - status_pagamento_stripe (opcional)

### 2.6. Itens do Pedido
- [ ] Tabela order_items
  - id (UUID)
  - order_id (FK)
  - product_id (FK)
  - quantidade
  - preco_unitario
  - total

## 3. Supabase Auth & Segurança
- [ ] Habilitar e testar fluxo de cadastro, login, logout e recuperação de senha.
- [ ] Garantir que endpoints de pedidos e perfil só aceitam requests autenticadas.
- [ ] Policies (RLS) para proteger dados dos usuários.

## 4. Endpoints (Edge Functions) & Regras

### 4.1. Usuário e Perfil
- [ ] GET /me: retorna perfil e endereço do usuário autenticado.
- [ ] PATCH /me: atualiza nome, telefone, endereço.

### 4.2. Produtos e Conteúdo
- [ ] GET /products: lista produtos ativos.
- [ ] GET /products/:id: detalhes do produto.
- [ ] GET /testimonials: lista depoimentos aprovados.
- [ ] GET /faq: lista perguntas frequentes.

### 4.3. Checkout e Pedido
- [ ] POST /orders: cria pedido (com snapshot do endereço e escolha de produto/quantidade).
  - Vincula ao usuário autenticado.
- [ ] GET /orders/:id: retorna detalhes e status do pedido do usuário autenticado.
- [ ] PATCH /orders/:id: permite atualizar status para "pago" via webhook Stripe.

### 4.4. Stripe Integration
- [ ] POST /stripe/session: cria sessão de pagamento Stripe (Pix, cartão, boleto) com os dados do pedido.
- [ ] POST /stripe/webhook: recebe atualizações do Stripe e muda status do pedido.
  - Salva eventos como payment_intent.succeeded, payment_intent.canceled etc.

### 4.5. WhatsApp Integration
- [ ] GET /orders/:id/whatsapp-link: gera link com os dados do pedido para WhatsApp.

### 4.6. E-mail SMTP Integration
- [ ] Trigger de e-mail de confirmação de pedido, status pago e instruções para recuperação de senha (usando Edge Function + SMTP).

## 5. Lógica de Fluxo e Edge Cases
- [ ] Acesso não autenticado ao checkout: bloquear e redirecionar.
- [ ] Dados de endereço incompletos: bloquear pedido, retornar erro amigável.
- [ ] Estoque insuficiente: bloquear criação de pedido, exibir erro.
- [ ] Stripe pagamento não finalizado: manter status pendente, permitir retry.
- [ ] Webhooks Stripe não recebidos: exibir pedido como "aguardando pagamento".

## 6. Testes e Finalização
- [ ] Testar fluxo completo: cadastro → login → preenchimento endereço → seleção produto → criação pedido → pagamento Stripe → confirmação → consulta pedido.
- [ ] Testar pagamento via WhatsApp link.
- [ ] Testar edge cases: recusa pagamento, senha esquecida, dados incompletos.
- [ ] Testar envio de e-mails em todos os pontos críticos.

## 7. Deploy e Monitoramento
- [ ] Deploy do Supabase em produção.
- [ ] Verificar logs das Edge Functions.
- [ ] Monitorar webhooks e falhas de integração Stripe.
- [ ] Monitorar filas de e-mail (SMTP).
