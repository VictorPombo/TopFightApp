import { Heart, MessageCircle, Share2, Image as ImageIcon } from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";

export default function ComunidadePage() {
  const posts = [
    { 
      id: 1, 
      author: "Prof. Marcos", 
      role: "Mestre", 
      time: "Há 2 horas", 
      content: "Excelente treino hoje turma! Parabéns a todos que participaram do aulão de sábado. O tatame ferveu! Oss 🥋🔥", 
      likes: 24, 
      comments: 5 
    },
    { 
      id: 2, 
      author: "Fight Hub Oficial", 
      role: "Academia", 
      time: "Ontem às 18:30", 
      content: "NOVIDADE! Os novos Kimonos oficiais já estão disponíveis na nossa Loja Virtual. Corre lá pra garantir o seu com desconto de lançamento! 🛒🥊", 
      likes: 56, 
      comments: 12 
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
          Comunidade
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Fique por dentro das novidades e interaja com a equipe.
        </p>
      </div>

      {/* Criar Post (Simulado) */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm flex gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 shrink-0">
          V
        </div>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Compartilhe algo com a academia..." 
            className="w-full bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-white placeholder-zinc-500 pb-4 border-b border-zinc-100 dark:border-zinc-800"
          />
          <div className="flex justify-between items-center mt-4">
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <ImageIcon className="h-5 w-5" />
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm">
              Publicar
            </button>
          </div>
        </div>
      </div>

      {/* Feed de Notícias */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black shrink-0">
                  {post.role === 'Mestre' ? <BoxingGlove className="h-6 w-6" /> : 'FH'}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white leading-tight">{post.author}</h4>
                  <p className="text-xs text-zinc-500 flex items-center gap-2">
                    <span className="font-semibold text-yellow-600 dark:text-yellow-500">{post.role}</span> • {post.time}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
              {post.content}
            </p>
            
            <div className="flex items-center gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors font-medium text-sm group">
                <Heart className="h-5 w-5 group-hover:fill-red-500" /> {post.likes}
              </button>
              <button className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors font-medium text-sm">
                <MessageCircle className="h-5 w-5" /> {post.comments}
              </button>
              <button className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium text-sm ml-auto">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
