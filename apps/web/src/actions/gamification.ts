"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// =====================
// XP CONFIG
// =====================
const XP_RULES = {
  checkin: 10,
  streak_7: 50,
  streak_14: 100,
  streak_30: 250,
  belt_promotion: 200,
  first_fight: 150,
  win: 100,
  challenge_complete: 200,
} as const;

// =====================
// NÍVEL (baseado em XP total)
// =====================
function calculateLevel(totalXp: number): number {
  // Cada nível requer 100 XP a mais que o anterior
  // Nível 1: 0, Nível 2: 100, Nível 3: 300, Nível 4: 600...
  let level = 1;
  let xpNeeded = 100;
  let accumulated = 0;
  while (accumulated + xpNeeded <= totalXp) {
    accumulated += xpNeeded;
    level++;
    xpNeeded += 50;
  }
  return level;
}

// =====================
// CONCEDER XP
// =====================
export async function grantXP(
  userId: string,
  academyId: string,
  amount: number,
  reason: string,
  referenceId?: string
) {
  const admin = createAdminClient();

  // Registra o XP
  await admin.from("gamification_xp_log").insert({
    user_id: userId,
    academy_id: academyId,
    xp_amount: amount,
    reason,
    reference_id: referenceId || null,
  });

  // Atualiza total_xp e level do usuário
  const { data: userData } = await admin
    .from("users")
    .select("total_xp")
    .eq("id", userId)
    .single();

  const newTotalXp = (userData?.total_xp || 0) + amount;
  const newLevel = calculateLevel(newTotalXp);

  await admin
    .from("users")
    .update({ total_xp: newTotalXp, level: newLevel })
    .eq("id", userId);

  return { totalXp: newTotalXp, level: newLevel };
}

// =====================
// PROCESSAR CHECK-IN (chamado após o aluno fazer check-in)
// =====================
export async function processCheckinGamification(
  userId: string,
  academyId: string,
  checkinId: string
) {
  const admin = createAdminClient();

  // 1. Concede XP pelo check-in
  await grantXP(userId, academyId, XP_RULES.checkin, "checkin", checkinId);

  // 2. Atualiza streak
  const { data: userData } = await admin
    .from("users")
    .select("current_streak, best_streak, last_checkin_date")
    .eq("id", userId)
    .single();

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const lastCheckin = userData?.last_checkin_date;

  let newStreak = 1;
  if (lastCheckin === yesterday) {
    newStreak = (userData?.current_streak || 0) + 1;
  } else if (lastCheckin === today) {
    newStreak = userData?.current_streak || 1; // Já treinou hoje
  }

  const bestStreak = Math.max(newStreak, userData?.best_streak || 0);

  await admin
    .from("users")
    .update({
      current_streak: newStreak,
      best_streak: bestStreak,
      last_checkin_date: today,
    })
    .eq("id", userId);

  // 3. Bônus de streak
  if (newStreak === 7) await grantXP(userId, academyId, XP_RULES.streak_7, "streak_7");
  if (newStreak === 14) await grantXP(userId, academyId, XP_RULES.streak_14, "streak_14");
  if (newStreak === 30) await grantXP(userId, academyId, XP_RULES.streak_30, "streak_30");

  // 4. Conta total de check-ins do aluno
  const { count: totalCheckins } = await admin
    .from("class_checkins")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // 5. Verifica conquistas
  await checkAndGrantAchievements(userId, {
    checkinCount: totalCheckins || 0,
    streakDays: newStreak,
  });

  // 6. Atualiza desafios ativos
  await updateChallengeProgress(userId, academyId, "checkin_count", 1);

  return { streak: newStreak, bestStreak };
}

