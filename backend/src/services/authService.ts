import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repositories/userRepository";
import { AppError } from "../errors/AppError";
import { acceptPendingFolderInvitesForUser } from "./folderShareService";

export async function loginService(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.emailVerified) {
    throw new AppError("Confirme seu e-mail antes de entrar na conta", 403);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  await acceptPendingFolderInvitesForUser(user.id, user.email);

  const token = jwt.sign({ userId: user.id }, jwtSecret, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      plan: user.plan,
      createdAt: user.createdAt,
    },
  };
}