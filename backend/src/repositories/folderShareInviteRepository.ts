import prisma from "../database/prisma";

export function createFolderShareInvite(data: {
  token: string;
  folderId: number;
  ownerUserId: number;
  invitedEmail: string;
  role: string;
  expiresAt?: Date | null;
}) {
  return prisma.folderShareInvite.create({
    data,
    include: {
      folder: true,
      ownerUser: true,
    },
  });
}

export function findFolderShareInviteByToken(token: string) {
  return prisma.folderShareInvite.findUnique({
    where: { token },
    include: {
      folder: true,
      ownerUser: true,
    },
  });
}

export function findPendingFolderShareInviteByEmail(params: {
  folderId: number;
  invitedEmail: string;
}) {
  return prisma.folderShareInvite.findFirst({
    where: {
      folderId: params.folderId,
      invitedEmail: params.invitedEmail,
      acceptedAt: null,
    },
  });
}

export function markFolderShareInviteAsAccepted(id: number) {
  return prisma.folderShareInvite.update({
    where: { id },
    data: {
      acceptedAt: new Date(),
    },
  });
}

export function findPendingInvitesByEmail(email: string) {
  return prisma.folderShareInvite.findMany({
    where: {
      invitedEmail: email,
      acceptedAt: null,
    },
    include: {
      folder: true,
      ownerUser: true,
    },
  });
}