// =====================
// VERIFICAR E CONCEDER CONQUISTAS
// =====================
async function checkAndGrantAchievements(
  userId: string,
  stats: {
    checkinCount?: number;
    streakDays?: number;
    fightCount?: number;
    winCount?: number;
    beltPromotions?: number;
  }
) {
  const admin = createAdminClient();

  // Busca conquistas que o aluno AINDA NÃO tem
  const { data: allAchievements } = await admin
    .from("achievements")
    .select("*")
    .eq("is_active", true);

  const { data: earnedIds } = await admin
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const earnedSet = new Set(earnedIds?.map((e) => e.achievement_id) || []);

  if (!allAchievements) return;

  for (const achievement of allAchievements) {
    if (earnedSet.has(achievement.id)) continue; // Já tem

    let earned = false;

    switch (achievement.requirement_type) {
      case "checkin_count":
        earned = (stats.checkinCount || 0) >= achievement.requirement_value;
        break;
      case "streak_days":
        earned = (stats.streakDays || 0) >= achievement.requirement_value;
        break;
      case "first_fight":
        earned = (stats.fightCount || 0) >= achievement.requirement_value;
        break;
      case "first_win":
        earned = (stats.winCount || 0) >= achievement.requirement_value;
        break;
      case "belt_promotion":
        earned = (stats.beltPromotions || 0) >= achievement.requirement_value;
        break;
    }

    if (earned) {
      // Concede a conquista
      await admin.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
      });

      // Concede XP da conquista
      const { data: user } = await admin
        .from("users")
        .select("academy_id")
        .eq("id", userId)
        .single();

      if (user?.academy_id) {
        await grantXP(userId, user.academy_id, achievement.xp_reward, "achievement", achievement.id);
      }
    }
  }
}

// =====================
// ATUALIZAR PROGRESSO DE DESAFIOS
// =====================
async function updateChallengeProgress(
  userId: string,
  academyId: string,
  goalType: string,
  increment: number
) {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Busca desafios ativos que o aluno participa
  const { data: activeChallenges } = await admin
    .from("challenges")
    .select("id, goal_type, goal_value, xp_reward")
    .eq("academy_id", academyId)
    .eq("is_active", true)
    .eq("goal_type", goalType)
    .lte("starts_at", now)
    .gte("ends_at", now);

  if (!activeChallenges) return;

  for (const challenge of activeChallenges) {
    // Auto-join se não participa ainda
    const { data: participation } = await admin
      .from("challenge_participants")
      .select("id, progress, completed")
      .eq("challenge_id", challenge.id)
      .eq("user_id", userId)
      .single();

    if (!participation) {
      await admin.from("challenge_participants").insert({
        challenge_id: challenge.id,
        user_id: userId,
        progress: increment,
        completed: increment >= challenge.goal_value,
        completed_at: increment >= challenge.goal_value ? now : null,
      });
    } else if (!participation.completed) {
      const newProgress = participation.progress + increment;
      const completed = newProgress >= challenge.goal_value;

      await admin
        .from("challenge_participants")
        .update({
          progress: newProgress,
          completed,
          completed_at: completed ? now : null,
        })
        .eq("id", participation.id);

      if (completed) {
        await grantXP(userId, academyId, challenge.xp_reward, "challenge_complete", challenge.id);
      }
    }
  }
}

// =====================
// BUSCAR RANKING DA ACADEMIA
// =====================
export async function getRankingAction(academyId: string, limit = 20) {
  const admin = createAdminClient();

  const { data } = await admin
    .from("users")
    .select("id, nome, avatar_url, total_xp, level, current_streak, best_streak")
    .eq("academy_id", academyId)
    .eq("role", "aluno")
    .eq("status", "active")
    .order("total_xp", { ascending: false })
    .limit(limit);

  return data || [];
}

// =====================
// BUSCAR STATS DO ALUNO
// =====================
export async function getStudentGamificationStats(userId: string) {
  const admin = createAdminClient();

  const { data: user } = await admin
    .from("users")
    .select("total_xp, level, current_streak, best_streak")
    .eq("id", userId)
    .single();

  const { count: totalCheckins } = await admin
    .from("class_checkins")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { data: achievements } = await admin
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  const { data: recentXp } = await admin
    .from("gamification_xp_log")
    .select("xp_amount, reason, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  // XP para próximo nível
  let xpForCurrentLevel = 0;
  let xpForNextLevel = 100;
  let accumulated = 0;
  let lvl = 1;
  while (lvl < (user?.level || 1)) {
    accumulated += xpForNextLevel;
    xpForNextLevel += 50;
    lvl++;
  }
  xpForCurrentLevel = accumulated;
  const xpInLevel = (user?.total_xp || 0) - xpForCurrentLevel;
  const xpProgress = Math.min(Math.round((xpInLevel / xpForNextLevel) * 100), 100);

  return {
    totalXp: user?.total_xp || 0,
    level: user?.level || 1,
    currentStreak: user?.current_streak || 0,
    bestStreak: user?.best_streak || 0,
    totalCheckins: totalCheckins || 0,
    achievements: achievements || [],
    recentXp: recentXp || [],
    xpProgress,
    xpForNextLevel,
    xpInLevel,
  };
}
