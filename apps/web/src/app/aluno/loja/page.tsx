import { Store, ShoppingCart, Star, CreditCard } from "lucide-react";

export default function AlunoLojaPage() {
  const produtos = [
    { id: 1, name: "Kimono Fight Hub Oficial", cat: "Equipamento", price: 350.00, img: "🥋", featured: true },
    { id: 2, name: "Luva de Boxe 14oz PRO", cat: "Equipamento", price: 180.00, img: "🥊", featured: false },
    { id: 3, name: "Whey Protein Isolado", cat: "Suplemento", price: 120.00, img: "🥤", featured: false },
    { id: 4, name: "Rash Guard Compression", cat: "Vestuário", price: 110.00, img: "👕", featured: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      
      {/* Header Minimalista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Fight Shop
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Equipamentos Oficiais e Suplementos.
          </p>
        </div>
        <button className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold tracking-wide transition-all shadow-md hover:scale-105 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Carrinho (0)</span>
        </button>
      </div>

      {/* Categorias */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {["Todos", "Kimonos", "Luvas", "Suplementos", "Vestuário"].map((cat, i) => (
          <button 
            key={cat}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-colors ${
              i === 0 
                ? "bg-yellow-500 text-black" 
                : "bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {produtos.map((prod) => (
          <div key={prod.id} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm hover:border-yellow-500/50 transition-all group flex flex-col">
            
            {prod.featured && (
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-yellow-500 mb-4">
                <Star className="h-3 w-3 fill-yellow-500" /> Mais Vendido
              </div>
            )}
            
            <div className={`w-full aspect-square bg-zinc-50 dark:bg-zinc-900/50 rounded-[16px] mb-6 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform ${!prod.featured ? 'mt-8' : ''}`}>
              {prod.img}
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">
              {prod.cat}
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 leading-tight flex-1">
              {prod.name}
            </h3>
            
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-xs text-zinc-500">A partir de</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">R$ {prod.price.toFixed(2)}</p>
              </div>
              <button className="h-10 w-10 bg-yellow-500 text-black rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors">
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
