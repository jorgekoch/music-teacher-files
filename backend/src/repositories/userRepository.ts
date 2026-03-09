import prisma from "../database/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export function createUser(email: string, password: string, name: string) {
  return prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
}

export function updateUserProfile(
  id: number,
  data: { name?: string; avatarUrl?: string | null }
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export function updateUserPassword(id: number, password: string) {
  return prisma.user.update({
    where: { id },
    data: { password },
  });
}

export function saveResetPasswordToken(
  userId: number,
  token: string,
  expiresAt: Date
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken: token,
      resetPasswordExpiresAt: expiresAt,
    },
  });
}

export function findUserByResetPasswordToken(token: string) {
  return prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiresAt: {
        gt: new Date(),
      },
    },
  });
}

export function clearResetPasswordToken(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    },
  });
}