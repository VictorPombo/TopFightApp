"use client";
import { Camera, CheckCircle2, XCircle, User, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function RecepcaoScannerPage() {
  const [scanState, setScanState] = useState<"idle" | "success" | "error" | "warning">("idle");
  const [lastScanned, setLastScanned] = useState<any>(null);

  // Simula scans aleatórios a cada 5 segundos para a demonstração
  useEffect(() => {
    const timer = setInterval(() => {
      const random = Math.random();
      if (random > 0.7) {
        setScanState("success");
        setLastScanned({ name: "Carlos Silva", status: "Liberado", plan: "Mensal Completo", freq: "3x/semana" });
      } else if (random > 0.4) {
        setScanState("warning");
        setLastScanned({ name: "Mariana Costa", status: "Mensalidade Vence Hoje", plan: "Trimestral", freq: "2x/semana" });
      } else {
        setScanState("error");
        setLastScanned({ name: "João Pedro", status: "Acesso Bloqueado - Inadimplente", plan: "Mensal Básico", freq: "0x/semana" });
      }

      setTimeout(() => {
        setScanState("idle");
      }, 4000);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
            Recepção & Check-in
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Controle de acesso por QR Code ou Biometria Facial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Câmera Mock */}
        <div className="bg-[#0A0A0A] border-4 border-zinc-800 rounded-[32px] overflow-hidden relative aspect-[4/3] flex flex-col items-center justify-center shadow-2xl">
          {/* Scan Line Animation */}
          <div className="absolute top-0 w-full h-1 bg-yellow-500 shadow-[0_0_20px_#EAB308] animate-[scan_2s_ease-in-out_infinite]" />
          
          <Camera className="h-16 w-16 text-zinc-600 mb-4 opacity-50" />
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-sm">Câmera Ativa</p>
          <p className="text-zinc-600 text-xs mt-2">Aguardando aproximação do aluno...</p>
          
          <div className="absolute inset-8 border-2 border-dashed border-zinc-700 rounded-[24px] opacity-30" />
        </div>

        {/* Status Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800/60 rounded-[24px] p-8 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden transition-colors duration-500">
            
            {scanState === "idle" && (
              <div className="text-center opacity-50">
                <User className="h-20 w-20 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Nenhum aluno identificado</h3>
              </div>
            )}

            {scanState === "success" && (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                <CheckCircle2 className="h-24 w-24 mx-auto text-emerald-500 mb-4" />
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">{lastScanned?.name}</h3>
                <span className="inline-block px-4 py-1 bg-emerald-500 text-white font-bold rounded-full text-sm uppercase tracking-wider mb-6">
                  {lastScanned?.status}
                </span>
                
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-emerald-500/20">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Plano</p>
                    <p className="font-semibold text-zinc-900 dark:text-white">{lastScanned?.plan}</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-emerald-500/20">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Frequência</p>
                    <p className="font-semibold text-zinc-900 dark:text-white">{lastScanned?.freq}</p>
                  </div>
                </div>
              </div>
            )}

            {scanState === "warning" && (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="absolute inset-0 bg-yellow-500/10 pointer-events-none" />
                <AlertTriangle className="h-24 w-24 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">{lastScanned?.name}</h3>
                <span className="inline-block px-4 py-1 bg-yellow-500 text-black font-bold rounded-full text-sm uppercase tracking-wider mb-6">
                  {lastScanned?.status}
                </span>
              </div>
            )}

            {scanState === "error" && (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
                <XCircle className="h-24 w-24 mx-auto text-red-500 mb-4" />
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">{lastScanned?.name}</h3>
                <span className="inline-block px-4 py-1 bg-red-500 text-white font-bold rounded-full text-sm uppercase tracking-wider mb-6">
                  {lastScanned?.status}
                </span>
              </div>
            )}

          </div>
          
          <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-[16px] font-bold text-lg hover:scale-[1.02] transition-transform">
            Entrada Manual (Buscar Aluno)
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}} />
    </div>
  );
}
