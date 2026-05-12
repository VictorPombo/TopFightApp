"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFinanceStatsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: academyData } = await supabase
    .from("users")
    .select("academy_id")
    .eq("id", user.id)
    .single();

  if (!academyData?.academy_id) {
    return { success: false, error: "Academy not found" };
  }

  // Busca estatísticas financeiras
  // Na vida real faríamos joins nas tabelas payments e subscriptions
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("academy_id", academyData.academy_id);

  const { data: activeSubscriptions } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("status", "active")
    .not("plan_id", "is", null); // Simplificação

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  // Calcula valores
  const totalReceitaPrevista = plans?.reduce((acc, plan) => acc + (plan.price * (activeSubscriptions?.length || 0)), 0) || 0;
  
  const pagamentosRealizados = payments?.filter(p => p.status === 'paid') || [];
  const receitaRecebida = pagamentosRealizados.reduce((acc, p) => acc + p.amount, 0);

  const pagamentosAtrasados = payments?.filter(p => p.status === 'late') || [];
  const inadimplencia = pagamentosAtrasados.reduce((acc, p) => acc + p.amount, 0);

  return {
    success: true,
    stats: {
      receitaPrevista: totalReceitaPrevista,
      receitaRecebida,
      inadimplencia,
      planosAtivos: activeSubscriptions?.length || 0
    },
    latestPayments: payments || [],
    plans: plans || []
  };
}
