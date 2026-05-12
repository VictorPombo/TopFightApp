import { Trophy, Calendar as CalendarIcon, Users, ArrowRight, Medal, Flag } from "lucide-react";

export default function CampeonatosPage() {
  const campeonatos = [
    { id: 1, name: "Copa Fight Hub Interna", date: "20 Nov 2026", status: "Inscrições Abertas", athletes: 45, modality: "Jiu Jitsu" },
    { id: 2, name: "Torneio Estadual", date: "05 Dez 2026", status: "Em Breve", athletes: 12, modality: "Muay Thai" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" /> Campeonatos & Eventos
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Gestão de inscrições, ranking e calendário competitivo.
          </p>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-[12px] font-semibold tracking-wide transition-all shadow-sm">
          + Criar Evento
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel Central de Campeonatos */}
        <div className="lg:col-span-2 space-y-6">
          {campeonatos.map((camp) => (
            <div key={camp.id} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-yellow-500/30 transition-all group">
              <div className="flex gap-4 items-center">
                <div className="h-16 w-16 bg-yellow-500/10 rounded-[16px] flex items-center justify-center border border-yellow-500/20">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2 inline-block">
                    {camp.modality}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{camp.name}</h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-2 mt-1 font-medium">
                    <CalendarIcon className="h-4 w-4" /> {camp.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
                <div className="text-center">
                  <p className="text-2xl font-black text-zinc-900 dark:text-white">{camp.athletes}</p>
                  <p className="text-[10px] font-bold uppercase text-zinc-500">Inscritos</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    camp.status === 'Inscrições Abertas' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {camp.status}
                  </span>
                  <button className="flex items-center justify-end gap-1 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Gerenciar <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ranking Interno Top 3 */}
        <div className="lg:col-span-1 bg-gradient-to-b from-zinc-900 to-black dark:from-[#0A0A0A] dark:to-black border border-zinc-800 rounded-[24px] p-8 shadow-xl relative overflow-hidden">
          <Flag className="absolute -top-4 -right-4 h-32 w-32 text-white/5 pointer-events-none" />
          
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            Ranking Geral
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-black text-black">1</div>
              <div className="flex-1">
                <p className="font-bold text-white leading-tight">Thiago Silva</p>
                <p className="text-[10px] text-zinc-400">Jiu Jitsu • Roxa</p>
              </div>
              <Medal className="h-5 w-5 text-yellow-500" />
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center font-black text-zinc-800">2</div>
              <div className="flex-1">
                <p className="font-bold text-white leading-tight">Lucas Moura</p>
                <p className="text-[10px] text-zinc-400">Jiu Jitsu • Branca</p>
              </div>
              <Medal className="h-5 w-5 text-zinc-300" />
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-black text-orange-900">3</div>
              <div className="flex-1">
                <p className="font-bold text-white leading-tight">Fernanda Costa</p>
                <p className="text-[10px] text-zinc-400">Muay Thai • P. Vermelha</p>
              </div>
              <Medal className="h-5 w-5 text-orange-400" />
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 rounded-[12px] bg-white/5 text-zinc-300 font-medium text-sm hover:bg-white/10 transition-colors">
            Ver Ranking Completo
          </button>
        </div>

      </div>
    </div>
  );
}
