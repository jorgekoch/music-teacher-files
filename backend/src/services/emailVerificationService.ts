import crypto from "crypto";
import { AppError } from "../errors/AppError";
import {
  confirmUserEmail,
  findUserByEmailVerificationToken,
  setEmailVerificationToken,
} from "../repositories/userRepository";
import { sendEmailVerification } from "./emailService";

export async function generateEmailVerificationForUser(params: {
  userId: number;
  email: string;
  name?: string | null;
}) {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  console.log("=== EMAIL VERIFICATION ===");
  console.log("userId:", params.userId);
  console.log("email:", params.email);
  console.log("token gerado:", token);
  console.log("expiresAt:", expiresAt);

  const updatedUser = await setEmailVerificationToken(
    params.userId,
    token,
    expiresAt
  );

  console.log("usuário após salvar token:", {
    id: updatedUser.id,
    email: updatedUser.email,
    emailVerified: updatedUser.emailVerified,
    emailVerificationToken: updatedUser.emailVerificationToken,
    emailVerificationExpiresAt: updatedUser.emailVerificationExpiresAt,
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;

  console.log("verificationUrl:", verificationUrl);

  await sendEmailVerification({
    to: params.email,
    userName: params.name,
    verificationUrl,
  });
}

export async function verifyEmailToken(token: string) {
  console.log("TOKEN RECEBIDO PARA VALIDAR:", token);

  const user = await findUserByEmailVerificationToken(token);

  console.log("USUÁRIO ENCONTRADO PELO TOKEN:", user);

  if (!user) {
    throw new AppError("Token de verificação inválido", 404);
  }

  if (!user.emailVerificationExpiresAt) {
    throw new AppError("Token de verificação inválido", 400);
  }

  if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
    throw new AppError("Token de verificação expirado", 400);
  }

  await confirmUserEmail(user.id);

  return {
    message: "E-mail confirmado com sucesso",
  };
}