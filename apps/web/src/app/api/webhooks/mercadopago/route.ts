import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 }
});
const payment = new Payment(client);

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const type = url.searchParams.get("type");
    
    // Na V1 da API, o body vem com type e data.id
    // Na V2 da API, usamos search params data.id
    const body = await request.json();
    
    // Extraindo o ID do pagamento dependendo de como o webhook envia (varia entre V1 e Topic)
    const paymentId = body.data?.id || url.searchParams.get("data.id");

    // Verifica se é uma notificação de pagamento
    if ((type === "payment" || action === "payment.created" || action === "payment.updated") && paymentId) {
      
      // Busca os dados atualizados do pagamento na API do MP por segurança
      const paymentData = await payment.get({ id: paymentId });
      
      if (paymentData.status === "approved") {
        // Inicializa o cliente Admin do Supabase (bypass RLS)
        const supabaseAdmin = createAdminClient();
        
        // Pega os tickets registrados nesse pagamento
        const { data: tickets, error: fetchError } = await supabaseAdmin
          .from("raffle_tickets")
          .select("id, status_pagamento")
          .eq("mercado_pago_payment_id", paymentId.toString());

        if (fetchError) {
          console.error("Erro ao buscar tickets no Webhook:", fetchError);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        // Se encontrou tickets que ainda estão reservados, aprova
        const ticketsToApprove = tickets?.filter(t => t.status_pagamento === "reservado") || [];
        
        if (ticketsToApprove.length > 0) {
          const { error: updateError } = await supabaseAdmin
            .from("raffle_tickets")
            .update({ 
              status_pagamento: "pago",
              reserved_until: null // Limpa a expiração já que foi pago
            })
            .in("id", ticketsToApprove.map(t => t.id));

          if (updateError) {
            console.error("Erro ao atualizar status dos tickets:", updateError);
            return NextResponse.json({ error: "Failed to update tickets" }, { status: 500 });
          }

          console.log(`Sucesso: ${ticketsToApprove.length} tickets pagos para o pagamento ${paymentId}`);
        }
      }
    }

    // Mercado Pago sempre espera um 200 OK para saber que recebemos
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erro genérico no Webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
