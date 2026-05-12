"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Loader2, ShieldAlert, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DevLoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (email: string, redirectUrl: string) => {
    setLoading(email);
    
    // Fazer logout primeiro para limpar a sessão antiga
    await supabase.auth.signOut();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: "password123",
    });

    if (error) {
      alert("Erro ao logar: " + error.message);
      setLoading(null);
      return;
    }

    // Sucesso, recarrega a página para o middleware agir
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans text-white">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <ShieldAlert className="h-8 w-8 text-yellow-500" />
          <h1 className="text-2xl font-black uppercase tracking-widest">Dev Switcher</h1>
        </div>

        <p className="text-zinc-400 text-center text-sm mb-8">
          Acesso rápido às contas de demonstração criadas pelo Seed. Clique em um perfil para testar a visão dele no sistema.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("admin@fighthub.com", "/admin")}
            disabled={!!loading}
            className="w-full bg-black border border-white/10 hover:border-sky-500/50 p-4 rounded-2xl flex items-center gap-4 transition-all group"
          >
            <div className="bg-sky-500/10 p-3 rounded-xl text-sky-500">
              <Shield className="h-6 w-6" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-white text-lg">Admin / Dono</h3>
              <p className="text-xs text-zinc-500">admin@fighthub.com</p>
            </div>
            {loading === "admin@fighthub.com" && <Loader2 className="h-5 w-5 animate-spin text-sky-500" />}
          </button>

          <button
            onClick={() => handleLogin("professor@fighthub.com", "/professor")}
            disabled={!!loading}
            className="w-full bg-black border border-white/10 hover:border-violet-500/50 p-4 rounded-2xl flex items-center gap-4 transition-all group"
          >
            <div className="bg-violet-500/10 p-3 rounded-xl text-violet-500">
              <User className="h-6 w-6" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-white text-lg">Professor</h3>
              <p className="text-xs text-zinc-500">professor@fighthub.com</p>
            </div>
            {loading === "professor@fighthub.com" && <Loader2 className="h-5 w-5 animate-spin text-violet-500" />}
          </button>

          <button
            onClick={() => handleLogin("aluno@fighthub.com", "/aluno")}
            disabled={!!loading}
            className="w-full bg-black border border-white/10 hover:border-yellow-500/50 p-4 rounded-2xl flex items-center gap-4 transition-all group"
          >
            <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-500">
              <User className="h-6 w-6" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-white text-lg">Aluno</h3>
              <p className="text-xs text-zinc-500">aluno@fighthub.com</p>
            </div>
            {loading === "aluno@fighthub.com" && <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />}
          </button>
        </div>

      </div>
    </div>
  );
}
