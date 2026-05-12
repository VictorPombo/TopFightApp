"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Por favor, preencha todos os campos." };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
         return { success: false, error: "Email ou senha incorretos." };
      }
      return { success: false, error: "Erro ao realizar o login." };
    }

    if (data.user) {
      // Cria cliente Admin para ignorar o RLS e conseguir buscar a role
      const { createClient } = await import('@supabase/supabase-js');
      const adminAuthClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Verifica a role na tabela users
      const { data: userData, error: userError } = await adminAuthClient
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError || !userData) {
        console.error("User Fetch Error:", userError);
        // Se der erro ou não achar na tabela customizada, desloga e avisa.
        await supabase.auth.signOut();
        return { success: false, error: "Conta não configurada corretamente. Fale com o suporte." };
      }

      if (userData.role === "aluno") {
        return { success: true, redirectUrl: "/aluno" };
      }

      // Se for admin ou professor, o login é permitido e vai para /admin
      return { success: true, redirectUrl: "/admin" };
    }

    return { success: false, error: "Erro desconhecido." };
  } catch (error) {
    return { success: false, error: "Erro interno no servidor." };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true, redirectUrl: "/login" };
}
