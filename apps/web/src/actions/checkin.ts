"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { processCheckinGamification } from "./gamification";
import { randomBytes } from "crypto";

/**
 * Gera um QR Code token para uma sessão de aula (chamado pelo admin/professor)
 */
export async function generateSessionQRCode(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const admin = createAdminClient();

  // Verifica permissão
  const { data: userData } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role === "aluno") {
    return { success: false, error: "Sem permissão." };
  }

  // Gera token único
  const token = randomBytes(16).toString("hex");
  const qrCode = `FHUB_${sessionId}_${token}`;

  const { error } = await admin
    .from("class_sessions")
    .update({ qr_code: qrCode })
    .eq("id", sessionId);

  if (error) return { success: false, error: "Erro ao gerar QR Code." };

  return { success: true, qrCode };
}

/**
 * Aluno faz check-in via QR Code
 */
export async function checkinByQRCode(qrCode: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const admin = createAdminClient();

  // Busca a sessão pelo QR Code
  const { data: session } = await admin
    .from("class_sessions")
    .select("id, class_id, capacity, is_canceled, start_time, classes(academy_id)")
    .eq("qr_code", qrCode)
    .single();

  if (!session) {
    return { success: false, error: "QR Code inválido ou expirado." };
  }

  if (session.is_canceled) {
    return { success: false, error: "Esta aula foi cancelada." };
  }

  const academyId = (session.classes as any)?.academy_id;

  // Verifica se já fez check-in nessa sessão
  const { data: existing } = await admin
    .from("class_checkins")
    .select("id")
    .eq("session_id", session.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return { success: false, error: "Você já fez check-in nesta aula." };
  }

  // Verifica vagas
  const { count: currentCheckins } = await admin
    .from("class_checkins")
    .select("*", { count: "exact", head: true })
    .eq("session_id", session.id)
    .eq("status", "confirmed");

  if ((currentCheckins || 0) >= session.capacity) {
    return { success: false, error: "Aula lotada! Sem vagas disponíveis." };
  }

  // Faz o check-in
  const { data: checkin, error: checkinError } = await admin
    .from("class_checkins")
    .insert({
      session_id: session.id,
      user_id: user.id,
      status: "confirmed",
      checked_in_at: new Date().toISOString(),
      method: "qr_code",
    })
    .select()
    .single();

  if (checkinError) {
    return { success: false, error: "Erro ao fazer check-in." };
  }

  // Processa gamificação
  if (academyId) {
    const gamification = await processCheckinGamification(user.id, academyId, checkin.id);
    return {
      success: true,
      message: "Check-in realizado com sucesso! 🥊",
      streak: gamification.streak,
      xpEarned: 10,
    };
  }

  return { success: true, message: "Check-in realizado!" };
}

/**
 * Check-in manual (pelo professor/admin)
 */
export async function manualCheckin(sessionId: string, studentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const admin = createAdminClient();

  const { data: callerData } = await admin
    .from("users")
    .select("role, academy_id")
    .eq("id", user.id)
    .single();

  if (!callerData || callerData.role === "aluno") {
    return { success: false, error: "Sem permissão." };
  }

  // Verifica duplicata
  const { data: existing } = await admin
    .from("class_checkins")
    .select("id")
    .eq("session_id", sessionId)
    .eq("user_id", studentId)
    .single();

  if (existing) {
    return { success: false, error: "Aluno já fez check-in nesta aula." };
  }

  const { data: checkin, error } = await admin
    .from("class_checkins")
    .insert({
      session_id: sessionId,
      user_id: studentId,
      status: "confirmed",
      checked_in_at: new Date().toISOString(),
      method: "manual",
    })
    .select()
    .single();

  if (error) return { success: false, error: "Erro ao registrar presença." };

  // Processa gamificação
  if (callerData.academy_id) {
    await processCheckinGamification(studentId, callerData.academy_id, checkin.id);
  }

  return { success: true };
}

/**
 * Busca lista de presença de uma sessão
 */
export async function getSessionAttendance(sessionId: string) {
  const admin = createAdminClient();

  const { data } = await admin
    .from("class_checkins")
    .select("id, status, checked_in_at, method, users(id, nome, email, avatar_url)")
    .eq("session_id", sessionId)
    .order("checked_in_at", { ascending: true });

  return data || [];
}
