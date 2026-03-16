import "dotenv/config";
import prisma from "../database/prisma";
import { sendPromotionalEmail } from "../services/emailService";

const SUBJECT = "Obrigado por usar o Arquivapp — presente especial para você 🎁";
const COUPON_CODE = "OBRIGADO25";
const DISCOUNT_TEXT = "25% de desconto no plano PRO";
const EXPIRES_TEXT = "até o final desta semana";
const CTA_URL = `${process.env.FRONTEND_URL}/dashboard`;

const DELAY_MS = 500;

// true = envia só para o email de teste abaixo
// false = envia para usuários FREE reais do banco
const TEST_MODE = true;

const TEST_RECIPIENT = {
  email: "jorgeluizkoch@gmail.com",
  name: "Jorge",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getRecipients() {
  if (TEST_MODE) {
    return [TEST_RECIPIENT];
  }

  const users = await prisma.user.findMany({
    where: {
      plan: "FREE",
    },
    select: {
      email: true,
      name: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const uniqueByEmail = new Map<string, { email: string; name: string | null }>();

  for (const user of users) {
    const normalizedEmail = user.email?.trim().toLowerCase();

    if (!normalizedEmail) continue;

    if (!uniqueByEmail.has(normalizedEmail)) {
      uniqueByEmail.set(normalizedEmail, {
        email: normalizedEmail,
        name: user.name,
      });
    }
  }

  return Array.from(uniqueByEmail.values());
}

async function main() {
  if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL não está configurado.");
  }

  console.log("📨 Iniciando campanha promocional do Arquivapp...\n");

  const recipients = await getRecipients();

  if (recipients.length === 0) {
    console.log("Nenhum destinatário encontrado.");
    return;
  }

  console.log(
    TEST_MODE
      ? `Modo teste ativado. Enviando apenas para ${TEST_RECIPIENT.email}\n`
      : `Enviando para ${recipients.length} usuário(s) FREE\n`
  );

  let successCount = 0;
  let errorCount = 0;

  const failures: Array<{ email: string; error: string }> = [];

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    const index = i + 1;

    try {
      console.log(`➡️  [${index}/${recipients.length}] Enviando para ${recipient.email}...`);

      await sendPromotionalEmail({
        to: recipient.email,
        subject: SUBJECT,
        userName: recipient.name ?? undefined,
        couponCode: COUPON_CODE,
        discountText: DISCOUNT_TEXT,
        ctaUrl: CTA_URL,
        expiresText: EXPIRES_TEXT,
      });

      successCount++;
      console.log(`✅ [${index}/${recipients.length}] Email enviado com sucesso para ${recipient.email}\n`);
    } catch (error: any) {
      errorCount++;
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      failures.push({
        email: recipient.email,
        error: message,
      });

      console.error(`❌ [${index}/${recipients.length}] Falha ao enviar para ${recipient.email}: ${message}\n`);
    }

    if (i < recipients.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log("—— Resumo da campanha ——");
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Falhas: ${errorCount}`);

  if (failures.length > 0) {
    console.log("\nFalhas encontradas:");
    for (const failure of failures) {
      console.log(`- ${failure.email}: ${failure.error}`);
    }
  }

  console.log("\n🏁 Campanha finalizada.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Erro geral na campanha:", error);
    await prisma.$disconnect();
    process.exit(1);
  });