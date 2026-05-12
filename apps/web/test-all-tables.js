require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

async function check() {
  const tables = ['users', 'classes', 'achievements', 'audit_logs', 'plans', 'subscriptions', 'payments', 'modalities', 'gamification_xp_log', 'challenges', 'tournaments'];
  let errs = [];
  for (const t of tables) {
    const { error } = await supabase.from(t).select('academy_id').limit(1);
    if (error) errs.push(`${t}: ${error.message}`);
  }
  console.log(errs.length ? errs.join('\n') : "TODAS OK!");
  process.exit(0);
}
check();
