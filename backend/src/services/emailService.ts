import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY não está configurada.");
  }

  return new Resend(apiKey);
}

function getDefaultFromEmail() {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("EMAIL_FROM não está configurado.");
  }

  return from;
}

function getMarketingFromEmail() {
  const from = process.env.EMAIL_FROM_MARKETING;

  if (!from) {
    throw new Error("EMAIL_FROM_MARKETING não está configurado.");
  }

  return from;
}

type SendPasswordResetEmailParams = {
  to: string;
  resetLink: string;
};

type SendSupportMessageEmailParams = {
  userName: string;
  userEmail: string;
  message: string;
};

type SendPromotionalEmailParams = {
  to: string;
  subject: string;
  userName?: string;
  couponCode: string;
  discountText: string;
  ctaUrl: string;
  expiresText: string;
};

type SendBulkPromotionalEmailParams = {
  recipients: Array<{
    email: string;
    name?: string | null;
  }>;
  subject: string;
  couponCode: string;
  discountText: string;
  ctaUrl: string;
  expiresText: string;
};

function buildPromotionalEmailHtml({
  userName,
  couponCode,
  discountText,
  ctaUrl,
  expiresText,
}: Omit<SendPromotionalEmailParams, "to" | "subject">) {
  const greeting = userName?.trim() ? `Olá, ${userName}!` : "Olá!";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="margin-bottom: 12px;">${greeting}</h2>

      <p>Quero começar dizendo <strong>muito obrigado por usar o Arquivapp</strong>.</p>

      <p>
        Seu apoio nas primeiras fases do projeto faz toda a diferença. Estou trabalhando
        constantemente para melhorar a plataforma e adicionar novos recursos para facilitar
        a organização e o compartilhamento de arquivos.
      </p>

      <p>
        Como forma de agradecimento, preparei <strong>${discountText}</strong> no plano PRO.
      </p>

      <div style="margin: 20px 0; padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f9fafb;">
        <p style="margin: 0 0 8px;"><strong>Cupom:</strong></p>
        <p style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.04em; color: #2563eb;">
          ${couponCode}
        </p>
      </div>

      <p><strong>Validade:</strong> ${expiresText}</p>

      <p style="margin: 24px 0;">
        <a
          href="${ctaUrl}"
          style="display: inline-block; background: #2563eb; color: white; padding: 12px 18px; text-decoration: none; border-radius: 8px; font-weight: 700;"
        >
          Atualizar para PRO
        </a>
      </p>

      <p>
        Se tiver qualquer sugestão ou feedback sobre o Arquivapp, eu adoraria ouvir.
        Seu retorno ajuda muito a melhorar o produto.
      </p>

      <p style="margin-top: 24px;">
        Obrigado novamente por fazer parte dessa fase inicial do Arquivapp.
      </p>

      <p style="margin-top: 24px;">
        Abraço,<br />
        <strong>Jorge</strong><br />
        Fundador do Arquivapp
      </p>
    </div>
  `;
}

export async function sendPasswordResetEmail({
  to,
  resetLink,
}: SendPasswordResetEmailParams) {
  const from = getDefaultFromEmail();
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Redefinição de senha - Arquivapp",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Redefinição de senha</h2>
        <p>Recebemos uma solicitação para redefinir sua senha no Arquivapp.</p>
        <p>
          <a href="${resetLink}" 
             style="background:#2563eb;color:white;padding:10px 16px;text-decoration:none;border-radius:6px;">
            Redefinir senha
          </a>
        </p>
        <p>Ou copie este link no navegador:</p>
        <p>${resetLink}</p>
        <p>Se você não fez essa solicitação, ignore este email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email com Resend:", error);
    throw new Error("Erro ao enviar email");
  }
}

export async function sendSupportMessageEmail({
  userName,
  userEmail,
  message,
}: SendSupportMessageEmailParams) {
  const from = getDefaultFromEmail();
  const supportEmail = process.env.SUPPORT_EMAIL;

  if (!supportEmail) {
    throw new Error("SUPPORT_EMAIL não está configurado.");
  }

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from,
    to: supportEmail,
    subject: "Nova mensagem de suporte - Arquivapp",
    replyTo: userEmail,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Nova mensagem de suporte</h2>
        <p><strong>Usuário:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Mensagem:</strong></p>
        <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
          ${message.replace(/\n/g, "<br />")}
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Erro ao enviar mensagem de suporte com Resend:", error);
    throw new Error("Erro ao enviar mensagem de suporte");
  }
}

export async function sendPromotionalEmail({
  to,
  subject,
  userName,
  couponCode,
  discountText,
  ctaUrl,
  expiresText,
}: SendPromotionalEmailParams) {
  const from = getMarketingFromEmail();
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html: buildPromotionalEmailHtml({
      userName,
      couponCode,
      discountText,
      ctaUrl,
      expiresText,
    }),
  });

  if (error) {
    console.error("Erro ao enviar email promocional com Resend:", error);
    throw new Error("Erro ao enviar email promocional");
  }
}

export async function sendBulkPromotionalEmail({
  recipients,
  subject,
  couponCode,
  discountText,
  ctaUrl,
  expiresText,
}: SendBulkPromotionalEmailParams) {
  for (const recipient of recipients) {
    await sendPromotionalEmail({
      to: recipient.email,
      subject,
      userName: recipient.name ?? undefined,
      couponCode,
      discountText,
      ctaUrl,
      expiresText,
    });

    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

type SendFolderInviteEmailParams = {
  to: string;
  invitedUserName?: string | null;
  ownerName: string;
  folderName: string;
  loginUrl: string;
};

export async function sendFolderInviteEmail({
  to,
  invitedUserName,
  ownerName,
  folderName,
  loginUrl,
}: SendFolderInviteEmailParams) {
  const from = getMarketingFromEmail();
  const resend = getResendClient();

  const greeting = invitedUserName?.trim()
    ? `Olá, ${invitedUserName}!`
    : "Olá!";

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `${ownerName} compartilhou uma pasta com você no Arquivapp`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 12px;">${greeting}</h2>

        <p>
          <strong>${ownerName}</strong> compartilhou uma pasta com você no Arquivapp.
        </p>

        <div style="margin: 20px 0; padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f9fafb;">
          <p style="margin: 0 0 8px;"><strong>Pasta compartilhada:</strong></p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #2563eb;">
            ${folderName}
          </p>
        </div>

        <p>
          Faça login no Arquivapp para acessar a pasta compartilhada.
        </p>

        <p style="margin: 24px 0;">
          <a
            href="${loginUrl}"
            style="display: inline-block; background: #2563eb; color: white; padding: 12px 18px; text-decoration: none; border-radius: 8px; font-weight: 700;"
          >
            Acessar o Arquivapp
          </a>
        </p>

        <p>
          Se você ainda não entrou na sua conta recentemente, basta fazer login
          para visualizar a pasta na área de compartilhamentos.
        </p>

        <p style="margin-top: 24px;">
          Abraço,<br />
          <strong>Equipe Arquivapp</strong>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Erro ao enviar convite de pasta com Resend:", error);
    throw new Error("Erro ao enviar convite de pasta");
  }
}

type SendFolderInviteLinkEmailParams = {
  to: string;
  ownerName: string;
  folderName: string;
  inviteUrl: string;
};

export async function sendFolderInviteLinkEmail({
  to,
  ownerName,
  folderName,
  inviteUrl,
}: SendFolderInviteLinkEmailParams) {
  const from = getMarketingFromEmail();
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `${ownerName} convidou você para uma pasta no Arquivapp`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2>Você recebeu um convite no Arquivapp</h2>

        <p>
          <strong>${ownerName}</strong> compartilhou a pasta
          <strong> ${folderName}</strong> com você.
        </p>

        <p>
          Para acessar a pasta, clique no botão abaixo e crie sua conta ou entre no Arquivapp.
        </p>

        <p style="margin: 24px 0;">
          <a
            href="${inviteUrl}"
            style="display: inline-block; background: #2563eb; color: white; padding: 12px 18px; text-decoration: none; border-radius: 8px; font-weight: 700;"
          >
            Aceitar convite
          </a>
        </p>

        <p>Se você não esperava este convite, pode ignorar este email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email de convite com link:", error);
    throw new Error("Erro ao enviar convite com link");
  }
}

type SendEmailVerificationParams = {
  to: string;
  userName?: string | null;
  verificationUrl: string;
};

export async function sendEmailVerification({
  to,
  userName,
  verificationUrl,
}: SendEmailVerificationParams) {
  const from = getDefaultFromEmail();
  const resend = getResendClient();

  const greeting = userName?.trim() ? `Olá, ${userName}!` : "Olá!";

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Confirme seu cadastro no Arquivapp",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2>${greeting}</h2>

        <p>
          Seu cadastro no <strong>Arquivapp</strong> foi criado com sucesso.
        </p>

        <p>
          Para ativar sua conta, confirme seu e-mail clicando no botão abaixo:
        </p>

        <p style="margin: 24px 0;">
          <a
            href="${verificationUrl}"
            style="display: inline-block; background: #2563eb; color: white; padding: 12px 18px; text-decoration: none; border-radius: 8px; font-weight: 700;"
          >
            Confirmar e-mail
          </a>
        </p>

        <p>
          Se você não fez esse cadastro, pode ignorar esta mensagem.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email de verificação:", error);
    throw new Error("Erro ao enviar email de verificação");
  }
}