import { createClient } from "@/lib/supabase/server";
import { Dumbbell, Shield, Trophy, Calendar, Ticket, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default async function AlunoHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nome = user?.user_metadata?.nome || "Aluno";
  const primeiroNome = nome.split(" ")[0];

  // Busca Rifa Ativa
  const { data: activeRaffle } = await supabase
    .from("raffles")
    .select("id, name, description")
    .eq("status", "aberta")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Busca aulas de hoje
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Cabeçalho de Gamificação */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-6">
          Oss, <span className="text-yellow-500">{primeiroNome}</span>!
        </h1>
        
        <div className="bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-xl dark:shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-zinc-900 dark:text-white">
            <Shield className="h-40 w-40" />
          </div>
          
          <div className="w-24 h-24 bg-zinc-100 dark:bg-white rounded-2xl border-b-8 border-gray-300 dark:border-gray-300 flex items-center justify-center shadow-lg shrink-0 z-10">
            <Shield className="h-12 w-12 text-zinc-900 dark:text-black" />
          </div>
          
          <div className="flex-1 text-center md:text-left z-10 w-full">
            <h3 className="text-zinc-900 dark:text-white font-black text-2xl uppercase tracking-widest mb-1">Prajied Branco</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-4">Aguarde até o próximo evento Troca de Prajied</p>
            
            <div className="w-full bg-zinc-100 dark:bg-black/50 h-3 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full w-[100%] rounded-full opacity-50" />
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] z-10 hidden md:flex">
            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">2</span>
            <span className="text-zinc-500 dark:text-zinc-500 text-xs font-bold uppercase mt-1">Check-ins</span>
          </div>
        </div>
      </div>

      {/* 2. Engajamento - Rifas */}
      {activeRaffle && (
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_-10px_rgba(234,179,8,0.4)]">
          <div className="flex items-center gap-4 text-black">
            <div className="bg-black/10 p-3 rounded-xl">
              <Ticket className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-wide">{activeRaffle.name}</h3>
              <p className="font-medium opacity-80 text-sm">Apoie o time e concorra a prêmios!</p>
            </div>
          </div>
          
          <Link 
            href={`/rifas/${activeRaffle.id}`}
            className="w-full md:w-auto bg-black text-white hover:bg-zinc-900 font-bold uppercase tracking-widest px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            Garantir Número
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      )}

      {/* 3. Acesso Rápido - Grade de Hoje */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-wide">Treinos de Hoje</h2>
        </div>

        {todaySessions && todaySessions.length > 0 ? (
          <div className="space-y-4">
            {todaySessions.map((session: any) => {
              const date = new Date(session.start_time);
              const timeString = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              const cls = session.classes;

              return (
                <div key={session.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-zinc-400 dark:text-zinc-500 mb-1" />
                      <span className="text-zinc-900 dark:text-white font-bold text-sm">{timeString}</span>
                    </div>
                    <div>
                      <h4 className="text-zinc-900 dark:text-white font-bold text-lg">{cls?.name || "Treino"}</h4>
                      <span className="text-yellow-600 dark:text-yellow-500 text-xs font-black uppercase tracking-widest">{cls?.modality || "Geral"}</span>
                    </div>
                  </div>
                  
                  <button className="w-full sm:w-auto bg-zinc-900 dark:bg-zinc-800 hover:bg-yellow-500 hover:text-black text-white font-bold px-6 py-3 rounded-xl transition-all uppercase text-sm tracking-wider flex items-center justify-center gap-2 group-hover:shadow-lg">
                    <Dumbbell className="h-4 w-4" />
                    Fazer Check-in
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
            <Dumbbell className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm">Nenhum treino programado para hoje. Aproveite o descanso, campeão!</p>
          </div>
        )}
      </div>

    </div>
  );
}
