import { createClient } from "@/lib/supabase/server";
import { Shield, Trophy, Calendar, Ticket, ArrowRight, Clock, Flame, Star, QrCode, Activity, Medal } from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";
import Link from "next/link";
import QRCode from "react-qr-code";
import { getStudentGamificationStats } from "@/actions/gamification";

export default async function AlunoHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nome = user?.user_metadata?.nome || "Aluno";
  const primeiroNome = nome.split(" ")[0];

  const stats = await getStudentGamificationStats(user!.id);
  const qrCodeValue = `STUDENT:${user!.id}`;

  const { data: activeRaffle } = await supabase
    .from("raffles")
    .select("id, name, description")
    .eq("status", "aberta")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: todaySessions } = await supabase
    .from("class_sessions")
    .select(`
      id,
      start_time,
      classes ( name, modality )
    `)
    .gte("start_time", today.toISOString())
    .lt("start_time", tomorrow.toISOString())
    .order("start_time", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-sans">
      
      {/* 🌟 HERO HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl tracking-tight text-white font-medium">
            Olá, <span className="font-semibold">{primeiroNome}</span>
          </h1>
          <p className="text-zinc-400 text-base mt-2 max-w-xl">
            Acompanhe seu progresso e garanta sua presença nos treinos de hoje.
          </p>
        </div>

        {/* Streak Minimalista */}
        <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg">
          <Flame className="h-5 w-5 text-orange-500" strokeWidth={2.5} />
          <div>
            <div className="text-white font-semibold text-lg leading-none">{stats.currentStreak} <span className="text-zinc-500 text-sm font-normal">dias</span></div>
            <div className="text-[11px] text-zinc-500 font-medium tracking-wide">SEQUÊNCIA ATUAL</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* ========================================================= */}
        {/* 🎮 PAINEL DE PROGRESSO (Esquerda - 8 colunas)               */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CARD DE XP E NÍVEL - Estilo Clean / Tech */}
          <div className="bg-[#0A0A0A] border border-zinc-800/60 rounded-[28px] p-4 md:p-8 relative overflow-hidden shadow-2xl">
            {/* Soft Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/30 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start relative z-10">
              
              {/* Nível Circle */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center shadow-inner relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#27272a" strokeWidth="4" />
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="301.59" strokeDashoffset={301.59 - (301.59 * stats.xpProgress) / 100} className="transition-all duration-1000 ease-out" />
                  </svg>
                  <span className="text-zinc-500 text-[10px] font-semibold tracking-wider">NÍVEL</span>
                  <span className="text-3xl font-bold text-white leading-none">{stats.level}</span>
                </div>
              </div>

              {/* Informações de XP */}
              <div className="flex-1 w-full pt-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-white text-xl font-medium tracking-tight">Atleta Iniciante</h3>
                  <span className="text-sm font-medium text-zinc-400">
                    <span className="text-white">{stats.xpInLevel}</span> / {stats.xpForNextLevel} XP
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mb-5">Próximo nível está a {stats.xpForNextLevel - stats.xpInLevel} XP de distância.</p>

                {/* Progress Bar Simple */}
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.xpProgress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600 font-medium mt-3 text-right">
                  XP Total: {stats.totalXp}
                </p>
              </div>
            </div>

            {/* Sub-stats Clean */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <Activity className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-500 tracking-wide uppercase">Total de Treinos</p>
                  <p className="text-lg font-semibold text-white">{stats.totalCheckins}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <Medal className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-500 tracking-wide uppercase">Conquistas</p>
                  <p className="text-lg font-semibold text-white">{stats.achievements.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rifa Banner Clean */}
          {activeRaffle && (
            <Link href={`/rifas/${activeRaffle.id}`}>
              <div className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-[24px] p-5 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-base">{activeRaffle.name}</h4>
                    <p className="text-zinc-500 text-sm line-clamp-1">{activeRaffle.description}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          )}

          {/* Últimas Conquistas */}
          {stats.achievements.length > 0 && (
            <div className="pt-2">
              <h2 className="text-sm font-medium text-zinc-400 tracking-wide mb-4">ÚLTIMAS CONQUISTAS</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.achievements.slice(0, 4).map((ua: any) => (
                  <div key={ua.id} className="bg-[#0A0A0A] border border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center text-center hover:border-zinc-700 transition-colors">
                    <div className="text-3xl mb-3 opacity-90">
                      {ua.achievements.icon}
                    </div>
                    <h4 className="font-medium text-white text-sm leading-tight mb-1">{ua.achievements.name}</h4>
                    <p className="text-[11px] text-zinc-500 leading-tight">{ua.achievements.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* ========================================================= */}
        {/* 🎫 SIDEBAR DIREITA (QR Code & Treinos - 4 colunas)        */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* DIGITAL PASS (Estilo Apple Wallet) */}
          <div className="bg-[#0A0A0A] border border-zinc-800/60 rounded-[28px] overflow-hidden flex flex-col items-center relative shadow-xl group">
            
            <div className="w-full bg-zinc-900/50 p-6 flex flex-col items-center border-b border-zinc-800/50">
              <QrCode className="h-6 w-6 text-zinc-400 mb-2" />
              <h3 className="font-medium text-white tracking-wide">Check-in Pass</h3>
              <p className="text-[11px] text-zinc-500 tracking-wider uppercase mt-1">Acesso à Catraca</p>
            </div>

            <div className="p-4 md:p-8 w-full flex flex-col items-center bg-white">
              <QRCode value={qrCodeValue} size={160} level="H" className="mx-auto" />
            </div>
            
            <div className="w-full bg-zinc-900/50 p-5 text-center">
              <p className="text-xs text-zinc-500">
                Apresente na recepção para registrar sua presença.
              </p>
            </div>
          </div>

          {/* TREINOS DE HOJE */}
          <div className="bg-[#0A0A0A] border border-zinc-800/60 rounded-[28px] p-6">
            <h2 className="text-sm font-medium text-zinc-400 tracking-wide mb-5 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hoje
            </h2>

            {todaySessions && todaySessions.length > 0 ? (
              <div className="space-y-3">
                {todaySessions.map((session: any) => {
                  const date = new Date(session.start_time);
                  const timeString = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  const cls = session.classes;

                  return (
                    <div key={session.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-900 transition-colors">
                      <div className="bg-zinc-800/80 rounded-xl px-3 py-2 text-center shrink-0">
                        <span className="block text-white font-medium text-sm">{timeString}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{cls?.name || "Treino"}</h4>
                        <span className="text-zinc-500 text-[11px] font-medium tracking-wide uppercase">{cls?.modality || "Geral"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <BoxingGlove className="h-6 w-6 text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-500">Sem treinos marcados para hoje.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
