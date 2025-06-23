
## ✅ Finalized MVP Features (Phase 1)

### Cadastro e Autenticação
- Cadastro de usuário por e-mail e senha
- Login de usuário autenticado
- Recuperação de senha via e-mail
- Logout
- Atualização de perfil e endereço do usuário

### Gestão de Produtos e Conteúdo
- Listagem de produtos ativos e seus detalhes
- Consulta de informações e imagem do produto selecionado
- Exibição de depoimentos aprovados na landing page
- Exibição de perguntas frequentes (FAQ) essenciais para conversão

### Checkout e Pedidos
- Criação de pedido para usuários autenticados
- Inclusão de itens ao pedido (produto, quantidade, valor)
- Consulta e exibição do resumo do pedido antes do pagamento
- Finalização de compra com integração Stripe (Pix, cartão, boleto)
- Geração de link dinâmico para finalizar pedido via WhatsApp (opcional)

### Monetização & Pagamentos
- Integração completa com Stripe para gestão de pagamentos únicos
- Registro e atualização do status do pedido via webhooks Stripe
- Envio de e-mail de confirmação de pedido

---

## 👣 Detailed User Journey

1. Usuário acessa a landing page, navega pelos diferenciais, depoimentos e FAQ.
2. Ao clicar em "Comprar Agora", é direcionado para cadastro ou login.
3. Após autenticação, preenche endereço completo e dados de contato.
4. Seleciona o produto, visualiza a foto e define a quantidade desejada.
5. Consulta o resumo do pedido, escolhe a forma de pagamento (Stripe: Pix, cartão, boleto) ou opta por finalizar via WhatsApp.
6. Finaliza a compra; recebe confirmação visual e por e-mail.
7. (Se aplicável) Recebe atualizações do status do pedido por e-mail ou WhatsApp.

---

## ⚠️ Edge Case Notes

- Tentativa de acessar checkout/pedido sem login: redirecionar obrigatoriamente para login/cadastro.
- Dados de endereço incompletos: impedir avanço e exibir mensagens claras de erro.
- Pagamento não concluído ou recusado no Stripe: manter pedido com status pendente, exibir mensagem de erro e permitir nova tentativa.
- Estoque insuficiente: bloquear compra e notificar usuário de forma amigável.
- Links inválidos ou expirados de recuperação de senha: exibir feedback apropriado.
- Webhooks Stripe não recebidos: pedido permanece como "aguardando pagamento" até nova notificação ou ação manual.

---

## 🛠️ Tech Stack + Monetization Plan

### Tech Stack
- Frontend: Next.js (React)
- Backend: Supabase (Postgres + Auth + Storage + Edge Functions)
- Database: Supabase Postgres
- Integrações: Stripe (pagamento e webhook), E-mail SMTP (confirmação), WhatsApp (link dinâmico)
- Deployment: Vercel (frontend), Supabase Cloud (backend/db)

### Monetization Plan

#### Free Tier:
- Navegação livre pela landing page, consulta de depoimentos e FAQ
- Visualização dos produtos, preços e informações detalhadas
- Acesso ao cadastro/login obrigatório para comprar
- Não há funcionalidades exclusivas para plano gratuito além do acesso à landing

#### Pro Tier:
- Não se aplica nesta fase do MVP (toda compra é paga e exige login; não há plano Pro com funcionalidades extras)
- Todos os usuários autenticados têm acesso igual ao checkout e finalização de compra

---
