-- ==========================================
-- FIGHT HUB - EPIC 1: AGENDA E CHECK-IN
-- ==========================================

-- 1. Tabela CLASSES (Modelos Base de Aula)
-- Representa a grade fixa (ex: Jiu Jitsu, Seg/Qua/Sex, 19:00, 30 vagas)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- Ex: "Muay Thai Iniciante"
  modality TEXT NOT NULL, -- Ex: "Muay Thai"
  instructor_id UUID REFERENCES public.users(id),
  capacity INT NOT NULL DEFAULT 20, -- Quantas pessoas cabem no tatame
  duration_minutes INT NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela CLASS_SESSIONS (Aulas reais que vão acontecer em dias específicos)
-- Representa a aula de Quarta-feira, dia 15, às 19h
CREATE TABLE IF NOT EXISTS public.class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INT NOT NULL, -- Herdado de classes, mas pode ser ajustado
  is_canceled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela CLASS_CHECKINS (As reservas dos alunos)
-- Onde a mágica acontece. O aluno garante a vaga aqui.
CREATE TABLE IF NOT EXISTS public.class_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'waitlist'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id) -- Impede que o aluno faça check-in 2x na mesma aula
);

-- Políticas de Segurança (RLS) para Check-ins
ALTER TABLE public.class_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário pode ver a grade e as aulas (SELECT liberado)
CREATE POLICY "Qualquer um logado pode ver as aulas mestre" ON public.classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer um logado pode ver as sessoes reais" ON public.class_sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer um logado pode ver os checkins" ON public.class_checkins FOR SELECT USING (auth.role() = 'authenticated');

-- Aluno pode fazer check-in apenas no próprio nome
CREATE POLICY "Aluno faz o proprio checkin" ON public.class_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Aluno pode cancelar o próprio check-in
CREATE POLICY "Aluno pode cancelar checkin" ON public.class_checkins FOR DELETE USING (auth.uid() = user_id);

-- Para testarmos facilmente agora, liberaremos geral para desenvolvimento
-- Em prod limitaremos INSERT de classes apenas para ADMIN.
CREATE POLICY "Dev Full Access Classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Dev Full Access Sessions" ON public.class_sessions FOR ALL USING (true);
CREATE POLICY "Dev Full Access Checkins" ON public.class_checkins FOR ALL USING (true);
