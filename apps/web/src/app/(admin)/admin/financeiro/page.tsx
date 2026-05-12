import { Users, DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Activity } from "lucide-react";
import { getFinanceStatsAction } from "@/actions/finance";

export default function FinanceiroPage() {
  // DADOS MOCKADOS PARA VISUALIZAÇÃO IMEDIATA (IGNORANDO O BANCO POR ENQUANTO)
  const stats = { receitaPrevista: 15450.00, receitaRecebida: 12800.00, inadimplencia: 1200.00, planosAtivos: 142 };
  
  const latestPayments = [
    { id: '1', user_id: 'carlos_silva', due_date: new Date().toISOString(), amount: 150.00, status: 'paid', payment_method: 'PIX' },
    { id: '2', user_id: 'mariana_costa', due_date: new Date(Date.now() - 86400000).toISOString(), amount: 150.00, status: 'paid', payment_method: 'Cartão' },
    { id: '3', user_id: 'joao_pedro', due_date: new Date(Date.now() - 86400000 * 5).toISOString(), amount: 180.00, status: 'late', payment_method: null },
    { id: '4', user_id: 'ana_julia', due_date: new Date(Date.now() + 86400000 * 2).toISOString(), amount: 150.00, status: 'pending', payment_method: null },
  ];

  const plans = [
    { id: 'p1', name: 'Plano Mensal Geral', price: 150.00, cycle: 'mês', description: 'Acesso livre, todos os dias.' },
    { id: 'p2', name: 'Plano Trimestral', price: 400.00, cycle: 'tri', description: 'Economize R$ 50 no trimestre.' },
    { id: 'p3', name: 'Plano Anual Competidor', price: 1200.00, cycle: 'ano', description: 'Acesso livre + seminários inclusos.' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Financeiro
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Gestão de mensalidades, faturamento e inadimplência.
          </p>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-[12px] font-semibold tracking-wide transition-all shadow-sm">
          Nova Cobrança
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita Mensal */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">Receita Prevista</h3>
            <div className="bg-emerald-500/10 p-2 rounded-xl">
              <DollarSign className="h-5 w-5 text-emerald-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              R$ {stats.receitaPrevista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Recebido (Real) */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">Recebido (Mês)</h3>
            <div className="bg-blue-500/10 p-2 rounded-xl">
              <Activity className="h-5 w-5 text-blue-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              R$ {stats.receitaRecebida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {stats.receitaPrevista > 0 && (
            <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (stats.receitaRecebida / stats.receitaPrevista) * 100)}%` }} />
            </div>
          )}
        </div>

        {/* Inadimplência */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">Inadimplência</h3>
            <div className="bg-red-500/10 p-2 rounded-xl">
              <ArrowDownRight className="h-5 w-5 text-red-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              R$ {stats.inadimplencia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Planos Ativos */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">Planos Ativos</h3>
            <div className="bg-yellow-500/10 p-2 rounded-xl">
              <CreditCard className="h-5 w-5 text-yellow-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">{stats.planosAtivos}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Tabela de Últimas Mensalidades */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-8 shadow-sm">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-6">Últimas Cobranças</h3>
          
          <div className="space-y-4">
            {latestPayments.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhuma cobrança registrada ainda.</p>
            ) : (
              latestPayments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-[16px] bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-sm">
                      A
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-zinc-900 dark:text-white">ID: {p.user_id.slice(0,8)}</h4>
                      <p className="text-xs text-zinc-500">Vencimento: {new Date(p.due_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-900 dark:text-white">R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    {p.status === 'late' ? (
                      <span className="inline-block px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                        Atrasado
                      </span>
                    ) : p.status === 'paid' ? (
                      <span className="inline-block px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                        Pago via {p.payment_method || "Sistema"}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gerenciar Planos */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-8 shadow-sm">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-6">Meus Planos</h3>
          
          <div className="space-y-4 mb-6">
            {plans.length === 0 ? (
              <p className="text-zinc-500 text-sm">Você ainda não tem planos cadastrados.</p>
            ) : (
              plans.map((plan: any, i: number) => (
                <div key={plan.id} className={`p-4 rounded-[16px] border ${i === 0 ? "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:border-zinc-400 dark:hover:border-zinc-600"} relative overflow-hidden group cursor-pointer transition-all`}>
                  {i === 0 && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Mais Vendido</div>}
                  <h4 className="font-semibold text-zinc-900 dark:text-white">{plan.name}</h4>
                  <p className={`text-2xl font-black mt-2 ${i === 0 ? "text-yellow-600 dark:text-yellow-500" : "text-zinc-700 dark:text-zinc-300 text-xl"}`}>
                    R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    <span className="text-sm text-zinc-500 font-medium">/{plan.cycle === 'monthly' ? 'mês' : plan.cycle}</span>
                  </p>
                  {plan.description && <p className="text-xs text-zinc-500 mt-2">{plan.description}</p>}
                </div>
              ))
            )}
          </div>

          <button className="w-full py-3 rounded-[12px] bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            + Criar Novo Plano
          </button>
        </div>
      </div>
    </div>
  );
}
