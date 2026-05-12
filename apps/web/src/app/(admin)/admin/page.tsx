export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground mt-2">
        Visão geral do Fight Hub.
      </p>
      {/* Cards de estatísticas entrarão aqui */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Alunos Ativos</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">142</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Receita do Mês</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">R$ 14.500</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">Aulas Hoje</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
        </div>
      </div>
    </div>
  );
}
