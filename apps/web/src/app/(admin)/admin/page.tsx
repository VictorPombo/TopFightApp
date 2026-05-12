import { getAcademyStatsAction, getMyAcademyAction } from "@/actions/academy";
import { Users, GraduationCap, Calendar, Trophy, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";
import Link from "next/link";

export default async function AdminDashboard() {
  const [academyResult, statsResult] = await Promise.all([
    getMyAcademyAction(),
    getAcademyStatsAction(),
  ]);

  const academy = academyResult.academy;
  const stats = statsResult.stats;

  const cards = [
    {
      title: "Alunos Ativos",
      value: stats?.totalStudents ?? 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Professores",
      value: stats?.totalProfessors ?? 0,
      icon: GraduationCap,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Modalidades",
      value: stats?.totalClasses ?? 0,
      icon: BoxingGlove,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Check-ins Hoje",
      value: stats?.todayCheckins ?? 0,
      icon: Trophy,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
          Dashboard
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Visão geral da <span className="font-semibold text-zinc-800 dark:text-zinc-200">{academy?.name || "Fight Hub"}</span>
        </p>
      </div>

      {/* Stats Cards Minimalist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">
                {card.title}
              </h3>
              <div className={`${card.bg} p-2 rounded-xl transition-colors`}>
                <card.icon className={`h-5 w-5 ${card.color}`} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                {card.value}
              </p>
            </div>
            
            {/* Subtle glow on hover */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${card.bg} rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
          </div>
        ))}
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* Ações Rápidas */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-4 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
              Ações Rápidas
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/alunos" className="flex items-center justify-between p-4 rounded-[16px] bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-yellow-500" />
                </div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Cadastrar Aluno</span>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
            </Link>

            <Link href="/admin/aulas" className="flex items-center justify-between p-4 rounded-[16px] bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-500" />
                </div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Gerenciar Aulas</span>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Alertas */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-4 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
              Avisos
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-[16px] bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mt-1.5 shrink-0" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-300/90 leading-snug">
                Módulo financeiro será ativado na Fase 2
              </span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-[16px] bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300/90 leading-snug">
                Configure suas modalidades em Grade de Aulas
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
