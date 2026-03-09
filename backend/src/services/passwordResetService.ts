import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  clearResetPasswordToken,
  findUserByEmail,
  findUserByResetPasswordToken,
  saveResetPasswordToken,
  updateUserPassword,
} from "../repositories/userRepository";
import { sendPasswordResetEmail } from "./emailService";
import { AppError } from "../errors/AppError";

export async function forgotPasswordService(email: string) {
  const user = await findUserByEmail(email);

  // Resposta neutra por segurança
  if (!user) {
    console.log(`Solicitação de recuperação para e-mail inexistente: ${email}`);
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await saveResetPasswordToken(user.id, token, expiresAt);

  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  console.log(`Token de reset gerado para ${email}`);

  await sendPasswordResetEmail({
    to: user.email,
    resetLink,
  });
}

export async function resetPasswordService(
  token: string,
  newPassword: string
) {
  const user = await findUserByResetPasswordToken(token);

  if (!user) {
    throw new AppError("Token inválido ou expirado", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await updateUserPassword(user.id, hashedPassword);
  await clearResetPasswordToken(user.id);
}