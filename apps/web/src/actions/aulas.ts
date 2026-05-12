"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createClassAction(formData: FormData) {
  const name = formData.get("name") as string;
  const modality = formData.get("modality") as string;
  const capacity = parseInt(formData.get("capacity") as string, 10);
  const duration = parseInt(formData.get("duration") as string, 10);
  
  if (!name || !modality || isNaN(capacity) || isNaN(duration)) {
    return { success: false, error: "Preencha todos os campos corretamente." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  // Busca o academy_id do admin
  const admin = createAdminClient();
  const { data: userData } = await admin
    .from("users")
    .select("academy_id")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id) {
    return { success: false, error: "Academia não encontrada." };
  }

  // 1. Cria a Aula Mestre vinculada à academia
  const { data: classData, error: classError } = await admin
    .from("classes")
    .insert({
      name,
      modality,
      capacity,
      duration_minutes: duration,
      academy_id: userData.academy_id,
    })
    .select()
    .single();

  if (classError || !classData) {
    return { success: false, error: "Erro ao criar aula mestre." };
  }

  // 2. Gera 5 sessões (uma por dia) a partir de amanhã
  const sessions = [];
  const now = new Date();
  
  for (let i = 1; i <= 5; i++) {
    const sessionStart = new Date(now);
    sessionStart.setDate(now.getDate() + i);
    sessionStart.setHours(19, 0, 0, 0);

    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionStart.getMinutes() + duration);

    sessions.push({
      class_id: classData.id,
      start_time: sessionStart.toISOString(),
      end_time: sessionEnd.toISOString(),
      capacity: classData.capacity
    });
  }

  const { error: sessionError } = await admin
    .from("class_sessions")
    .insert(sessions);

  if (sessionError) {
    return { success: false, error: "Aula mestre criada, mas erro ao gerar sessões." };
  }

  // Log de auditoria
  await admin.from("audit_logs").insert({
    academy_id: userData.academy_id,
    user_id: user.id,
    action: "create",
    entity: "class",
    entity_id: classData.id,
    details: { name, modality, capacity, duration },
  });

  revalidatePath("/admin/aulas");
  return { success: true };
}

export async function getClassesAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, data: [] };

  const admin = createAdminClient();

  // Busca academy_id
  const { data: userData } = await admin
    .from("users")
    .select("academy_id")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id) return { success: false, data: [] };

  // Busca apenas as aulas da academia
  const { data, error } = await admin
    .from("classes")
    .select("*")
    .eq("academy_id", userData.academy_id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, data: [] };
  }
  return { success: true, data };
}
