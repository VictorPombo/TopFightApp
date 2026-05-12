import { Medal, Trophy, Star, Target, Flame, ChevronRight, Award } from "lucide-react";

export default function AlunoEvolucaoPage() {
  const conquistas = [
    { id: 1, name: "Primeiro Sangue", desc: "Completou 1 semana seguida", icon: "🩸", unlocked: true },
    { id: 2, name: "Viciado no Tatame", desc: "30 treinos no mês", icon: "🔥", unlocked: true },
    { id: 3, name: "Mestre da Frequência", desc: "1 ano sem faltar na semana", icon: "👑", unlocked: false },
    { id: 4, name: "Campeão Interno", desc: "Venceu o desafio do mês", icon: "🏆", unlocked: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      
      {/* Header Minimalista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Minha Evolução
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Acompanhe seu progresso, faixas e conquistas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Painel Central: Graduação Atual */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[32px] p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Representação Visual da Faixa */}
              <div className="w-full md:w-48 h-12 bg-white border-2 border-zinc-200 shadow-md rounded-md relative flex items-center justify-end pr-2 overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/fabric-plaid.png')]" />
                <div className="w-12 h-full bg-black relative border-l-2 border-zinc-200">
                  <div className="absolute top-1 bottom-1 right-2 w-2 bg-white rounded-sm" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">Jiu Jitsu</span>
                </div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Faixa Branca</h2>
                <p className="text-sm font-semibold text-zinc-500">1º Grau • Rumo à Faixa Azul</p>
                
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    <span>Progresso para Exame</span>
                    <span className="text-blue-500">45%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[45%]" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 text-right">Faltam aprox. 40 treinos para elegibilidade.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de Graduações */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> Histórico de Exames
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0A0A0A] bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                  1
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[16px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-zinc-900 dark:text-white">1º Grau Branca</h4>
                    <span className="text-xs font-semibold text-zinc-400">Há 2 meses</span>
                  </div>
                  <p className="text-xs text-zinc-500">Aprovado pelo Prof. Marcos.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0A0A0A] bg-zinc-200 dark:bg-zinc-800 text-zinc-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  0
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[16px] bg-transparent border border-dashed border-zinc-200 dark:border-zinc-800 opacity-50">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-zinc-500">Início da Jornada</h4>
                    <span className="text-xs font-semibold text-zinc-400">Há 6 meses</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Painel Lateral: Conquistas & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-[#0A0A0A] dark:to-black border border-zinc-800 rounded-[32px] p-8 shadow-xl text-center relative overflow-hidden">
            <Flame className="absolute -top-6 -right-6 w-32 h-32 text-orange-500/10 pointer-events-none" />
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2">
              450
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pontos de XP</p>
            <div className="mt-6 flex justify-center gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-zinc-300">Nível 4</span>
              <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-medium border border-orange-500/20">🔥 12 dias seguidos</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" /> Sala de Troféus
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {conquistas.map((c) => (
                <div key={c.id} className={`flex flex-col items-center text-center p-3 rounded-[16px] border ${c.unlocked ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/20 grayscale opacity-50'}`}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <h4 className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1 leading-tight">{c.name}</h4>
                  <p className="text-[9px] text-zinc-500 leading-tight">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
