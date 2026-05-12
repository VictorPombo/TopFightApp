"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { manualCheckin } from "@/actions/checkin";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function ClassQrScanner({ sessionId }: { sessionId: string }) {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleScan = async (result: string) => {
    if (!result) return;
    if (result === lastScanned && status !== "error") return; // Evita scans duplicados em sequência
    if (status === "loading") return;

    // Formato esperado: STUDENT:uuid
    if (!result.startsWith("STUDENT:")) {
      setStatus("error");
      setMessage("QR Code inválido. Deve ser o passaporte do aluno.");
      setLastScanned(result);
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    const studentId = result.replace("STUDENT:", "");
    setLastScanned(result);
    setStatus("loading");

    try {
      const response = await manualCheckin(sessionId, studentId);
      
      if (response.success) {
        setStatus("success");
        setMessage("Check-in confirmado com sucesso!");
        // Som de sucesso (opcional)
        const audio = new Audio('/success.mp3');
        audio.play().catch(() => {});
      } else {
        setStatus("error");
        setMessage(response.error || "Erro ao registrar check-in.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Erro de comunicação com o servidor.");
    }

    // Volta pro scanner após 3 segundos
    setTimeout(() => {
      setStatus("idle");
    }, 3000);
  };

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl border-4 border-zinc-900 shadow-2xl bg-black">
      <div className="aspect-square relative">
        {status === "idle" && (
          <Scanner 
            onScan={(result) => handleScan(result[0]?.rawValue || "")}
            onError={(error) => console.log(error?.message)}
            components={{
              audio: false,
              tracker: true,
            }}
          />
        )}

        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6">
            <Loader2 className="h-16 w-16 animate-spin text-yellow-500 mb-4" />
            <p className="font-bold text-lg text-center">Processando check-in...</p>
          </div>
        )}

        {status === "success" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500 text-white p-6 animate-in zoom-in">
            <CheckCircle2 className="h-24 w-24 mb-4" />
            <h3 className="font-black text-2xl uppercase tracking-widest text-center">Sucesso!</h3>
            <p className="font-bold text-center mt-2">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500 text-white p-6 animate-in zoom-in">
            <XCircle className="h-24 w-24 mb-4" />
            <h3 className="font-black text-2xl uppercase tracking-widest text-center">Erro</h3>
            <p className="font-bold text-center mt-2">{message}</p>
          </div>
        )}
      </div>
      <div className="bg-zinc-900 p-4 text-center">
        <p className="text-zinc-400 text-sm font-medium">Aponte a câmera para o Passaporte do aluno</p>
      </div>
    </div>
  );
}
