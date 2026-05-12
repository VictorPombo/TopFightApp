-- ==========================================
-- 🥊 FIGHT HUB - SQL COMPLETO (FASES 1-4)
-- ==========================================
-- Cole TUDO isso no Supabase SQL Editor e clique RUN
-- ==========================================


-- ============================================================
-- FASE 1: FUNDAÇÃO MULTI-TENANT
-- ============================================================

-- 1. TABELA ACADEMIES
CREATE TABLE IF NOT EXISTS public.academies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'SP',
  zip_code TEXT,
  cnpj TEXT UNIQUE,
  owner_id UUID REFERENCES auth.users(id),
  plan TEXT DEFAULT 'free',
  max_students INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXPANDIR TABELA USERS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='academy_id') THEN
    ALTER TABLE public.users ADD COLUMN academy_id UUID REFERENCES public.academies(id);
  END IF;
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
    ALTER TABLE public.users ADD COLUMN gender TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='emergency_contact') THEN
    ALTER TABLE public.users ADD COLUMN emergency_contact TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='emergency_phone') THEN
    ALTER TABLE public.users ADD COLUMN emergency_phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='guardian_id') THEN
    ALTER TABLE public.users ADD COLUMN guardian_id UUID REFERENCES public.users(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
    ALTER TABLE public.users ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='enrolled_at') THEN
    ALTER TABLE public.users ADD COLUMN enrolled_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- 3. VINCULAR CLASSES À ACADEMIA
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='academy_id') THEN
    ALTER TABLE public.classes ADD COLUMN academy_id UUID REFERENCES public.academies(id);
  END IF;
END $$;

-- 4. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES public.academies(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS ACADEMIES
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view academies" ON public.academies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Owner can update academy" ON public.academies FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated can create academy" ON public.academies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS AUDIT LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins see own academy logs" ON public.audit_logs FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Service can insert logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- 6. ÍNDICES FASE 1
CREATE INDEX IF NOT EXISTS idx_users_academy ON public.users(academy_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_classes_academy ON public.classes(academy_id);
CREATE INDEX IF NOT EXISTS idx_audit_academy ON public.audit_logs(academy_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- 7. FUNÇÃO UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_academies_updated ON public.academies;
CREATE TRIGGER trigger_academies_updated
  BEFORE UPDATE ON public.academies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_users_updated ON public.users;
CREATE TRIGGER trigger_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- FASE 2: MÓDULO FINANCEIRO
-- ============================================================

-- 1. PLANOS
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  interval TEXT NOT NULL DEFAULT 'monthly',
  interval_count INT DEFAULT 1,
  modalities TEXT[] DEFAULT '{}',
  max_classes_per_week INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MATRÍCULAS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_billing_date DATE,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PAGAMENTOS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT DEFAULT 'pix',
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  external_id TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS FINANCEIRO
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members see own academy plans" ON public.plans FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admin manages plans" ON public.plans FOR ALL
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users see own subscriptions" ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor')));
CREATE POLICY "Admin manages subscriptions" ON public.subscriptions FOR ALL
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users see own payments" ON public.payments FOR SELECT
  USING (user_id = auth.uid() OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor')));
CREATE POLICY "Admin manages payments" ON public.payments FOR ALL
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ÍNDICES FINANCEIRO
CREATE INDEX IF NOT EXISTS idx_plans_academy ON public.plans(academy_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_academy ON public.subscriptions(academy_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_academy ON public.payments(academy_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due ON public.payments(due_date);

-- TRIGGERS FINANCEIRO
DROP TRIGGER IF EXISTS trigger_plans_updated ON public.plans;
CREATE TRIGGER trigger_plans_updated BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trigger_subscriptions_updated ON public.subscriptions;
CREATE TRIGGER trigger_subscriptions_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trigger_payments_updated ON public.payments;
CREATE TRIGGER trigger_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- FASES 3+4: GAMIFICAÇÃO + EVOLUÇÃO + CAMPEONATOS
-- ============================================================

-- 1. MODALIDADES
CREATE TABLE IF NOT EXISTS public.modalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#EAB308',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SISTEMA DE FAIXAS
CREATE TABLE IF NOT EXISTS public.belt_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modality_id UUID NOT NULL REFERENCES public.modalities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  "order" INT NOT NULL,
  min_time_months INT DEFAULT 0,
  min_checkins INT DEFAULT 0,
  min_techniques INT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROGRESSO NAS FAIXAS
CREATE TABLE IF NOT EXISTS public.belt_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  modality_id UUID NOT NULL REFERENCES public.modalities(id),
  current_belt_id UUID REFERENCES public.belt_systems(id),
  grau INT DEFAULT 0,
  total_checkins INT DEFAULT 0,
  techniques_learned TEXT[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  professor_notes TEXT,
  last_evaluation TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, modality_id)
);

-- 4. XP LOG
CREATE TABLE IF NOT EXISTS public.gamification_xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  academy_id UUID NOT NULL REFERENCES public.academies(id),
  xp_amount INT NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONQUISTAS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES public.academies(id),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏅',
  category TEXT DEFAULT 'general',
  requirement_type TEXT NOT NULL,
  requirement_value INT DEFAULT 1,
  xp_reward INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONQUISTAS DOS ALUNOS
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 7. STREAKS E GAMIFICAÇÃO NO USER
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='current_streak') THEN
    ALTER TABLE public.users ADD COLUMN current_streak INT DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='best_streak') THEN
    ALTER TABLE public.users ADD COLUMN best_streak INT DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='total_xp') THEN
    ALTER TABLE public.users ADD COLUMN total_xp INT DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='level') THEN
    ALTER TABLE public.users ADD COLUMN level INT DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_checkin_date') THEN
    ALTER TABLE public.users ADD COLUMN last_checkin_date DATE;
  END IF;
END $$;

-- 8. DESAFIOS
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL,
  goal_value INT NOT NULL,
  xp_reward INT DEFAULT 200,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- 9. CAMPEONATOS
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  type TEXT DEFAULT 'external',
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tournament_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  category TEXT,
  weight_class TEXT,
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.fight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  tournament_id UUID REFERENCES public.tournaments(id),
  opponent_name TEXT,
  result TEXT NOT NULL,
  method TEXT,
  modality TEXT,
  category TEXT,
  notes TEXT,
  fight_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QR CODE NAS SESSÕES
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='class_sessions' AND column_name='qr_code') THEN
    ALTER TABLE public.class_sessions ADD COLUMN qr_code TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='class_checkins' AND column_name='checked_in_at') THEN
    ALTER TABLE public.class_checkins ADD COLUMN checked_in_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='class_checkins' AND column_name='method') THEN
    ALTER TABLE public.class_checkins ADD COLUMN method TEXT DEFAULT 'manual';
  END IF;
