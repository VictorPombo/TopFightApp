-- ==========================================
-- FIGHT HUB - FASE 3+4: GAMIFICAÇÃO + EVOLUÇÃO
-- ==========================================
-- Execute APÓS phase1 e phase2
-- ==========================================

-- =====================
-- 1. MODALIDADES DA ACADEMIA
-- =====================
CREATE TABLE IF NOT EXISTS public.modalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                      -- "Jiu-Jitsu", "Muay Thai"
  description TEXT,
  icon TEXT,                               -- emoji ou nome do ícone
  color TEXT DEFAULT '#EAB308',            -- cor hex do badge
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. SISTEMA DE FAIXAS
-- =====================
CREATE TABLE IF NOT EXISTS public.belt_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modality_id UUID NOT NULL REFERENCES public.modalities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                      -- "Branca", "Azul", "Roxa"
  color TEXT NOT NULL,                     -- "#FFFFFF", "#0000FF"
  "order" INT NOT NULL,                    -- 1, 2, 3... para ordenar
  min_time_months INT DEFAULT 0,           -- tempo mínimo na faixa anterior
  min_checkins INT DEFAULT 0,             -- check-ins mínimos
  min_techniques INT DEFAULT 0,           -- técnicas mínimas
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. PROGRESSO DO ALUNO NAS FAIXAS
-- =====================
CREATE TABLE IF NOT EXISTS public.belt_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  modality_id UUID NOT NULL REFERENCES public.modalities(id),
  current_belt_id UUID REFERENCES public.belt_systems(id),
  grau INT DEFAULT 0,                     -- graus na faixa (0-4)
  total_checkins INT DEFAULT 0,
  techniques_learned TEXT[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),   -- quando entrou nessa faixa
  professor_notes TEXT,
  last_evaluation TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, modality_id)
);

-- =====================
-- 4. GAMIFICAÇÃO - XP
-- =====================
CREATE TABLE IF NOT EXISTS public.gamification_xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  academy_id UUID NOT NULL REFERENCES public.academies(id),
  xp_amount INT NOT NULL,
  reason TEXT NOT NULL,                    -- 'checkin', 'streak_7', 'first_fight', 'belt_promotion'
  reference_id UUID,                       -- ID do checkin, luta, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. CONQUISTAS / MEDALHAS
-- =====================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES public.academies(id),  -- NULL = conquista global
  name TEXT NOT NULL,                      -- "Guerreiro de 30 dias"
  description TEXT,
  icon TEXT DEFAULT '🏅',
  category TEXT DEFAULT 'general',         -- 'frequency', 'competition', 'belt', 'special'
  requirement_type TEXT NOT NULL,          -- 'checkin_count', 'streak_days', 'first_fight', 'belt_promotion'
  requirement_value INT DEFAULT 1,         -- quantidade necessária
  xp_reward INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 6. CONQUISTAS DOS ALUNOS
-- =====================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- =====================
-- 7. STREAKS DE TREINO
-- =====================
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

-- =====================
-- 8. DESAFIOS MENSAIS
-- =====================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                      -- "Desafio de Maio"
  description TEXT,
  goal_type TEXT NOT NULL,                 -- 'checkin_count', 'streak_days', 'xp_amount'
  goal_value INT NOT NULL,                 -- 20 check-ins, 14 dias seguidos, etc.
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

-- =====================
-- 9. CAMPEONATOS E LUTAS
-- =====================
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  type TEXT DEFAULT 'external',            -- 'internal', 'external'
  status TEXT DEFAULT 'upcoming',          -- 'upcoming', 'ongoing', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tournament_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  category TEXT,                           -- "Adulto Faixa Azul Meio-Pesado"
  weight_class TEXT,
  status TEXT DEFAULT 'registered',        -- 'registered', 'confirmed', 'withdrawn'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.fight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  tournament_id UUID REFERENCES public.tournaments(id),
  opponent_name TEXT,
  result TEXT NOT NULL,                    -- 'win', 'loss', 'draw'
  method TEXT,                             -- 'submission', 'points', 'ko', 'tko', 'decision'
  modality TEXT,
  category TEXT,
  notes TEXT,
  fight_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 10. QR CODE SESSIONS
-- =====================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='class_sessions' AND column_name='qr_code') THEN
    ALTER TABLE public.class_sessions ADD COLUMN qr_code TEXT;  -- token único para check-in
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='class_checkins' AND column_name='checked_in_at') THEN
    ALTER TABLE public.class_checkins ADD COLUMN checked_in_at TIMESTAMPTZ; -- momento exato do check-in
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='class_checkins' AND column_name='method') THEN
    ALTER TABLE public.class_checkins ADD COLUMN method TEXT DEFAULT 'manual'; -- 'qr_code', 'manual', 'biometric'
  END IF;
END $$;

-- =====================
-- 11. RLS POLICIES
-- =====================
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

-- Acesso genérico: membros da academia veem tudo da própria
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

-- Full access para admin (via service role no backend)
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

-- =====================
-- 12. ÍNDICES
-- =====================
CREATE INDEX IF NOT EXISTS idx_modalities_academy ON public.modalities(academy_id);
CREATE INDEX IF NOT EXISTS idx_belt_progress_user ON public.belt_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user ON public.gamification_xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_academy ON public.gamification_xp_log(academy_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_academy ON public.challenges(academy_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_academy ON public.tournaments(academy_id);
CREATE INDEX IF NOT EXISTS idx_fight_records_user ON public.fight_records(user_id);

-- =====================
-- 13. SEED DE CONQUISTAS GLOBAIS
-- =====================
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
-- FIM DAS FASES 3+4
-- ==========================================
