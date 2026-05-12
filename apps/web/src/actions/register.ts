"use server";

import { createClient } from "@/lib/supabase/server";

export async function registerAction(formData: FormData) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = "aluno"; // Apenas alunos podem criar conta sozinhos

  if (!nome || !email || !password) {
    return { success: false, error: "Por favor, preencha todos os campos." };
  }

  const supabase = await createClient();

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        }
      }
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return { success: false, error: "Este e-mail já está em uso." };
      }
      return { success: false, error: "Erro ao criar conta." };
    }

    if (authData.user) {
      // Injeta no public.users (Usando Admin Client para garantir bypass de RLS)
      const { createClient: createAdmin } = await import('@supabase/supabase-js');
      const adminAuthClient = createAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error: dbError } = await adminAuthClient.from("users").upsert({
        id: authData.user.id,
        email: email,
        nome: nome,
        role: role
      });

      if (dbError) {
        return { success: false, error: "Erro ao configurar perfil." };
      }

      // O aluno criou a conta com sucesso. Redireciona para o portal responsivo do aluno.
      return { success: true, redirectUrl: "/aluno" };
    }

    return { success: false, error: "Erro desconhecido." };
  } catch (error) {
    return { success: false, error: "Erro interno no servidor." };
  }
}
