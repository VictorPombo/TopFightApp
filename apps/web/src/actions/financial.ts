"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// =====================
// PLANOS
// =====================

export async function createPlanAction(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const interval = formData.get("interval") as string;
  const description = formData.get("description") as string;

  if (!name || isNaN(price) || price <= 0) {
    return { success: false, error: "Nome e preço são obrigatórios." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const admin = createAdminClient();
  const { data: userData } = await admin
    .from("users")
    .select("academy_id, role")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id || userData.role !== "admin") {
    return { success: false, error: "Sem permissão." };
  }

  const { data: plan, error } = await admin
    .from("plans")
    .insert({
      academy_id: userData.academy_id,
      name,
      price,
      interval: interval || "monthly",
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Plan creation error:", error);
    return { success: false, error: "Erro ao criar plano." };
  }

  await admin.from("audit_logs").insert({
    academy_id: userData.academy_id,
    user_id: user.id,
    action: "create",
    entity: "plan",
    entity_id: plan.id,
    details: { name, price, interval },
  });

  revalidatePath("/admin/financeiro");
  return { success: true };
}

export async function getPlansAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, data: [] };

  const admin = createAdminClient();
  const { data: userData } = await admin
    .from("users")
    .select("academy_id")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id) return { success: false, data: [] };

  const { data, error } = await admin
    .from("plans")
    .select("*")
    .eq("academy_id", userData.academy_id)
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) return { success: false, data: [] };
  return { success: true, data: data || [] };
}

// =====================
// PAGAMENTOS
// =====================

export async function registerPaymentAction(formData: FormData) {
  const userId = formData.get("user_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("due_date") as string;
  const status = formData.get("status") as string;

  if (!userId || isNaN(amount)) {
    return { success: false, error: "Aluno e valor são obrigatórios." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const admin = createAdminClient();
  const { data: callerData } = await admin
    .from("users")
    .select("academy_id, role")
    .eq("id", user.id)
    .single();

  if (!callerData?.academy_id || callerData.role !== "admin") {
    return { success: false, error: "Sem permissão." };
  }

  const paymentData: Record<string, unknown> = {
    academy_id: callerData.academy_id,
    user_id: userId,
    amount,
    method: method || "pix",
    status: status || "pending",
    description: description || null,
    due_date: dueDate || null,
  };

  if (status === "paid") {
    paymentData.paid_at = new Date().toISOString();
  }

  const { error } = await admin.from("payments").insert(paymentData);

  if (error) {
    console.error("Payment error:", error);
    return { success: false, error: "Erro ao registrar pagamento." };
  }

  revalidatePath("/admin/financeiro");
  return { success: true };
}

export async function getPaymentsAction(filters?: { status?: string; month?: number; year?: number }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, data: [] };

  const admin = createAdminClient();
  const { data: userData } = await admin
    .from("users")
    .select("academy_id")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id) return { success: false, data: [] };

  let query = admin
    .from("payments")
    .select("*, users!inner(nome, email)")
    .eq("academy_id", userData.academy_id)
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query.limit(100);

  if (error) return { success: false, data: [] };
  return { success: true, data: data || [] };
}

export async function getFinancialStatsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const admin = createAdminClient();
  const { data: userData } = await admin
    .from("users")
    .select("academy_id")
    .eq("id", user.id)
    .single();

  if (!userData?.academy_id) return { success: false };

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  // Receita do mês (pagos)
  const { data: paidThisMonth } = await admin
    .from("payments")
    .select("amount")
    .eq("academy_id", userData.academy_id)
    .eq("status", "paid")
    .gte("paid_at", firstDayOfMonth)
    .lte("paid_at", lastDayOfMonth);

  const revenue = paidThisMonth?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Inadimplentes (status overdue)
  const { count: overdueCount } = await admin
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("academy_id", userData.academy_id)
    .eq("status", "overdue");

  // Pendentes
  const { count: pendingCount } = await admin
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("academy_id", userData.academy_id)
    .eq("status", "pending");

  // Total de alunos ativos (para calcular ticket médio)
  const { count: activeStudents } = await admin
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("academy_id", userData.academy_id)
    .eq("role", "aluno")
    .eq("status", "active");

  const ticketMedio = activeStudents && activeStudents > 0 ? revenue / activeStudents : 0;

  return {
    success: true,
    stats: {
      revenue,
      overdueCount: overdueCount || 0,
      pendingCount: pendingCount || 0,
      activeStudents: activeStudents || 0,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
    },
  };
}
