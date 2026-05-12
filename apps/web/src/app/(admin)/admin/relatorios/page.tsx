import { TrendingDown, Users, AlertTriangle, ArrowUpRight, BarChart3, Activity } from "lucide-react";

export default function RelatoriosChurnPage() {
  const churnList = [
    { id: 1, name: "Ricardo Alves", daysAbsent: 14, risk: "Alto", lastContact: "Há 5 dias", suggestion: "Oferecer aula particular com Prof. Marcos" },
    { id: 2, name: "Juliana Paes", daysAbsent: 8, risk: "Médio", lastContact: "Nenhum", suggestion: "Enviar mensagem via WhatsApp perguntando o motivo" },
    { id: 3, name: "Lucas Moura", daysAbsent: 5, risk: "Baixo", lastContact: "Ontem", suggestion: "Lembrete gamificado de XP" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            <Activity className="h-8 w-8 text-yellow-500" /> Relatórios & Retenção
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Inteligência artificial para detectar evasão e aumentar LTV.
          </p>
        </div>
        <button className="bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-[12px] font-semibold tracking-wide transition-all shadow-sm">
          Exportar Excel
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">Taxa de Churn (Mês)</h3>
            <div className="bg-red-500/10 p-2 rounded-xl"><TrendingDown className="h-5 w-5 text-red-500"/></div>
          </div>
          <p className="text-4xl font-semibold text-zinc-900 dark:text-white">4.2%</p>
          <p className="text-xs text-zinc-500 mt-2">Ideal do mercado: &lt; 5%</p>
        </div>
        
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">Retenção (Trimestre)</h3>
            <div className="bg-emerald-500/10 p-2 rounded-xl"><Users className="h-5 w-5 text-emerald-500"/></div>
          </div>
          <p className="text-4xl font-semibold text-zinc-900 dark:text-white">82%</p>
          <span className="text-xs font-semibold text-emerald-500 flex items-center mt-2">
            <ArrowUpRight className="h-3 w-3 mr-1" /> +2% vs Tri anterior
          </span>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-[#0A0A0A] dark:to-zinc-900 border border-zinc-800 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
          <AlertTriangle className="absolute -top-4 -right-4 h-32 w-32 text-orange-500/10 pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Alerta IA: Risco Iminente</h3>
          </div>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 relative z-10">
            8
          </p>
          <p className="text-xs font-medium text-zinc-500 mt-2 relative z-10">Alunos sumiram há +7 dias</p>
        </div>
      </div>

      {/* Lista de IA de Evasão */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-8 shadow-sm">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-6">Radar de Evasão (Ações Recomendadas)</h3>
        
        <div className="space-y-4">
          {churnList.map((aluno) => (
            <div key={aluno.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-[16px] bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  aluno.risk === 'Alto' ? 'bg-red-500' : aluno.risk === 'Médio' ? 'bg-orange-500' : 'bg-yellow-500'
                }`}>
                  {aluno.daysAbsent}d
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{aluno.name}</h4>
                  <p className="text-xs text-zinc-500 font-medium">Último contato: {aluno.lastContact}</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Dica da IA</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">{aluno.suggestion}</p>
              </div>

              <div className="w-full md:w-auto text-right">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold text-sm w-full transition-colors">
                  Ação Rápida
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Mock */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Heatmap de Frequência (Por Horário)</h3>
          <BarChart3 className="h-5 w-5 text-zinc-400" />
        </div>
        <div className="h-48 flex items-end justify-between gap-2">
          {/* Barras de mock */}
          {[20, 40, 30, 80, 100, 90, 50, 10].map((h, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-2">
              <div 
                className={`w-full rounded-t-lg transition-all ${
                  h > 80 ? 'bg-emerald-500' : h > 40 ? 'bg-yellow-500' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] font-bold text-zinc-500">{i + 14}h</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
