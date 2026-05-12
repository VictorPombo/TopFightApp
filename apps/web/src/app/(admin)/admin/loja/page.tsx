import { Store, ShoppingCart, Tag, Package, Plus, TrendingUp } from "lucide-react";

export default function LojaPage() {
  const produtosMock = [
    { id: 1, name: "Kimono Fight Hub Oficial", cat: "Equipamento", price: 350.00, stock: 12, sales: 45 },
    { id: 2, name: "Luva de Boxe 14oz", cat: "Equipamento", price: 180.00, stock: 5, sales: 22 },
    { id: 3, name: "Whey Protein Isolado", cat: "Suplemento", price: 120.00, stock: 0, sales: 80 },
    { id: 4, name: "Camiseta Dry Fit", cat: "Vestuário", price: 80.00, stock: 30, sales: 15 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Loja Virtual
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Marketplace de equipamentos, suplementos e vestuário.
          </p>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-[12px] font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Novo Produto
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2">Vendas Mês</h3>
              <p className="text-3xl font-semibold text-zinc-900 dark:text-white">R$ 2.450</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-xl"><ShoppingCart className="h-5 w-5 text-blue-500"/></div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2">Itens em Estoque</h3>
              <p className="text-3xl font-semibold text-zinc-900 dark:text-white">47</p>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-xl"><Package className="h-5 w-5 text-yellow-500"/></div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm border-red-500/20">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2 text-red-500">Estoque Crítico</h3>
              <p className="text-3xl font-semibold text-zinc-900 dark:text-white">1 item</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded-xl"><Tag className="h-5 w-5 text-red-500"/></div>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800/60 text-xs uppercase tracking-wider text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="p-4 font-semibold">Produto</th>
              <th className="p-4 font-semibold">Categoria</th>
              <th className="p-4 font-semibold">Preço</th>
              <th className="p-4 font-semibold">Estoque</th>
              <th className="p-4 font-semibold text-right">Vendas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {produtosMock.map((prod) => (
              <tr key={prod.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white">{prod.name}</p>
                </td>
                <td className="p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {prod.cat}
                  </span>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    R$ {prod.price.toFixed(2)}
                  </p>
                </td>
                <td className="p-4">
                  {prod.stock > 0 ? (
                    <span className="text-sm font-medium text-emerald-500">{prod.stock} un</span>
                  ) : (
                    <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">ESGOTADO</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white flex items-center justify-end gap-1">
                    {prod.sales} <TrendingUp className="h-3 w-3 text-emerald-500" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
