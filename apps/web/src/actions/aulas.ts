"use server";

import { createClient } from "@/lib/supabase/server";
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

  // 1. Cria a Aula Mestre
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .insert({
      name,
      modality,
      capacity,
      duration_minutes: duration
    })
    .select()
    .single();

  if (classError || !classData) {
    return { success: false, error: "Erro ao criar aula mestre." };
  }

  // 2. Gera 5 sessões (uma por dia) a partir de amanhã, apenas como exemplo para popular a grade.
  // Num sistema real completo, teríamos dias da semana, mas pro MVP vamos gerar sessões diretas.
  const sessions = [];
  const now = new Date();
  
  for (let i = 1; i <= 5; i++) {
    const sessionStart = new Date(now);
    sessionStart.setDate(now.getDate() + i);
    sessionStart.setHours(19, 0, 0, 0); // Define as 19h

    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionStart.getMinutes() + duration);

    sessions.push({
      class_id: classData.id,
      start_time: sessionStart.toISOString(),
      end_time: sessionEnd.toISOString(),
      capacity: classData.capacity
    });
  }

  const { error: sessionError } = await supabase
    .from("class_sessions")
    .insert(sessions);

  if (sessionError) {
    return { success: false, error: "Aula mestre criada, mas erro ao gerar sessões." };
  }

  revalidatePath("/admin/aulas");
  return { success: true };
}

export async function getClassesAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, data: [] };
  }
  return { success: true, data };
}
