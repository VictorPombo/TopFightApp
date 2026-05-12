-- ==========================================
-- 🥊 FIGHT HUB - PARTE 2: RLS POLICIES
-- ==========================================
-- RODE DEPOIS DA PARTE 1
-- ==========================================

-- ACADEMIES
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view academies" ON public.academies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Owner can update academy" ON public.academies FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated can create academy" ON public.academies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- AUDIT LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins see own academy logs" ON public.audit_logs FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Service can insert logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- PLANS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members see own academy plans" ON public.plans FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admin manages plans" ON public.plans FOR ALL
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- SUBSCRIPTIONS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own subscriptions" ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor')));
CREATE POLICY "Admin manages subscriptions" ON public.subscriptions FOR ALL
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own payments" ON public.payments FOR SELECT
  USING (user_id = auth.uid() OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor')));
CREATE POLICY "Admin manages payments" ON public.payments FOR ALL
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- MODALITIES
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academy members see modalities" ON public.modalities FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Service full modalities" ON public.modalities FOR ALL USING (true);

-- BELT SYSTEMS
ALTER TABLE public.belt_systems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academy members see belt_systems" ON public.belt_systems FOR SELECT
  USING (modality_id IN (SELECT id FROM public.modalities WHERE academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid())));
CREATE POLICY "Service full belt_systems" ON public.belt_systems FOR ALL USING (true);

-- BELT PROGRESS
ALTER TABLE public.belt_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own belt_progress" ON public.belt_progress FOR SELECT
  USING (user_id = auth.uid() OR modality_id IN (SELECT id FROM public.modalities WHERE academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor'))));
CREATE POLICY "Service full belt_progress" ON public.belt_progress FOR ALL USING (true);

-- XP LOG
ALTER TABLE public.gamification_xp_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own xp" ON public.gamification_xp_log FOR SELECT
  USING (user_id = auth.uid() OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Service full xp" ON public.gamification_xp_log FOR ALL USING (true);

-- ACHIEVEMENTS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone sees achievements" ON public.achievements FOR SELECT
  USING (academy_id IS NULL OR academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Service full achievements" ON public.achievements FOR ALL USING (true);

-- USER ACHIEVEMENTS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own achievements" ON public.user_achievements FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service full user_achievements" ON public.user_achievements FOR ALL USING (true);

-- CHALLENGES
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academy members see challenges" ON public.challenges FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Service full challenges" ON public.challenges FOR ALL USING (true);

-- CHALLENGE PARTICIPANTS
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own challenge progress" ON public.challenge_participants FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service full challenge_participants" ON public.challenge_participants FOR ALL USING (true);

-- TOURNAMENTS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academy members see tournaments" ON public.tournaments FOR SELECT
  USING (academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Service full tournaments" ON public.tournaments FOR ALL USING (true);

-- TOURNAMENT ENTRIES
ALTER TABLE public.tournament_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own entries" ON public.tournament_entries FOR SELECT
  USING (user_id = auth.uid() OR tournament_id IN (SELECT id FROM public.tournaments WHERE academy_id IN (SELECT academy_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'professor'))));
CREATE POLICY "Service full tournament_entries" ON public.tournament_entries FOR ALL USING (true);

-- FIGHT RECORDS
ALTER TABLE public.fight_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own fights" ON public.fight_records FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service full fight_records" ON public.fight_records FOR ALL USING (true);

-- ==========================================
-- ✅ PARTE 2 CONCLUÍDA! Agora rode o seed.js
-- ==========================================
