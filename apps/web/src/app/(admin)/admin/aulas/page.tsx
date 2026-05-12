import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export default function AulasPage() {
  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Grade de Aulas
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Configure o calendário semanal de treinos e turmas.
          </p>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-[12px] font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nova Turma
        </button>
      </div>

      {/* Calendário Semanal UI */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] overflow-hidden shadow-sm">
        
        {/* Controls */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ChevronLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>
            <h3 className="font-semibold text-zinc-900 dark:text-white px-4">Esta Semana</h3>
            <button className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ChevronRight className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">Jiu Jitsu</span>
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider">Muay Thai</span>
          </div>
        </div>

        {/* Grid de Dias */}
        <div className="grid grid-cols-1 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800/60">
          
          {weekDays.map((day, idx) => (
            <div key={day} className="min-h-[500px] flex flex-col bg-zinc-50/50 dark:bg-black/20">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-[#0A0A0A] sticky top-0 text-center">
                <h4 className="font-bold text-zinc-900 dark:text-white">{day}</h4>
                <p className="text-xs text-zinc-500 mt-1">1{idx + 2}/05</p>
              </div>
              
              <div className="p-3 flex-1 space-y-3">
                {/* Exemplo de Aula 1 */}
                <div className="bg-white dark:bg-[#0A0A0A] border border-blue-500/20 rounded-[16px] p-3 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">19:00</span>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                      <CheckCircle2 className="h-3 w-3" /> 12/20
                    </div>
                  </div>
                  <h5 className="font-semibold text-sm text-zinc-900 dark:text-white leading-tight mb-1">Jiu Jitsu - Iniciantes</h5>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Prof. Marcos</p>
                </div>

                {/* Exemplo de Aula 2 (apenas em alguns dias) */}
                {idx % 2 === 0 && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-orange-500/20 rounded-[16px] p-3 shadow-sm hover:border-orange-500/50 cursor-pointer transition-all group relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">20:30</span>
                      <div className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                        <Users className="h-3 w-3" /> 5/15
                      </div>
                    </div>
                    <h5 className="font-semibold text-sm text-zinc-900 dark:text-white leading-tight mb-1">Muay Thai</h5>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Prof. Rodrigo</p>
                  </div>
                )}
                
                {/* Add block */}
                <button className="w-full py-3 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-[16px] flex items-center justify-center text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}
