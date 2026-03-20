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

export function findUserByStripeCustomerId(stripeCustomerId: string) {
  return prisma.user.findFirst({
    where: { stripeCustomerId },
  });
}

export function findUserByStripeSubscriptionId(stripeSubscriptionId: string) {
  return prisma.user.findFirst({
    where: { stripeSubscriptionId },
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

export function updateUserBillingData(
  id: number,
  data: {
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string | null;
    plan?: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data,
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

export function createUser(
  email: string,
  password: string,
  name: string
) {
  return prisma.user.create({
    data: {
      email,
      password,
      name,
      emailVerified: false,
    },
  });
}

export function setEmailVerificationToken(
  userId: number,
  token: string,
  expiresAt: Date
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: token,
      emailVerificationExpiresAt: expiresAt,
      emailVerified: false,
    },
  });
}

export function findUserByEmailVerificationToken(token: string) {
  return prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
    },
  });
}

export function confirmUserEmail(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
    },
  });
}