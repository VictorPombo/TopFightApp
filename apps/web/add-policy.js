const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lbgzefpvbwytyyskshhv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZ3plZnB2Ynd5dHl5c2tzaGh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ5NzUxMSwiZXhwIjoyMDkxMDczNTExfQ.u0tV4WBWcbUkJnePMc-EPYcUsToe8NX7JbESEV6rdJM'
);

async function run() {
  const { error } = await supabase.rpc('exec_sql', { 
    sql: `
      DROP POLICY IF EXISTS "Users can view own data" ON users;
      CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
    ` 
  });
  
  if (error) {
    console.error("RPC Error:", error.message);
  } else {
    console.log("RLS policy applied successfully.");
  }
}

run();
