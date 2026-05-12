import { Users, GraduationCap, Calendar, CreditCard, ShieldCheck } from "lucide-react";

export default function AreaResponsavelPage() {
  const dependentes = [
    { 
      id: 1, 
      name: "Enzo Silva", 
      age: 8, 
      modality: "Jiu Jitsu Kids", 
      faixa: "Cinza",
      freq: "95%",
      nextClass: "Hoje às 18:00",
      status: "Ativo"
    },
    { 
      id: 2, 
      name: "Valentina Silva", 
      age: 12, 
      modality: "Muay Thai Teens", 
      faixa: "Branca",
      freq: "80%",
      nextClass: "Amanhã às 15:00",
      status: "Ativo"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-blue-500 font-bold tracking-widest uppercase text-xs flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" /> Conta Família
          </span>
          <h1 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight mt-1">
            Área do Responsável
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Acompanhe o desenvolvimento, frequência e mensalidades dos seus filhos.
          </p>
        </div>
        <button className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-bold shadow-sm">
          Pagar Mensalidade
        </button>
      </div>

      {/* Overview Financeiro */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <CreditCard className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Status Financeiro</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">Mensalidades em Dia</p>
          </div>
        </div>
        <div className="w-full md:w-px h-px md:h-12 bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 text-right">Próximo Vencimento</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">10/12/2026 - R$ 260,00</p>
          </div>
        </div>
      </div>

      {/* Lista de Dependentes */}
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-10 mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-yellow-500" /> Meus Dependentes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dependentes.map((dep) => (
          <div key={dep.id} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm hover:border-yellow-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center font-bold text-xl text-zinc-500">
                  {dep.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{dep.name}</h3>
                  <p className="text-sm text-zinc-500">{dep.age} anos</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {dep.modality}
              </span>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> Graduação Atual
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{dep.faixa}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Próxima Aula
                </span>
                <span className="text-sm font-bold text-emerald-500">{dep.nextClass}</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 mt-4">
                  <span>Frequência no Mês</span>
                  <span className="text-yellow-500">{dep.freq}</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: dep.freq }} />
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Ver Boletim Completo
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
