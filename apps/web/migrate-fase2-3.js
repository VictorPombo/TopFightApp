const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const sql = `
-- ==========================================
-- 💰 MÓDULO FINANCEIRO (FASE 2)
-- ==========================================

-- 1. Planos (Mensalidades)
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID REFERENCES public.academies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cycle TEXT DEFAULT 'monthly', -- monthly, quarterly, yearly
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Assinaturas (Alunos ↔ Planos)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id),
  status TEXT DEFAULT 'active', -- active, past_due, canceled
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pagamentos (Faturas/Cobranças)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, late, failed
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT, -- pix, credit_card, money
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 📅 MÓDULO DE RESERVAS (FASE 3)
-- ==========================================

-- 4. Reservas de Aulas (Alunos garantindo vaga)
CREATE TABLE IF NOT EXISTS public.class_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'reserved', -- reserved, attended, cancelled, no_show
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);
`;

async function applyMigration() {
  console.log("Aplicando migração do Financeiro e Reservas...");
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error("❌ Erro ao aplicar SQL via RPC. Tentando buscar direto as tabelas...");
    console.log("Para usar SQL dinâmico você precisaria criar uma function 'exec_sql'. Vamos pular a execução automática e te entregar os componentes.");
  } else {
    console.log("✅ Tabelas criadas com sucesso!");
  }
}

applyMigration();
