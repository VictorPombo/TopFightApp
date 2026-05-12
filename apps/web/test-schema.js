require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function check() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) console.log("ERRO USERS:", error.message);
  else console.log("USERS OK, keys:", data.length > 0 ? Object.keys(data[0]) : "vazio");
  
  const { data: d2, error: e2 } = await supabase.rpc('get_schema_info').select('*').limit(1);
  console.log(e2);
  process.exit(0);
}
check();
