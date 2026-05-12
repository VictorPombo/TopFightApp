require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

async function fix() {
  const { error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 30;' });
  if (error && error.code === 'PGRST202') {
     console.log("Não existe RPC exec_sql. Vou gerar o SQL para o usuário colar.");
  } else if (!error) {
     console.log("Corrigido via RPC!");
  }
  process.exit(0);
}
fix();
