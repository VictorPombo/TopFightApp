"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { reserveTickets } from "@/actions/raffle";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, CheckCircle2, Ticket } from "lucide-react";
import Image from "next/image";

type Step = "SELECT" | "PAYMENT" | "SUCCESS";

export default function RifaPage() {
  const params = useParams();
  const raffleId = params.id as string;
  
  const [step, setStep] = useState<Step>("SELECT");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const [ticketNumbers, setTicketNumbers] = useState<number[]>([]);

  const supabase = createClient();

  const handleBuy = async (qty: number) => {
    setLoading(true);
    setError("");
    setQuantity(qty);

    try {
      const result = await reserveTickets(raffleId, qty);
      
      if (!result.success) {
        setError(result.error || "Ocorreu um erro ao processar sua reserva.");
        setLoading(false);
        return;
      }

      setPaymentData(result);
      setTicketNumbers(result.ticket_numbers || []);
      setStep("PAYMENT");
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "PAYMENT" && paymentData?.payment_id) {
      // Escutar a tabela raffle_tickets
      const channel = supabase
        .channel(`payment-${paymentData.payment_id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "raffle_tickets",
            filter: `mercado_pago_payment_id=eq.${paymentData.payment_id}`,
          },
          (payload) => {
            if (payload.new.status_pagamento === "pago") {
              setStep("SUCCESS");
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [step, paymentData, supabase]);

  const copyToClipboard = () => {
    if (paymentData?.qr_code) {
      navigator.clipboard.writeText(paymentData.qr_code);
      alert("Código PIX copiado!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        
        {step === "SELECT" && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Sorteio Especial</CardTitle>
              <CardDescription className="text-slate-400">
                Selecione a quantidade de números que deseja comprar (Compra Rápida).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-red-500/20 text-red-400 rounded-md text-sm">{error}</div>}
              
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={() => handleBuy(1)} 
                  disabled={loading}
                  className="w-full h-14 text-lg bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {loading && quantity === 1 ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Comprar 1 Número
                </Button>
                <Button 
                  onClick={() => handleBuy(5)} 
                  disabled={loading}
                  className="w-full h-14 text-lg bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {loading && quantity === 5 ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Comprar 5 Números
                </Button>
                <Button 
                  onClick={() => handleBuy(10)} 
                  disabled={loading}
                  className="w-full h-14 text-lg bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {loading && quantity === 10 ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Comprar 10 Números
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === "PAYMENT" && paymentData && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-white">Pagamento PIX</CardTitle>
              <CardDescription className="text-slate-400">
                Leia o QR Code ou copie o código abaixo. <br/>
                <span className="text-orange-400 font-semibold text-xs mt-1 block">Aguardando confirmação do pagamento...</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {paymentData.qr_code_base64 && (
                <div className="bg-white p-4 rounded-xl">
                  <Image 
                    src={`data:image/jpeg;base64,${paymentData.qr_code_base64}`} 
                    alt="QR Code PIX" 
                    width={200} 
                    height={200}
                    className="w-48 h-48"
                  />
                </div>
              )}
              
              <Button 
                variant="outline" 
                onClick={copyToClipboard}
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white"
              >
                <Copy className="mr-2 h-4 w-4" /> Copiar Código PIX
              </Button>
            </CardContent>
          </>
        )}

        {step === "SUCCESS" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Pagamento Confirmado!</CardTitle>
              <CardDescription className="text-slate-400">
                Abaixo estão os seus números da sorte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-xl p-6 flex flex-wrap gap-3 justify-center">
                {ticketNumbers.map(num => (
                  <div key={num} className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
                    {num}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-slate-700 border-slate-600 text-white" onClick={() => setStep("SELECT")}>
                Comprar mais números
              </Button>
            </CardFooter>
          </>
        )}

      </Card>
    </div>
  );
}
