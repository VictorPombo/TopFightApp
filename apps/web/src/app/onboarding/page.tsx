"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAcademyAction } from "@/actions/academy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Phone, Building2, ArrowRight, Trophy } from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createAcademyAction(formData);

    if (!result.success) {
      setError(result.error || "Erro ao criar academia.");
      setLoading(false);
      return;
    }

    if (result.redirectUrl) {
      router.push(result.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="backdrop-blur-2xl bg-zinc-900/80 border border-zinc-800 rounded-3xl shadow-2xl p-10">

          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-6">
              <BoxingGlove className="h-10 w-10 text-black" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest text-center">
              Crie sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Academia</span>
            </h1>
            <p className="text-zinc-400 font-medium mt-3 text-center max-w-md">
              Configure o Fight Hub para a sua academia de luta. Leva menos de 1 minuto.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  step >= s
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  {s}
                </div>
                {s < 2 && (
                  <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
                    step > s ? "bg-yellow-500" : "bg-zinc-800"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 bg-red-950/50 border border-red-900/50 text-red-300 px-4 py-3 rounded-xl font-medium text-sm animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-yellow-500" />
                    Nome da Academia
                  </Label>
                  <Input
                    name="name"
                    required
                    placeholder="Ex: CT Pitbull Fight"
                    className="bg-black/50 border-zinc-800 text-white placeholder:text-zinc-600 h-14 rounded-xl focus-visible:ring-yellow-500 text-lg px-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-yellow-500" />
                    Telefone / WhatsApp
                  </Label>
                  <Input
                    name="phone"
                    placeholder="(11) 99999-9999"
                    className="bg-black/50 border-zinc-800 text-white placeholder:text-zinc-600 h-14 rounded-xl focus-visible:ring-yellow-500 text-lg px-4"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black h-14 rounded-xl text-lg font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 mt-4"
                >
                  Continuar <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-yellow-500" />
                      Cidade
                    </Label>
                    <Input
                      name="city"
                      placeholder="São Paulo"
                      className="bg-black/50 border-zinc-800 text-white placeholder:text-zinc-600 h-14 rounded-xl focus-visible:ring-yellow-500 text-lg px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-bold ml-1">Estado</Label>
                    <Input
                      name="state"
                      placeholder="SP"
                      defaultValue="SP"
                      maxLength={2}
                      className="bg-black/50 border-zinc-800 text-white placeholder:text-zinc-600 h-14 rounded-xl focus-visible:ring-yellow-500 text-lg px-4 uppercase"
                    />
                  </div>
                </div>

                {/* Modalidades (visual preview) */}
                <div className="space-y-2">
                  <Label className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Modalidades (configure depois)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {["Jiu-Jitsu", "Muay Thai", "Boxe", "MMA", "Judô", "Karatê", "Wrestling"].map((mod) => (
                      <span key={mod} className="px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-zinc-400 rounded-lg text-sm font-medium">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 h-14 rounded-xl text-lg font-bold border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-yellow-500 hover:bg-yellow-400 text-black h-14 rounded-xl text-lg font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20"
                  >
                    {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Criar Academia 🥊"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
