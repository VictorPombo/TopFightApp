import { Users, CheckSquare, Medal, Award, ChevronRight, Check } from "lucide-react";

export default function ProfessorDashboard() {
  const turmasHoje = [
    { id: 1, time: "19:00", name: "Fundamentos do Jiu Jitsu", type: "Jiu Jitsu", alunos: 12, max: 20 },
    { id: 2, time: "20:30", name: "Turma Mista", type: "Muay Thai", alunos: 15, max: 15 },
  ];

  const alunosParaAvaliar = [
    { id: 1, name: "Lucas Moura", time: "120 dias", freq: "3x/sem", xp: 450, apto: true },
    { id: 2, name: "Fernanda Costa", time: "60 dias", freq: "2x/sem", xp: 210, apto: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      
      {/* Header */}
      <div>
        <span className="text-yellow-500 font-bold tracking-widest uppercase text-xs">Portal do Professor</span>
        <h1 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight mt-1">
          Meus Treinos de Hoje
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Bem-vindo, Professor Marcos. Você tem 2 aulas programadas.
        </p>
      </div>

      {/* Turmas do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {turmasHoje.map((turma) => (
          <div key={turma.id} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-4 md:p-6 shadow-sm hover:border-yellow-500/30 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-500/10 text-blue-500 text-xl font-bold px-4 py-2 rounded-xl">
                {turma.time}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {turma.type}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{turma.name}</h3>
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-medium">Lista de Presença</span>
                <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4" /> {turma.alunos} / {turma.max}
                </span>
              </div>
              <button className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                <CheckSquare className="h-4 w-4" /> Fazer Chamada
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Avaliações e Graduações */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
          <Award className="h-6 w-6 text-yellow-500" /> Alunos Elegíveis para Graduação
        </h2>
        
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] overflow-hidden shadow-sm">
          {alunosParaAvaliar.map((aluno, i) => (
            <div key={aluno.id} className={`p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ${i !== 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-lg text-zinc-500">
                  {aluno.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{aluno.name}</h4>
                  <p className="text-sm text-zinc-500">Tempo de tatame: {aluno.time} • Freq: {aluno.freq}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {aluno.apto ? (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Apto para Exame
                  </span>
                ) : (
                  <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                    Falta Frequência
                  </span>
                )}
                
                <button className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  <ChevronRight className="h-5 w-5 text-zinc-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
