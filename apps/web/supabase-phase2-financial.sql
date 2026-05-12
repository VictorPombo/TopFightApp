-- ==========================================
-- FIGHT HUB - FASE 2: MÓDULO FINANCEIRO
-- ==========================================
-- Execute APÓS o supabase-phase1-foundation.sql
-- ==========================================

-- =====================
-- 1. PLANOS DA ACADEMIA
-- =====================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                     -- "Mensal", "Trimestral", "Anual"
  description TEXT,
  price DECIMAL(10,2) NOT NULL,           -- 150.00
  interval TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'quarterly', 'semiannual', 'annual'
  interval_count INT DEFAULT 1,            -- a cada X meses
  modalities TEXT[] DEFAULT '{}',          -- {'Jiu-Jitsu', 'Muay Thai'} ou {} = todas
  max_classes_per_week INT,                -- NULL = ilimitado
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. MATRÍCULAS (Vínculo aluno → plano)
-- =====================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active',   -- 'active', 'overdue', 'cancelled', 'paused', 'trial'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_billing_date DATE,                  -- próxima cobrança
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. PAGAMENTOS
-- =====================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT DEFAULT 'pix',               -- 'pix', 'credit_card', 'boleto', 'cash', 'transfer'
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'paid', 'overdue', 'refunded', 'cancelled'
  description TEXT,                        -- "Mensalidade Março 2026"
  due_date DATE,                           -- vencimento
  paid_at TIMESTAMPTZ,                     -- quando foi pago
  external_id TEXT,                        -- ID do Mercado Pago / Asaas
  receipt_url TEXT,                        -- comprovante
  notes TEXT,                              -- observações
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. RLS POLICIES
-- =====================
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- PLANS: membros da academia podem ver os planos
CREATE POLICY "Members see own academy plans"
  ON public.plans FOR SELECT
  USING (
    academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Admin pode gerenciar planos
CREATE POLICY "Admin manages plans"
  ON public.plans FOR ALL
  USING (
    academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SUBSCRIPTIONS: aluno vê a própria, admin vê todas da academia
CREATE POLICY "Users see own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    user_id = auth.uid()
    OR academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor')
    )
  );

CREATE POLICY "Admin manages subscriptions"
  ON public.subscriptions FOR ALL
  USING (
    academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PAYMENTS: aluno vê os próprios, admin vê todos
CREATE POLICY "Users see own payments"
  ON public.payments FOR SELECT
  USING (
    user_id = auth.uid()
    OR academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor')
    )
  );

CREATE POLICY "Admin manages payments"
  ON public.payments FOR ALL
  USING (
    academy_id IN (
      SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- 5. ÍNDICES
-- =====================
CREATE INDEX IF NOT EXISTS idx_plans_academy ON public.plans(academy_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_academy ON public.subscriptions(academy_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_academy ON public.payments(academy_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due ON public.payments(due_date);

-- =====================
-- 6. TRIGGERS
-- =====================
DROP TRIGGER IF EXISTS trigger_plans_updated ON public.plans;
CREATE TRIGGER trigger_plans_updated
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_subscriptions_updated ON public.subscriptions;
CREATE TRIGGER trigger_subscriptions_updated
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_payments_updated ON public.payments;
CREATE TRIGGER trigger_payments_updated
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- FIM DA FASE 2 — FINANCEIRO
-- ==========================================
