"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/actions/register";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const result = await registerAction(formData);

    if (!result.success) {
      setError(result.error || "Erro ao realizar cadastro.");
      setLoading(false);
      return;
    }

    if (result.redirectUrl) {
      router.push(result.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-zinc-50 dark:bg-black overflow-hidden transition-colors duration-500">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 dark:opacity-100"
      >
        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative backdrop-blur-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-[0_0_60px_-15px_rgba(234,179,8,0.3)] p-10">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-4 transform hover:rotate-6 transition-transform duration-300">
              <BoxingGlove className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-widest drop-shadow-sm">
              Criar <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Conta</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-2 tracking-wide text-sm">Cadastre-se como Aluno</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-zinc-700 dark:text-zinc-300 font-bold ml-1">Nome Completo</Label>
              <Input 
                id="nome" 
                name="nome" 
                type="text" 
                required 
                placeholder="Seu Nome Completo"
                className="bg-white dark:bg-black/50 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-14 rounded-xl focus-visible:ring-yellow-500 focus-visible:border-yellow-500 transition-all text-lg px-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-bold ml-1">Seu E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="E-mail"
                className="bg-white dark:bg-black/50 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-14 rounded-xl focus-visible:ring-yellow-500 focus-visible:border-yellow-500 transition-all text-lg px-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-bold ml-1">Senha</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className="bg-white dark:bg-black/50 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-14 rounded-xl focus-visible:ring-yellow-500 focus-visible:border-yellow-500 transition-all text-lg pl-4 pr-12 tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-700 dark:text-zinc-300 font-bold ml-1">Confirmar Senha</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className={`bg-white dark:bg-black/50 border text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-14 rounded-xl transition-all text-lg pl-4 pr-12 tracking-widest ${passwordsMatch ? 'border-zinc-300 dark:border-zinc-800 focus-visible:ring-yellow-500 focus-visible:border-yellow-500' : 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-red-500 text-xs font-medium ml-1 mt-1 animate-in fade-in">As senhas não coincidem</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black h-14 rounded-xl text-lg font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 transition-all mt-6"
            >
              {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" /> : "Finalizar Cadastro"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              Já possui uma conta?{" "}
              <a href="/login" className="text-yellow-600 dark:text-yellow-500 font-bold hover:underline transition-all">
                Fazer Login
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
