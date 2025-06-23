
-- 1. Criar tabela de perfis dos usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stripe_customer_id TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de produtos
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  preco DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),
  estoque INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de depoimentos
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  foto_url TEXT,
  texto TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aprovado BOOLEAN DEFAULT FALSE,
  destaque BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de FAQ
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para products (público para leitura, apenas admins para escrita)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (ativo = true);

-- Políticas RLS para testimonials (público para aprovados, apenas admins para gerenciar)
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials
  FOR SELECT USING (aprovado = true);

-- Políticas RLS para faqs (público para ativos, apenas admins para gerenciar)
CREATE POLICY "Anyone can view active faqs" ON public.faqs
  FOR SELECT USING (ativo = true);

-- Trigger para auto-preencher perfil quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at em todas as tabelas
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais para desenvolvimento
INSERT INTO public.products (nome, descricao, preco, imagem_url, estoque) VALUES
('Juba de Leão para Pets', 'Suplemento natural que fortalece o sistema imunológico do seu pet, promovendo mais energia, vitalidade e bem-estar geral.', 89.90, '/placeholder.svg', 100);

INSERT INTO public.testimonials (nome, texto, aprovado, destaque) VALUES
('Maria Silva', 'Meu cachorro ficou muito mais disposto depois que começou a tomar o Juba de Leão. Recomendo!', true, true),
('João Santos', 'Produto excelente! Minha gata está com o pelo muito mais brilhante e saudável.', true, false),
('Ana Costa', 'Desde que comecei a dar para meu pet, ele está muito mais ativo e brincalhão. Vale cada centavo!', true, true);

INSERT INTO public.faqs (pergunta, resposta, ordem, ativo) VALUES
('Como devo administrar o Juba de Leão para o meu pet?', 'Administre 1 cápsula por dia para pets até 10kg, e 2 cápsulas para pets acima de 10kg. Misture com a ração ou ofereça diretamente.', 1, true),
('Em quanto tempo verei resultados?', 'Os primeiros resultados podem ser observados entre 15 a 30 dias de uso contínuo.', 2, true),
('O produto tem contraindicações?', 'O produto é natural e seguro. Consulte um veterinário em caso de pets gestantes ou com condições específicas de saúde.', 3, true),
('Posso dar para filhotes?', 'Recomendamos para pets acima de 6 meses de idade. Para filhotes menores, consulte um veterinário.', 4, true);
