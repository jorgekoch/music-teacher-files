import nodemailer from "nodemailer";

type PasswordResetEmailParams = {
  to: string;
  resetLink: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;
}

function createTransporter() {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(getRequiredEnv("SMTP_PORT"));
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function verifyEmailConnection() {
  const transporter = createTransporter();
  await transporter.verify();
  console.log("SMTP do Gmail conectado com sucesso.");
}

export async function sendPasswordResetEmail({
  to,
  resetLink,
}: PasswordResetEmailParams) {
  const transporter = createTransporter();
  const from = getRequiredEnv("SMTP_USER");

  await transporter.sendMail({
    from: `"Arquivapp" <${from}>`,
    to,
    subject: "Recuperação de senha - Arquivapp",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Recuperação de senha</h2>
        <p>Recebemos uma solicitação para redefinir sua senha no Arquivapp.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <p>
          <a
            href="${resetLink}"
            style="display:inline-block;padding:12px 18px;background:#b42318;color:#fff;text-decoration:none;border-radius:8px;"
          >
            Redefinir senha
          </a>
        </p>
        <p>Se preferir, você também pode copiar e colar este link no navegador:</p>
        <p>${resetLink}</p>
        <p>Esse link expira em 30 minutos.</p>
        <p>Se você não solicitou essa alteração, pode ignorar este e-mail.</p>
      </div>
    `,
  });

  console.log(`E-mail de recuperação enviado para ${to}`);
}