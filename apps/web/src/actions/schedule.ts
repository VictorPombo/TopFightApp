"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getScheduleAction(dateStr?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("academy_id, role")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id) {
    return { success: false, error: "Academy not found" };
  }

  // Define data de início e fim
  const today = dateStr ? new Date(dateStr) : new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Pega as sessões (aulas agendadas)
  const { data: sessions } = await supabase
    .from("class_sessions")
    .select(`
      id,
      start_time,
      end_time,
      current_capacity,
      max_capacity,
      classes ( id, name, modality, default_capacity )
    `)
    .gte("start_time", today.toISOString())
    .lte("start_time", endOfDay.toISOString())
    .order("start_time", { ascending: true });

  // Se for aluno, pega as reservas que ele já fez pra saber se o botão deve ser Cancelar ou Reservar
  let userReservations: any[] = [];
  if (userData.role === "aluno") {
    const { data: res } = await supabase
      .from("class_reservations")
      .select("session_id, status")
      .eq("user_id", user.id)
      .in("status", ["reserved", "attended"]);
    
    if (res) userReservations = res;
  }

  return { 
    success: true, 
    sessions: sessions || [], 
    userReservations 
  };
}

export async function reserveClassAction(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // 1. Verifica se a aula tem vaga
  const { data: session } = await supabase
    .from("class_sessions")
    .select("current_capacity, max_capacity")
    .eq("id", sessionId)
    .single();

  if (!session) return { success: false, error: "Sessão não encontrada" };
  if (session.current_capacity >= session.max_capacity) {
    return { success: false, error: "Aula Esgotada!" };
  }

  // 2. Cria a reserva
  const { error: reserveError } = await supabase
    .from("class_reservations")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      status: 'reserved'
    });

  if (reserveError) {
    if (reserveError.code === "23505") {
      return { success: false, error: "Você já está reservado nesta aula." };
    }
    return { success: false, error: "Erro ao reservar aula." };
  }

  // 3. Atualiza a capacidade (current_capacity)
  await supabase
    .from("class_sessions")
    .update({ current_capacity: session.current_capacity + 1 })
    .eq("id", sessionId);

  revalidatePath("/aluno/grade");
  return { success: true };
}

export async function cancelReservationAction(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // 1. Pega a reserva
  const { data: reservation } = await supabase
    .from("class_reservations")
    .select("id")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!reservation) return { success: false, error: "Reserva não encontrada" };

  // 2. Deleta a reserva (ou muda status para cancelled)
  await supabase
    .from("class_reservations")
    .delete()
    .eq("id", reservation.id);

  // 3. Devolve a vaga
  const { data: session } = await supabase
    .from("class_sessions")
    .select("current_capacity")
    .eq("id", sessionId)
    .single();

  if (session && session.current_capacity > 0) {
    await supabase
      .from("class_sessions")
      .update({ current_capacity: session.current_capacity - 1 })
      .eq("id", sessionId);
  }

  revalidatePath("/aluno/grade");
  return { success: true };
}
