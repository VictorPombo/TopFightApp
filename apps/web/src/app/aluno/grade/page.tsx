import { getScheduleAction } from "@/actions/schedule";
import { Calendar, Clock, CheckCircle2, MapPin, Check, ChevronRight } from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";
import Link from "next/link";
import { ReserveButton } from "./reserve-button";

export default function AlunoGradePage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const selectedDate = searchParams.date || new Date().toISOString().split("T")[0];
  
  // DADOS MOCKADOS
  const sessions = [
    { id: '1', start_time: `${selectedDate}T19:00:00`, current_capacity: 12, max_capacity: 20, classes: { name: 'Jiu Jitsu Fundamentos', modality: 'Jiu Jitsu' } },
    { id: '2', start_time: `${selectedDate}T20:30:00`, current_capacity: 15, max_capacity: 15, classes: { name: 'Turma Mista', modality: 'Muay Thai' } },
    { id: '3', start_time: `${selectedDate}T21:30:00`, current_capacity: 0, max_capacity: 10, classes: { name: 'Sparring', modality: 'Boxe' } },
  ];
  const userReservations = [
    { session_id: '2' }
  ];

  // Gera dias da semana (Hoje até +4 dias)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return {
      day: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : dayNames[d.getDay()],
      date: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`,
      isoDate: dateStr,
      active: dateStr === selectedDate
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      
      {/* Header Minimalista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Grade de Aulas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Selecione o dia e reserve sua vaga no tatame.
          </p>
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {weekDays.map((d) => (
          <Link 
            key={d.isoDate}
            href={`/aluno/grade?date=${d.isoDate}`}
            className={`min-w-[100px] p-4 rounded-[20px] flex flex-col items-center justify-center snap-start transition-all ${
              d.active 
                ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg scale-105 border-none" 
                : "bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${d.active ? "opacity-80" : ""}`}>{d.day}</span>
            <span className={`text-xl font-bold ${d.active ? "" : "text-zinc-900 dark:text-white"}`}>{d.date.split('/')[0]}</span>
          </Link>
        ))}
      </div>

      {/* Lista de Aulas */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="bg-white dark:bg-[#0A0A0A] border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[24px] p-10 flex flex-col items-center justify-center text-center">
             <BoxingGlove className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-4" />
             <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Sem aulas neste dia</h3>
             <p className="text-sm text-zinc-500 max-w-sm">
               Nenhuma aula configurada para esta data. Selecione outro dia no calendário acima.
             </p>
          </div>
        ) : (
          sessions.map((session: any) => {
            const dateObj = new Date(session.start_time);
            const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            const isReserved = userReservations.some(r => r.session_id === session.id);
            const isFull = session.current_capacity >= session.max_capacity;

            let cardClasses = "";
            if (isReserved) {
               cardClasses = "bg-white dark:bg-[#0A0A0A] border-2 border-emerald-500/30 rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm";
            } else if (isFull) {
               cardClasses = "bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-70 cursor-not-allowed grayscale";
            } else {
               cardClasses = "bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-blue-500/30 transition-all group shadow-sm";
            }

            return (
              <div key={session.id} className={cardClasses}>
                {isReserved && (
                  <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                )}
                
                <div className="flex w-full sm:w-auto items-center gap-6 relative z-10">
                  <div className={`${isReserved ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : isFull ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"} w-20 h-20 rounded-[20px] flex flex-col items-center justify-center shrink-0`}>
                    <span className="text-xl font-bold">{timeStr}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isReserved ? "text-orange-500 bg-orange-500/10" : isFull ? "text-zinc-500 bg-zinc-200 dark:bg-zinc-800" : "text-blue-500 bg-blue-500/10"}`}>
                        {session.classes?.modality || "Geral"}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${isFull && !isReserved ? "text-zinc-500" : "text-zinc-900 dark:text-white"}`}>
                      {session.classes?.name || "Treino Livre"}
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Tatame
                    </p>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-3 relative z-10">
                  {!isReserved && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${isFull ? "text-red-500" : "text-zinc-500"}`}>
                      <span className={isFull ? "text-red-500" : "text-zinc-900 dark:text-white"}>{session.current_capacity}</span> / {session.max_capacity} vagas
                    </div>
                  )}

                  <ReserveButton 
                    sessionId={session.id} 
                    isReserved={isReserved} 
                    isFull={isFull} 
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
