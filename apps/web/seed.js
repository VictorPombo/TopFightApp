const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lbgzefpvbwytyyskshhv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZ3plZnB2Ynd5dHl5c2tzaGh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ5NzUxMSwiZXhwIjoyMDkxMDczNTExfQ.u0tV4WBWcbUkJnePMc-EPYcUsToe8NX7JbESEV6rdJM'
);

async function seed() {
  const usersToCreate = [
    { email: 'admin@fighthub.com', password: 'password', role: 'admin' },
    { email: 'professor@fighthub.com', password: 'password', role: 'professor' },
    { email: 'aluno@fighthub.com', password: 'password', role: 'aluno' }
  ];

  for (const user of usersToCreate) {
    console.log(`Creating ${user.email}...`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    });

    if (authError) {
      console.error(`Error creating auth for ${user.email}:`, authError.message);
      // It might already exist, try to fetch it
      const { data: usersList } = await supabase.auth.admin.listUsers();
      const existingUser = usersList.users.find(u => u.email === user.email);
      
      if (existingUser) {
        // Upsert into public.users
        await supabase.from('users').upsert({ id: existingUser.id, email: user.email, role: user.role, nome: user.role.toUpperCase() });
        console.log(`Updated existing role for ${user.email}`);
      }
    } else if (authData.user) {
      // The auth trigger might create the row in public.users, but we need to set the role
      const { error: dbError } = await supabase.from('users').upsert({
        id: authData.user.id,
        email: user.email,
        role: user.role,
        nome: user.role.toUpperCase()
      });
      if (dbError) {
        console.error(`Error updating role for ${user.email}:`, dbError.message);
      } else {
        console.log(`Created ${user.email} successfully.`);
      }
    }
  }
}

seed().then(() => console.log('Done'));
