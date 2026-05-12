require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');

// Verifica se as credenciais existem
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("ERRO: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env.local");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function seed() {
  console.log('🥊 Fight Hub - Seed Script\n');

  // 1. Criar academia
  console.log('📍 Criando academia...');
  const { data: academy, error: academyError } = await supabase
    .from('academies')
    .upsert({
      name: 'CT Fight Hub Demo',
      slug: 'ct-fight-hub-demo',
      phone: '(11) 99999-9999',
      city: 'São Paulo',
      state: 'SP',
      plan: 'pro',
      max_students: 200,
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (academyError) {
    console.error('Erro ao criar academia:', academyError.message);
    return;
  }
  console.log(`✅ Academia: ${academy.name} (${academy.id})`);

  // 2. Criar usuários
  const usersToCreate = [
    { email: 'admin@fighthub.com', password: 'password123', role: 'admin', nome: 'Mestre Splinter' },
    { email: 'professor@fighthub.com', password: 'password123', role: 'professor', nome: 'Sensei Rafael' },
    { email: 'aluno@fighthub.com', password: 'password123', role: 'aluno', nome: 'João Silva' },
    { email: 'aluno2@fighthub.com', password: 'password123', role: 'aluno', nome: 'Maria Santos' },
    { email: 'aluno3@fighthub.com', password: 'password123', role: 'aluno', nome: 'Pedro Costa' },
  ];

  for (const user of usersToCreate) {
    console.log(`\n👤 Criando ${user.role}: ${user.email}...`);

    let userId;

    // Cria auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authError) {
      console.log(`  ⚠️ Auth: ${authError.message}`);
      // Tenta buscar existente
      const { data: usersList } = await supabase.auth.admin.listUsers();
      const existing = usersList?.users?.find(u => u.email === user.email);
      if (existing) {
        userId = existing.id;
        console.log(`  ♻️ Usando existente: ${userId}`);
      } else {
        continue;
      }
    } else {
      userId = authData.user.id;
    }

    // Upsert na tabela public.users
    const { error: dbError } = await supabase.from('users').upsert({
      id: userId,
      email: user.email,
      nome: user.nome,
      role: user.role,
      academy_id: academy.id,
      status: 'active',
      total_xp: user.role === 'aluno' ? Math.floor(Math.random() * 500) : 0,
      level: user.role === 'aluno' ? Math.floor(Math.random() * 5) + 1 : 1,
      current_streak: user.role === 'aluno' ? Math.floor(Math.random() * 10) : 0,
    });

    if (dbError) {
      console.error(`  ❌ DB: ${dbError.message}`);
    } else {
      console.log(`  ✅ ${user.nome} (${user.role})`);
    }

    // Set owner
    if (user.role === 'admin') {
      await supabase.from('academies').update({ owner_id: userId }).eq('id', academy.id);
    }
  }

  // 3. Criar modalidades
  console.log('\n🥋 Criando modalidades...');
  const modalities = [
    { name: 'Jiu-Jitsu', icon: '🥋', color: '#3B82F6' },
    { name: 'Muay Thai', icon: '🥊', color: '#EF4444' },
    { name: 'Boxe', icon: '🥊', color: '#F59E0B' },
    { name: 'MMA', icon: '⚔️', color: '#8B5CF6' },
  ];

  for (const mod of modalities) {
    const { error } = await supabase.from('modalities').upsert({
      academy_id: academy.id,
      name: mod.name,
      icon: mod.icon,
      color: mod.color,
    }, { onConflict: 'academy_id,name', ignoreDuplicates: true });
    
    if (!error) console.log(`  ✅ ${mod.icon} ${mod.name}`);
  }

  // 4. Criar planos
  console.log('\n💰 Criando planos...');
  const plans = [
    { name: 'Mensal Básico', price: 129.90, interval: 'monthly', description: '1 modalidade' },
    { name: 'Mensal Completo', price: 179.90, interval: 'monthly', description: 'Todas as modalidades' },
    { name: 'Trimestral', price: 449.90, interval: 'quarterly', description: 'Todas as modalidades + desconto' },
    { name: 'Anual', price: 1499.90, interval: 'annual', description: 'Melhor custo-benefício' },
  ];

  for (const plan of plans) {
    const { error } = await supabase.from('plans').insert({
      academy_id: academy.id,
      ...plan,
    });
    if (!error) console.log(`  ✅ ${plan.name}: R$ ${plan.price}`);
  }

  // 5. Criar aulas
  console.log('\n📅 Criando grade de aulas...');
  const classes = [
    { name: 'Jiu-Jitsu Iniciante 19h', modality: 'Jiu-Jitsu', capacity: 25, duration_minutes: 60 },
    { name: 'Muay Thai 20h', modality: 'Muay Thai', capacity: 20, duration_minutes: 60 },
    { name: 'Boxe 18h', modality: 'Boxe', capacity: 15, duration_minutes: 60 },
    { name: 'MMA Avançado 21h', modality: 'MMA', capacity: 15, duration_minutes: 90 },
  ];

  for (const cls of classes) {
    const { data: classData, error: clsError } = await supabase
      .from('classes')
      .insert({ ...cls, academy_id: academy.id })
      .select()
      .single();

    if (clsError) { console.error(`  ❌ ${cls.name}: ${clsError.message}`); continue; }
    console.log(`  ✅ ${cls.name}`);

    // Gera sessões para os próximos 7 dias
    const sessions = [];
    for (let i = 0; i < 7; i++) {
      const start = new Date();
      start.setDate(start.getDate() + i);
      start.setHours(parseInt(cls.name.match(/(\d+)h/)?.[1] || '19'), 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + cls.duration_minutes);

      sessions.push({
        class_id: classData.id,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        capacity: cls.capacity,
      });
    }

    await supabase.from('class_sessions').insert(sessions);
  }

  console.log('\n🎉 Seed completo! Credenciais de acesso:');
  console.log('  Admin:     admin@fighthub.com / password123');
  console.log('  Professor: professor@fighthub.com / password123');
  console.log('  Aluno:     aluno@fighthub.com / password123');
}

seed().then(() => console.log('\nDone ✅')).catch(console.error);
