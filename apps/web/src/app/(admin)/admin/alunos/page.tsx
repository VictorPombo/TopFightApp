import { Users, Search, MoreVertical, Medal, AlertCircle, Plus } from "lucide-react";

export default function CRMAlunosPage() {
  const alunosMock = [
    { id: 1, name: "Lucas Moura", modalidade: "Jiu Jitsu", faixa: "Branca", xp: "450/500", freq: "3x/semana", status: "Ativo", alerta: null },
    { id: 2, name: "Fernanda Costa", modalidade: "Muay Thai", faixa: "Ponta Vermelha", xp: "1200", freq: "2x/semana", status: "Ativo", alerta: "Vence em 2 dias" },
    { id: 3, name: "Ricardo Alves", modalidade: "Jiu Jitsu", faixa: "Azul", xp: "2100", freq: "0x/semana", status: "Risco Churn", alerta: "14 dias sem treinar" },
    { id: 4, name: "Juliana Paes", modalidade: "Boxe", faixa: "Iniciante", xp: "100", freq: "1x/semana", status: "Lead", alerta: "Aula Experimental Feita" },
    { id: 5, name: "Thiago Silva", modalidade: "Jiu Jitsu", faixa: "Roxa", xp: "5000+", freq: "5x/semana", status: "Ativo", alerta: null },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            CRM & Alunos
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Gestão da base de alunos, leads e engajamento.
          </p>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-[12px] font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Novo Aluno
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2">Total Ativos</h3>
          <p className="text-4xl font-semibold text-zinc-900 dark:text-white">142</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2">Risco de Churn (Sumiu)</h3>
          <p className="text-4xl font-semibold text-red-500">8</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2">Leads (Mês)</h3>
          <p className="text-4xl font-semibold text-blue-500">24</p>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="flex items-center gap-4 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[16px] p-2">
        <div className="flex-1 flex items-center gap-2 px-4">
          <Search className="h-5 w-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone ou CPF..." 
            className="w-full bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-white placeholder-zinc-500"
          />
        </div>
        <div className="hidden md:flex gap-2 pr-2">
          <select className="bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 py-2">
            <option>Todas as Modalidades</option>
            <option>Jiu Jitsu</option>
            <option>Muay Thai</option>
          </select>
          <select className="bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 py-2">
            <option>Status: Todos</option>
            <option>Ativos</option>
            <option>Inadimplentes</option>
            <option>Risco de Churn</option>
          </select>
        </div>
      </div>

      {/* Lista de Alunos */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800/60 text-xs uppercase tracking-wider text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="p-4 font-semibold">Aluno</th>
              <th className="p-4 font-semibold">Modalidade / Nível</th>
              <th className="p-4 font-semibold">Frequência / XP</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {alunosMock.map((aluno) => (
              <tr key={aluno.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">
                      {aluno.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-900 dark:text-white">{aluno.name}</p>
                      <p className="text-xs text-zinc-500">Cadastrado há 6 meses</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {aluno.modalidade}
                    </span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <Medal className="h-3 w-3" /> {aluno.faixa}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{aluno.freq}</p>
                  <p className="text-xs text-zinc-500">XP: {aluno.xp}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      aluno.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500' :
                      aluno.status === 'Risco Churn' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {aluno.status}
                    </span>
                    {aluno.alerta && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-orange-500" /> {aluno.alerta}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
