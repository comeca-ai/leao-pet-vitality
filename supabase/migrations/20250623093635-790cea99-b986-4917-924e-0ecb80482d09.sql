
-- Verificar e criar apenas as políticas que não existem

-- Para profiles (pular se já existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles
          FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
          FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Para addresses 
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'addresses' AND policyname = 'Users can view own addresses') THEN
        CREATE POLICY "Users can view own addresses" ON public.addresses
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'addresses' AND policyname = 'Users can insert own addresses') THEN
        CREATE POLICY "Users can insert own addresses" ON public.addresses
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'addresses' AND policyname = 'Users can update own addresses') THEN
        CREATE POLICY "Users can update own addresses" ON public.addresses
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'addresses' AND policyname = 'Users can delete own addresses') THEN
        CREATE POLICY "Users can delete own addresses" ON public.addresses
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Para orders
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view own orders') THEN
        CREATE POLICY "Users can view own orders" ON public.orders
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can insert own orders') THEN
        CREATE POLICY "Users can insert own orders" ON public.orders
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can update own orders') THEN
        CREATE POLICY "Users can update own orders" ON public.orders
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Para order_items
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can view own order items') THEN
        CREATE POLICY "Users can view own order items" ON public.order_items
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM public.orders 
              WHERE orders.id = order_items.order_id 
              AND orders.user_id = auth.uid()
            )
          );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can insert own order items') THEN
        CREATE POLICY "Users can insert own order items" ON public.order_items
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM public.orders 
              WHERE orders.id = order_items.order_id 
              AND orders.user_id = auth.uid()
            )
          );
    END IF;
END $$;
