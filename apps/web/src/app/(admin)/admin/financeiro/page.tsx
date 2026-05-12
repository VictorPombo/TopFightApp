export default function FinanceiroPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Painel Financeiro</h2>
      <p className="text-muted-foreground mt-2">
        Acompanhe receitas, despesas e faturamento da academia.
      </p>
      {/* Gráficos e fluxo de caixa entrarão aqui */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Integração com gateway de pagamentos será implementada no futuro.</p>
      </div>
    </div>
  );
}
