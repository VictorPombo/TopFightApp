"use client";

import { Dumbbell, Calendar, Home, LogOut, Ticket } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pb-20 md:pb-0 flex flex-col md:flex-row transition-colors duration-300">
      {/* Top Header Mobile */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <Dumbbell className="h-5 w-5 text-black" />
          </div>
          <span className="font-black tracking-widest uppercase">Fight Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={async () => {
              const result = await logoutAction();
              if (result.success) {
                window.location.href = result.redirectUrl;
              }
            }}
            className="text-zinc-500 p-2 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 fixed h-screen p-6 transition-colors">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-yellow-500 p-2 rounded-lg shadow-lg shadow-yellow-500/20">
            <Dumbbell className="h-6 w-6 text-black" />
          </div>
          <span className="font-black text-xl tracking-widest uppercase text-zinc-900 dark:text-white">Fight Hub</span>
        </div>

        <nav className="flex-1 space-y-2 mt-4">
          <a href="/aluno" className="flex items-center gap-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-4 py-3 rounded-xl font-bold">
            <Home className="h-5 w-5" />
            Meu Perfil
          </a>
          <a href="/aluno/grade" className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-900 px-4 py-3 rounded-xl font-bold transition-colors">
            <Calendar className="h-5 w-5" />
            Grade de Aulas
          </a>
          <a href="/aluno/rifas" className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-900 px-4 py-3 rounded-xl font-bold transition-colors">
            <Ticket className="h-5 w-5" />
            Rifas
          </a>
        </nav>

        <div className="mb-4">
          <ThemeToggle />
        </div>
        <button 
          onClick={async () => {
            const result = await logoutAction();
            if (result.success) {
              window.location.href = result.redirectUrl;
            }
          }}
          className="flex items-center gap-3 text-zinc-500 hover:text-red-500 w-full px-4 py-3 rounded-xl font-bold transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair da Conta
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 flex justify-around p-3 z-50 pb-safe transition-colors">
        <a href="/aluno" className="flex flex-col items-center p-2 text-yellow-500">
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-bold mt-1 uppercase">Início</span>
        </a>
        <a href="/aluno/grade" className="flex flex-col items-center p-2 text-zinc-500 hover:text-zinc-300">
          <Calendar className="h-6 w-6" />
          <span className="text-[10px] font-bold mt-1 uppercase">Aulas</span>
        </a>
        <a href="/aluno/rifas" className="flex flex-col items-center p-2 text-zinc-500 hover:text-zinc-300">
          <Ticket className="h-6 w-6" />
          <span className="text-[10px] font-bold mt-1 uppercase">Rifas</span>
        </a>
      </nav>
    </div>
  );
}
