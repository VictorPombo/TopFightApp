require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
async function check() {
  const { data, error } = await supabase.from('classes').select('*').limit(1);
  if (error) console.log("ERRO CLASSES:", error.message);
  else console.log("CLASSES OK, keys:", data.length > 0 ? Object.keys(data[0]) : "vazio, mas a tabela existe. Colunas não vieram se vazio. Vou tentar inserir.");
  
  // Pegar schema usando views do postgres não rola por auth. Vamos ver via schema cache error:
  const { error: e3 } = await supabase.from('classes').select('academy_id').limit(1);
  console.log("TEM ACADEMY_ID EM CLASSES?", e3 ? e3.message : "SIM");
  
  process.exit(0);
}
check();
