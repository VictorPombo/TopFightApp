const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("⚠️ Faltando variáveis de ambiente!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createTestUser() {
  console.log("⏳ Criando conta teste@gmail.com...");
  
  // 1. Busca a primeira academia cadastrada
  const { data: academy } = await supabase.from('academies').select('id').limit(1).single();
  
  if (!academy) {
    console.error("⚠️ Nenhuma academia encontrada. Rode o seed primeiro.");
    process.exit(1);
  }

  // 2. Cria o usuário no Auth
  const email = "teste@gmail.com";
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: "123456",
    email_confirm: true,
    user_metadata: {
      nome: "Usuário Teste",
    }
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      console.log("⚠️ E-mail já registrado! Tentando atualizar a senha para 123456...");
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === email);
      
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, { password: "123456" });
        console.log("✅ Senha atualizada para 123456 com sucesso!");
        
        // Atualiza a role na tabela users
        await supabase.from('users').update({ role: 'admin', academy_id: academy.id }).eq('id', existingUser.id);
        console.log("✅ Permissões de Admin (Acesso Geral) aplicadas!");
        process.exit(0);
      }
    } else {
      console.error("❌ Erro ao criar auth user:", authError);
      process.exit(1);
    }
  }

  // 3. Atualiza a tabela public.users
  if (authUser?.user) {
    const { error: dbError } = await supabase.from('users').update({
      nome: "Usuário Teste",
      role: 'admin',
      academy_id: academy.id,
      status: 'active'
    }).eq('id', authUser.user.id);

    if (dbError) {
      console.error("❌ Erro ao atualizar tabela users:", dbError);
    } else {
      console.log("✅ Usuário teste@gmail.com (Senha: 123456) criado com acesso de ADMIN!");
    }
  }
}

createTestUser();
