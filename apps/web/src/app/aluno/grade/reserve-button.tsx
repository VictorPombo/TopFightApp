"use client";

import { useTransition } from "react";
import { reserveClassAction, cancelReservationAction } from "@/actions/schedule";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ReserveButton({ 
  sessionId, 
  isReserved, 
  isFull 
}: { 
  sessionId: string;
  isReserved: boolean;
  isFull: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    startTransition(async () => {
      if (isReserved) {
        const result = await cancelReservationAction(sessionId);
        if (result.success) {
          toast.success("Reserva cancelada.");
        } else {
          toast.error(result.error || "Erro ao cancelar.");
        }
      } else {
        const result = await reserveClassAction(sessionId);
        if (result.success) {
          toast.success("Vaga garantida!");
        } else {
          toast.error(result.error || "Erro ao reservar.");
        }
      }
    });
  };

  if (isReserved) {
    return (
      <>
        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-emerald-500/20 w-full sm:w-auto">
          <Check className="h-5 w-5" /> Vaga Garantida
        </div>
        <button 
          onClick={handleAction}
          disabled={isPending}
          className="text-xs font-semibold text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {isPending ? "Processando..." : "Cancelar Reserva"}
        </button>
      </>
    );
  }

  if (isFull) {
    return (
      <button disabled className="w-full sm:w-auto bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-[16px] font-semibold tracking-wide cursor-not-allowed">
        Esgotado
      </button>
    );
  }

  return (
    <button 
      onClick={handleAction}
      disabled={isPending}
      className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-[16px] font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      {isPending ? "Reservando..." : "Reservar Vaga"}
    </button>
  );
}
