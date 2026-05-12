-- ==========================================
-- FIGHT HUB - FASE 1: FUNDAÇÃO MULTI-TENANT
-- ==========================================
-- Execute este script no Supabase SQL Editor
-- ATENÇÃO: Execute APÓS o schema original (supabase-epic1.sql)
-- ==========================================

-- =====================
-- 1. TABELA ACADEMIES
-- =====================
CREATE TABLE IF NOT EXISTS public.academies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                        -- "CT Pitbull Fight"
  slug TEXT UNIQUE NOT NULL,                 -- "ct-pitbull-fight" (usado na URL)
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'SP',
  zip_code TEXT,
  cnpj TEXT UNIQUE,
  owner_id UUID REFERENCES auth.users(id),   -- quem criou a academia
  plan TEXT DEFAULT 'free',                   -- 'free', 'pro', 'enterprise' (plano SaaS)
  max_students INT DEFAULT 50,               -- limite por plano SaaS
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. EXPANDIR TABELA USERS
-- =====================
-- Adiciona colunas necessárias para multi-tenant e perfil completo
DO $$
BEGIN
  -- academy_id: vincula o usuário à academia
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='academy_id') THEN
    ALTER TABLE public.users ADD COLUMN academy_id UUID REFERENCES public.academies(id);
  END IF;

  -- dados pessoais
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
    ALTER TABLE public.users ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='cpf') THEN
    ALTER TABLE public.users ADD COLUMN cpf TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='birth_date') THEN
    ALTER TABLE public.users ADD COLUMN birth_date DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
    ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='gender') THEN
    ALTER TABLE public.users ADD COLUMN gender TEXT; -- 'M', 'F', 'O'
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='emergency_contact') THEN
    ALTER TABLE public.users ADD COLUMN emergency_contact TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='emergency_phone') THEN
    ALTER TABLE public.users ADD COLUMN emergency_phone TEXT;
  END IF;

  -- responsável (para menores de idade)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='guardian_id') THEN
    ALTER TABLE public.users ADD COLUMN guardian_id UUID REFERENCES public.users(id);
  END IF;

  -- status do aluno
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
    ALTER TABLE public.users ADD COLUMN status TEXT DEFAULT 'active'; -- 'active', 'inactive', 'suspended', 'trial'
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='enrolled_at') THEN
    ALTER TABLE public.users ADD COLUMN enrolled_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- =====================
-- 3. VINCULAR CLASSES À ACADEMIA
-- =====================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='academy_id') THEN
    ALTER TABLE public.classes ADD COLUMN academy_id UUID REFERENCES public.academies(id);
  END IF;
END $$;

-- =====================
-- 4. TABELA DE LOGS DE AUDITORIA
-- =====================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES public.academies(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,           -- 'create', 'update', 'delete'
  entity TEXT NOT NULL,           -- 'user', 'class', 'payment', etc.
  entity_id UUID,                 -- ID do registro afetado
  details JSONB DEFAULT '{}',     -- dados extras (antes/depois)
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. RLS POLICIES
-- =====================

-- ACADEMIES
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;

-- Qualquer autenticado pode ver academias (para listagem pública)
CREATE POLICY "Anyone can view academies"
  ON public.academies FOR SELECT
  USING (auth.role() = 'authenticated');

-- Apenas o owner pode editar sua academia
CREATE POLICY "Owner can update academy"
  ON public.academies FOR UPDATE
  USING (auth.uid() = owner_id);

-- Qualquer autenticado pode criar academia (onboarding)
CREATE POLICY "Authenticated can create academy"
  ON public.academies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- USERS: isolamento por academia
-- Cada usuário só vê os membros da própria academia
DROP POLICY IF EXISTS "Users see own academy" ON public.users;
CREATE POLICY "Users see own academy"
  ON public.users FOR SELECT
  USING (
    academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid()
    )
    OR id = auth.uid()
  );

-- CLASSES: isolamento por academia
DROP POLICY IF EXISTS "Classes scoped to academy" ON public.classes;
CREATE POLICY "Classes scoped to academy"
  ON public.classes FOR SELECT
  USING (
    academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid()
    )
  );

-- AUDIT LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins see own academy logs"
  ON public.audit_logs FOR SELECT
  USING (
    academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role pode inserir logs (usado pelo backend)
CREATE POLICY "Service can insert logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- =====================
-- 6. ÍNDICES DE PERFORMANCE
-- =====================
CREATE INDEX IF NOT EXISTS idx_users_academy ON public.users(academy_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_classes_academy ON public.classes(academy_id);
CREATE INDEX IF NOT EXISTS idx_audit_academy ON public.audit_logs(academy_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- =====================
-- 7. FUNÇÃO DE UPDATED_AT AUTOMÁTICO
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para academies
DROP TRIGGER IF EXISTS trigger_academies_updated ON public.academies;
CREATE TRIGGER trigger_academies_updated
  BEFORE UPDATE ON public.academies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger para users
DROP TRIGGER IF EXISTS trigger_users_updated ON public.users;
CREATE TRIGGER trigger_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- FIM DA FASE 1 — FUNDAÇÃO
-- ==========================================
