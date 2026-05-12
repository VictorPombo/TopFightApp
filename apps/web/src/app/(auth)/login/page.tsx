"use client";

import { BoxingGlove } from "@/components/icons/BoxingGlove";
import { ShieldCheck, Smartphone, Users } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-yellow-500 p-3 rounded-2xl mb-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <BoxingGlove className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Bem-vindo de volta</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Escolha o portal que deseja acessar (Apresentação).
          </p>
        </div>

        {/* Botões de Acesso Direto */}
        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[32px] shadow-2xl flex flex-col gap-4">
          
          <Link href="/admin" className="w-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 px-4 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors">
            <ShieldCheck className="h-5 w-5" />
            Painel do Administrador
          </Link>

          <Link href="/aluno" className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 px-4 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors">
            <Smartphone className="h-5 w-5" />
            App do Aluno
          </Link>

          <Link href="/professor" className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500/20 px-4 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors">
            <Users className="h-5 w-5" />
            Portal do Professor
          </Link>

          <Link href="/responsavel" className="w-full bg-purple-500/10 border border-purple-500/20 text-purple-500 hover:bg-purple-500/20 px-4 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors">
            <Users className="h-5 w-5" />
            Área do Responsável
          </Link>

        </div>

        <p className="text-center text-xs text-zinc-600">
          A autenticação real foi temporariamente desativada para a demonstração do sistema.
        </p>

      </div>
    </div>
  );
}
