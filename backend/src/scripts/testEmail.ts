import { sendPromotionalEmail } from "../services/emailService";

async function main() {
  await sendPromotionalEmail({
    to: "jorgeluizkoch@gmail.com",
    subject: "Teste de envio - Arquivapp",
    userName: "Jorge",
    couponCode: "OBRIGADO25",
    discountText: "25% de desconto no plano PRO",
    ctaUrl: `${process.env.FRONTEND_URL}/dashboard`,
    expiresText: "até o final desta semana",
  });

  console.log("Email de teste enviado com sucesso.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});