END $$;

-- 11. RLS GAMIFICAÇÃO
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belt_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fight_records ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura por academia
CREATE POLICY "Academy members see modalities" ON public.modalities FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Academy members see belt_systems" ON public.belt_systems FOR SELECT
  USING (modality_id IN (SELECT id FROM public.modalities WHERE academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid())));
CREATE POLICY "Users see own belt_progress" ON public.belt_progress FOR SELECT
  USING (user_id = auth.uid() OR modality_id IN (SELECT id FROM public.modalities WHERE academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor'))));
CREATE POLICY "Users see own xp" ON public.gamification_xp_log FOR SELECT
  USING (user_id = auth.uid() OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Anyone sees achievements" ON public.achievements FOR SELECT
  USING (academy_id IS NULL OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users see own achievements" ON public.user_achievements FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Academy members see challenges" ON public.challenges FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users see own challenge progress" ON public.challenge_participants FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Academy members see tournaments" ON public.tournaments FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users see own entries" ON public.tournament_entries FOR SELECT
  USING (user_id = auth.uid() OR tournament_id IN (SELECT id FROM public.tournaments WHERE academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor'))));
CREATE POLICY "Users see own fights" ON public.fight_records FOR SELECT
  USING (user_id = auth.uid());

-- Full access para service role
CREATE POLICY "Service full modalities" ON public.modalities FOR ALL USING (true);
CREATE POLICY "Service full belt_systems" ON public.belt_systems FOR ALL USING (true);
CREATE POLICY "Service full belt_progress" ON public.belt_progress FOR ALL USING (true);
CREATE POLICY "Service full xp" ON public.gamification_xp_log FOR ALL USING (true);
CREATE POLICY "Service full achievements" ON public.achievements FOR ALL USING (true);
CREATE POLICY "Service full user_achievements" ON public.user_achievements FOR ALL USING (true);
CREATE POLICY "Service full challenges" ON public.challenges FOR ALL USING (true);
CREATE POLICY "Service full challenge_participants" ON public.challenge_participants FOR ALL USING (true);
CREATE POLICY "Service full tournaments" ON public.tournaments FOR ALL USING (true);
CREATE POLICY "Service full tournament_entries" ON public.tournament_entries FOR ALL USING (true);
CREATE POLICY "Service full fight_records" ON public.fight_records FOR ALL USING (true);

-- 12. ÍNDICES
CREATE INDEX IF NOT EXISTS idx_modalities_academy ON public.modalities(academy_id);
CREATE INDEX IF NOT EXISTS idx_belt_progress_user ON public.belt_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user ON public.gamification_xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_academy ON public.gamification_xp_log(academy_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_academy ON public.challenges(academy_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_academy ON public.tournaments(academy_id);
CREATE INDEX IF NOT EXISTS idx_fight_records_user ON public.fight_records(user_id);

-- 13. SEED DE CONQUISTAS GLOBAIS
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, xp_reward) VALUES
  ('Primeiro Treino', 'Fez o primeiro check-in na academia', '🥋', 'frequency', 'checkin_count', 1, 25),
  ('10 Treinos', 'Completou 10 check-ins', '💪', 'frequency', 'checkin_count', 10, 50),
  ('50 Treinos', 'Completou 50 check-ins', '🔥', 'frequency', 'checkin_count', 50, 150),
  ('100 Treinos', 'Centurião! 100 check-ins completos', '🏆', 'frequency', 'checkin_count', 100, 300),
  ('Streak 7 dias', 'Treinou 7 dias consecutivos', '⚡', 'frequency', 'streak_days', 7, 100),
  ('Streak 30 dias', 'Treinou 30 dias consecutivos — INSANO!', '👑', 'frequency', 'streak_days', 30, 500),
  ('Primeira Luta', 'Competiu pela primeira vez', '🥊', 'competition', 'first_fight', 1, 200),
  ('Primeira Vitória', 'Conquistou a primeira vitória em competição', '🏅', 'competition', 'first_win', 1, 300),
  ('Troca de Faixa', 'Recebeu uma nova graduação', '🎖️', 'belt', 'belt_promotion', 1, 250)
ON CONFLICT DO NOTHING;


-- ==========================================
-- ✅ TUDO PRONTO! Agora rode o seed.js
-- ==========================================
