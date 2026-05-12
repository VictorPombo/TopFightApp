"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Cria a academia + vincula o usuário logado como owner/admin
 */
export async function createAcademyAction(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;

  if (!name) {
    return { success: false, error: "Nome da academia é obrigatório." };
  }

  // Gera slug a partir do nome
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const admin = createAdminClient();

  // Verifica se slug já existe
  const { data: existing } = await admin
    .from("academies")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return { success: false, error: "Já existe uma academia com nome similar. Escolha outro." };
  }

  // Cria a academia
  const { data: academy, error: academyError } = await admin
    .from("academies")
    .insert({
      name,
      slug,
      phone: phone || null,
      city: city || null,
      state: state || "SP",
      owner_id: user.id,
    })
    .select()
    .single();

  if (academyError || !academy) {
    console.error("Academy creation error:", academyError);
    return { success: false, error: "Erro ao criar academia." };
  }

  // Atualiza o usuário como admin da academia
  const { error: userError } = await admin
    .from("users")
    .update({
      academy_id: academy.id,
      role: "admin",
      status: "active",
    })
    .eq("id", user.id);

  if (userError) {
    console.error("User update error:", userError);
    return { success: false, error: "Academia criada, mas erro ao vincular usuário." };
  }

  // Log de auditoria
  await admin.from("audit_logs").insert({
    academy_id: academy.id,
    user_id: user.id,
    action: "create",
    entity: "academy",
    entity_id: academy.id,
    details: { name, slug },
  });

  revalidatePath("/admin");
  return { success: true, academyId: academy.id, redirectUrl: "/admin" };
}

/**
 * Busca os dados da academia do usuário logado
 */
export async function getMyAcademyAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Não autenticado." };
  }

  const admin = createAdminClient();

  // Busca o academy_id do user
  const { data: userData } = await admin
    .from("users")
    .select("academy_id, role")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id) {
    return { success: false, error: "Sem academia vinculada.", needsOnboarding: true };
  }

  // Busca os dados da academia
  const { data: academy } = await admin
    .from("academies")
    .select("*")
    .eq("id", userData.academy_id)
    .single();

  return { success: true, academy, role: userData.role };
}

/**
 * Admin cadastra um professor na academia
 */
export async function addProfessorAction(formData: FormData) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  if (!nome || !email || !password) {
    return { success: false, error: "Nome, email e senha são obrigatórios." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Não autenticado." };
  }

  const admin = createAdminClient();

  // Verifica se quem está chamando é admin
  const { data: callerData } = await admin
    .from("users")
    .select("role, academy_id")
    .eq("id", user.id)
    .single();

  if (!callerData || callerData.role !== "admin") {
    return { success: false, error: "Sem permissão." };
  }

  // Cria auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes("already")) {
      return { success: false, error: "Este email já está cadastrado." };
    }
    return { success: false, error: "Erro ao criar conta do professor." };
  }

  // Insere na tabela users com role professor + academy_id
  const { error: dbError } = await admin.from("users").upsert({
    id: authData.user.id,
    email,
    nome,
    phone: phone || null,
    role: "professor",
    academy_id: callerData.academy_id,
    status: "active",
  });

  if (dbError) {
    return { success: false, error: "Erro ao configurar perfil do professor." };
  }

  // Log de auditoria
  await admin.from("audit_logs").insert({
    academy_id: callerData.academy_id,
    user_id: user.id,
    action: "create",
    entity: "user",
    entity_id: authData.user.id,
    details: { nome, email, role: "professor" },
  });

  revalidatePath("/admin/alunos");
  return { success: true };
}

/**
 * Admin cadastra um aluno manualmente
 */
export async function addStudentAction(formData: FormData) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const cpf = formData.get("cpf") as string;
  const birthDate = formData.get("birth_date") as string;
  const gender = formData.get("gender") as string;

  if (!nome || !email || !password) {
    return { success: false, error: "Nome, email e senha são obrigatórios." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const admin = createAdminClient();

  const { data: callerData } = await admin
    .from("users")
    .select("role, academy_id")
    .eq("id", user.id)
    .single();

  if (!callerData || callerData.role !== "admin") {
    return { success: false, error: "Sem permissão." };
  }

  // Cria auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes("already")) {
      return { success: false, error: "Este email já está cadastrado." };
    }
    return { success: false, error: "Erro ao criar conta do aluno." };
  }

  const { error: dbError } = await admin.from("users").upsert({
    id: authData.user.id,
    email,
    nome,
    phone: phone || null,
    cpf: cpf || null,
    birth_date: birthDate || null,
    gender: gender || null,
    role: "aluno",
    academy_id: callerData.academy_id,
    status: "active",
  });

  if (dbError) {
    return { success: false, error: "Erro ao configurar perfil do aluno." };
  }

  await admin.from("audit_logs").insert({
    academy_id: callerData.academy_id,
    user_id: user.id,
    action: "create",
    entity: "user",
    entity_id: authData.user.id,
    details: { nome, email, role: "aluno" },
  });

  revalidatePath("/admin/alunos");
  return { success: true };
}

/**
 * Lista todos os membros da academia (alunos + professores)
 */
export async function getAcademyMembersAction(roleFilter?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, data: [] };

  const admin = createAdminClient();

  const { data: callerData } = await admin
    .from("users")
    .select("academy_id, role")
    .eq("id", user.id)
    .single();

  if (!callerData?.academy_id) return { success: false, data: [] };

  let query = admin
    .from("users")
    .select("id, nome, email, phone, role, status, avatar_url, enrolled_at, created_at")
    .eq("academy_id", callerData.academy_id)
    .order("nome", { ascending: true });

  if (roleFilter) {
    query = query.eq("role", roleFilter);
  }

  const { data, error } = await query;

  if (error) return { success: false, data: [] };
  return { success: true, data: data || [] };
}

/**
 * Busca estatísticas da academia para o dashboard admin
 */
export async function getAcademyStatsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const admin = createAdminClient();

  const { data: callerData } = await admin
    .from("users")
    .select("academy_id")
    .eq("id", user.id)
    .single();

  if (!callerData?.academy_id) return { success: false };

  const academyId = callerData.academy_id;

  // Total alunos ativos
  const { count: totalStudents } = await admin
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("academy_id", academyId)
    .eq("role", "aluno")
    .eq("status", "active");

  // Total professores
  const { count: totalProfessors } = await admin
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("academy_id", academyId)
    .eq("role", "professor");

  // Total aulas (modalidades)
  const { count: totalClasses } = await admin
    .from("classes")
    .select("*", { count: "exact", head: true })
    .eq("academy_id", academyId);

  // Check-ins de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { count: todayCheckins } = await admin
    .from("class_checkins")
    .select("*, class_sessions!inner(class_id, start_time, classes!inner(academy_id))", { count: "exact", head: true })
    .gte("class_sessions.start_time", today.toISOString())
    .lt("class_sessions.start_time", tomorrow.toISOString());

  return {
    success: true,
    stats: {
      totalStudents: totalStudents || 0,
      totalProfessors: totalProfessors || 0,
      totalClasses: totalClasses || 0,
      todayCheckins: todayCheckins || 0,
    },
  };
}
