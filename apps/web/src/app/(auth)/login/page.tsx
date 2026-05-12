"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (!result.success) {
      setError(result.error || "Erro ao realizar login.");
      setLoading(false);
      return;
    }

    if (result.redirectUrl) {
      router.push(result.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] text-white font-sans overflow-hidden relative">
      {/* Elementos de fundo minimalistas */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-900/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px] px-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-[16px] flex items-center justify-center shadow-inner mb-6">
            <BoxingGlove className="h-6 w-6 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight mb-1">Bem-vindo de volta</h1>
          <p className="text-sm text-zinc-500 font-medium">Faça login para acessar seu painel.</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-[28px] p-8 shadow-2xl">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-[16px] flex items-start gap-3 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-medium text-zinc-400 tracking-wide ml-1">E-mail</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="seu@email.com"
                className="w-full bg-[#0A0A0A] border border-zinc-800/80 text-white placeholder:text-zinc-600 h-12 rounded-[16px] focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm px-4 outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-[13px] font-medium text-zinc-400 tracking-wide">Senha</label>
                <a href="#" className="text-[11px] text-zinc-500 hover:text-yellow-500 transition-colors">Esqueceu?</a>
              </div>
              <div className="relative">
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-zinc-800/80 text-white placeholder:text-zinc-600 h-12 rounded-[16px] focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-sm pl-4 pr-12 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black h-12 rounded-[16px] text-sm font-semibold tracking-wide transition-all mt-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500 font-medium">
              Não tem uma conta?{" "}
              <a href="/register" className="text-zinc-300 hover:text-white transition-colors">
                Criar agora
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
