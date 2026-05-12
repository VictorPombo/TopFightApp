"use server";

import { createClient } from "@/lib/supabase/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";

// Mercado Pago configuration
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 }
});
const payment = new Payment(client);

export async function reserveTickets(raffleId: string, quantity: number) {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const userId = userData.user.id;

    // 1. Busca tickets disponíveis e tenta reservá-quadrantemente para prevenir race conditions
    // O ideal para race condition no Supabase é usar RPC (função no BD). 
    // Como estamos fazendo pelo JS, vamos buscar os disponíveis e tentar fazer UPDATE com o status original.
    const { data: availableTickets, error: fetchError } = await supabase
      .from("raffle_tickets")
      .select("id, numero, status_pagamento")
      .eq("raffle_id", raffleId)
      .eq("status_pagamento", "disponivel")
      .limit(quantity);

    if (fetchError || !availableTickets || availableTickets.length < quantity) {
      return { success: false, error: "Não há números suficientes disponíveis." };
    }

    const ticketIds = availableTickets.map((t) => t.id);
    
    // Calcula timestamp de expiração (15 minutos no futuro)
    const reservedUntil = new Date();
    reservedUntil.setMinutes(reservedUntil.getMinutes() + 15);

    // 2. Faz o UPDATE atômico. Como o RLS está com USING(status_pagamento = 'disponivel'),
    // se alguém roubar o ticket no meio tempo, ele não será atualizado.
    const { data: updatedTickets, error: updateError } = await supabase
      .from("raffle_tickets")
      .update({
        user_id: userId,
        status_pagamento: "reservado",
        reserved_until: reservedUntil.toISOString(),
      })
      .in("id", ticketIds)
      .eq("status_pagamento", "disponivel")
      .select();

    if (updateError || !updatedTickets || updatedTickets.length !== quantity) {
      // Reverte a reserva dos que conseguiram se falhou em pegar todos
      if (updatedTickets && updatedTickets.length > 0) {
        await supabase
          .from("raffle_tickets")
          .update({
            user_id: null,
            status_pagamento: "disponivel",
            reserved_until: null,
          })
          .in("id", updatedTickets.map(t => t.id));
      }
      return { success: false, error: "Alguns números foram comprados por outra pessoa. Tente novamente." };
    }

    // 3. Pega detalhes da Rifa para compor o preço
    const { data: raffleData } = await supabase
      .from("raffles")
      .select("titulo, preco_por_numero")
      .eq("id", raffleId)
      .single();

    if (!raffleData) {
      return { success: false, error: "Rifa não encontrada." };
    }

    const totalAmount = raffleData.preco_por_numero * quantity;
    const idempotencyKey = uuidv4(); // Para evitar cobranças duplas no MP

    // 4. Cria preferência de PIX no Mercado Pago
    const paymentResponse = await payment.create({
      body: {
        transaction_amount: totalAmount,
        description: `Compra de ${quantity} números na rifa: ${raffleData.titulo}`,
        payment_method_id: "pix",
        payer: {
          email: userData.user.email || "aluno@fighthub.com", // Em prod, pegar do DB
        },
        metadata: {
          raffle_id: raffleId,
          user_id: userId,
          ticket_ids: ticketIds.join(","),
        }
      },
      requestOptions: { idempotencyKey }
    });

    // 5. Atualiza os tickets com o ID do pagamento do MP
    const mpPaymentId = paymentResponse.id?.toString();
    if (!mpPaymentId) {
       return { success: false, error: "Falha ao gerar o PIX." };
    }

    await supabase
      .from("raffle_tickets")
      .update({ mercado_pago_payment_id: mpPaymentId })
      .in("id", ticketIds);

    // 6. Retorna PIX Copia e Cola e QR Code Base64
    return {
      success: true,
      qr_code_base64: paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64,
      qr_code: paymentResponse.point_of_interaction?.transaction_data?.qr_code,
      ticket_numbers: availableTickets.map(t => t.numero),
      payment_id: mpPaymentId,
      expires_at: reservedUntil,
    };

  } catch (error: any) {
    console.error("Erro ao processar reserva:", error);
    return { success: false, error: "Erro interno ao processar a reserva." };
  }
}
