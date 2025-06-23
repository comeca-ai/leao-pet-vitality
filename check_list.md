 MVP Production-Readiness Checklist – Inspeções Web App

_Use este checklist antes de lançar seu app Next.js + Supabase_

---

## SECTION 1: Feature Completion & Flow Validation

- [ ] **Walk through User Journey:**
  - [ ] Cadastro e login de usuário
  - [ ] Recuperação de senha
  - [ ] Customização de branding (logo/cores)
  - [ ] Criação de template de inspeção personalizado
  - [ ] Registro de inspeção com anexos
  - [ ] Visualização do histórico de inspeções
  - [ ] Dashboard com resumo visual
  - [ ] Exportação de relatórios (PDF/CSV)
  - [ ] Checkout e pagamento via Stripe (Pix, cartão, boleto)
  - [ ] Recebimento de e-mail de confirmação de pedido/inspeção
- [ ] **Confirm MVP Scope:**
  - [ ] Todas as funcionalidades Must Have estão implementadas e acessíveis
- [ ] **Validate Gating Logic:**
  - [ ] Apenas usuários autenticados podem criar/editar inspeções e acessar o checkout
  - [ ] Visitantes podem visualizar landing, depoimentos e FAQ, mas não iniciar inspeções ou pedidos

---

## SECTION 2: Database & Security Validation

- [ ] **RLS (Row Level Security):**
  - [ ] Habilitado em todas as tabelas sensíveis (users, templates, inspections, orders)
  - [ ] Teste: usuário não pode acessar dados de outros usuários
- [ ] **Key Usage:**
  - [ ] Nenhuma chave sensível (Stripe, SMTP, etc.) exposta no frontend
- [ ] **Environment & Config:**
  - [ ] `.env` está em `.gitignore` e não é versionado
  - [ ] Todas as variáveis sensíveis revisadas e setadas corretamente
- [ ] **Supabase Checks:**
  - [ ] Verificar Security Advisor do Supabase para warnings (tabelas abertas, policies)

---

## SECTION 3: Performance & API Optimizations

- [ ] **Frontend Performance:**
  - [ ] Lighthouse audit: landing e dashboard com nota > 90
  - [ ] Imagens otimizadas, lazy loading, cache de recursos estáticos
- [ ] **Backend/Database Performance:**
  - [ ] Queries otimizadas, uso de índices em FK (user_id, template_id)
  - [ ] Paginação e filtros para listas grandes (inspeções, templates)
  - [ ] Evitar `select *`, buscar apenas campos necessários

---

## SECTION 4: Frontend & UX Polish

- [ ] **State Persistence:**
  - [ ] Sessão/login persistente (localStorage/cookies)
  - [ ] Dados do pedido/inspeção mantidos em caso de refresh
- [ ] **Graceful UI Handling:**
  - [ ] Empty states amigáveis para inspeções, templates, dashboard
  - [ ] Loading indicators em operações críticas
  - [ ] Mensagens claras de sucesso/erro em todas as ações
- [ ] **Branding & Meta:**
  - [ ] Favicon, meta tags, descrição e preview social implementados
  - [ ] Logo, cores e fontes de acordo com o branding customizado
- [ ] **Responsiveness:**
  - [ ] Layout responsivo para todas as telas principais (mobile, tablet, desktop)
- [ ] **Validate UI States:**
  - [ ] Testar todos os estados: inicial, loading, sucesso, erro, vazio, pós-ação

---

## SECTION 5: Final Regression, Dependency Scan & Launch QA

- [ ] **Dependency Audit:**
  - [ ] Rodar `npm audit`/`yarn audit` e resolver vulnerabilidades críticas
- [ ] **Preview & Staging:**
  - [ ] Deploy em ambiente de staging com base de dados isolada
  - [ ] Testar todos os fluxos ponta-a-ponta em staging antes do lançamento
- [ ] **Environment Variables (Production):**
  - [ ] Todas as variáveis de ambiente revisadas e definidas corretamente na produção (Supabase, Stripe, SMTP, domínios)
- [ ] **Final Pre-Launch Checks:**
  - [ ] Teste final do fluxo de cadastro, login, template, inspeção, exportação, checkout Stripe, confirmação e e-mails
  - [ ] Teste dos webhooks Stripe (pagamento aprovado, recusado)
  - [ ] Teste de links WhatsApp gerados (se aplicável)
  - [ ] Supabase RLS policies revalidadas como seguras
- [ ] **Deploy to Production:**
  - [ ] Deploy do frontend e backend em produção
  - [ ] Monitorar logs, erros e falhas em tempo real no lançamento
- [ ] **Post-Launch Monitoring:**
  - [ ] Monitoramento ativo de erros (Sentry, LogRocket ou similar)
  - [ ] Monitoramento de eventos críticos (cadastro, inspeções, pagamentos)
  - [ ] Suporte disponível para clientes na primeira semana

---

**Checklist concluído = Produto pronto para lançamento MVP!**
