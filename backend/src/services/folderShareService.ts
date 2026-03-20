import { AppError } from "../errors/AppError";
import crypto from "crypto";
import { createFolderShareInvite, findFolderShareInviteByToken, findPendingInvitesByEmail, markFolderShareInviteAsAccepted } from "../repositories/folderShareInviteRepository";
import {
  createFolderShare,
  deleteFolderShare,
  findFolderById,
  findFolderShareByFolderAndUser,
  findFolderShareById,
  findSharedFoldersForUser,
  findSharesByFolderId,
  findUserByEmail,
} from "../repositories/folderShareRepository";
import { findUserById } from "../repositories/userRepository";
import { sendFolderInviteEmail, sendFolderInviteLinkEmail } from "./emailService";

export async function shareFolder(params: {
  currentUserId: number;
  folderId: number;
  email: string;
}) {
  const { currentUserId, folderId, email } = params;

  const currentUser = await findUserById(currentUserId);

  if (!currentUser) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (currentUser.plan !== "PRO") {
    throw new AppError(
      "Compartilhamento de pastas é um recurso disponível apenas no plano PRO",
      403
    );
  }

  const folder = await findFolderById(folderId);

  if (!folder) {
    throw new AppError("Pasta não encontrada", 404);
  }

  if (folder.userId !== currentUserId) {
    throw new AppError(
      "Você não tem permissão para compartilhar esta pasta",
      403
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new AppError("E-mail é obrigatório", 400);
  }

  const targetUser = await findUserByEmail(normalizedEmail);

  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  // CASO 1: usuário já existe
  if (targetUser) {
    if (targetUser.id === currentUserId) {
      throw new AppError(
        "Você não pode compartilhar uma pasta com você mesmo",
        400
      );
    }

    const existingShare = await findFolderShareByFolderAndUser(
      folderId,
      targetUser.id
    );

    if (existingShare) {
      throw new AppError(
        "Esta pasta já foi compartilhada com este usuário",
        409
      );
    }

    const share = await createFolderShare({
      folderId,
      ownerUserId: currentUserId,
      sharedWithUserId: targetUser.id,
      role: "viewer",
    });

    try {
      await sendFolderInviteEmail({
        to: targetUser.email,
        invitedUserName: targetUser.name,
        ownerName: currentUser.name,
        folderName: share.folder.name,
        loginUrl,
      });
    } catch (error) {
      console.error("Erro ao enviar email (usuário existente):", error);
    }

    return {
      message: "Pasta compartilhada com sucesso",
      shareId: share.id,
      invitedUserExists: true,
    };
  }

  // CASO 2: usuário ainda não existe
  const token = crypto.randomBytes(24).toString("hex");

  const invite = await createFolderShareInvite({
    token,
    folderId,
    ownerUserId: currentUserId,
    invitedEmail: normalizedEmail,
    role: "viewer",
    expiresAt: null,
  });

  const inviteUrl = `${process.env.FRONTEND_URL}/invite/${invite.token}`;

  try {
    await sendFolderInviteLinkEmail({
      to: normalizedEmail,
      ownerName: currentUser.name,
      folderName: folder.name,
      inviteUrl,
    });
  } catch (error) {
    console.error("Erro ao enviar convite para novo usuário:", error);
  }

  return {
    message: "Convite enviado por e-mail para o usuário",
    inviteToken: invite.token,
    invitedUserExists: false,
  };
}

export async function listFolderShares(params: {
  currentUserId: number;
  folderId: number;
}) {
  const { currentUserId, folderId } = params;

  const folder = await findFolderById(folderId);

  if (!folder) {
    throw new AppError("Pasta não encontrada", 404);
  }

  if (folder.userId !== currentUserId) {
    throw new AppError(
      "Você não tem permissão para visualizar os compartilhamentos desta pasta",
      403
    );
  }

  const shares = await findSharesByFolderId(folderId);

  return shares.map((share) => ({
    id: share.id,
    role: share.role,
    createdAt: share.createdAt,
    user: {
      id: share.sharedWithUser.id,
      name: share.sharedWithUser.name,
      email: share.sharedWithUser.email,
    },
  }));
}

export async function listSharedFolders(currentUserId: number) {
  const user = await findUserById(currentUserId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const sharedFolders = await findSharedFoldersForUser(currentUserId);

  return sharedFolders.map((share) => ({
    shareId: share.id,
    role: share.role,
    folder: {
      id: share.folder.id,
      name: share.folder.name,
      createdAt: share.folder.createdAt,
    },
    owner: {
      id: share.ownerUser.id,
      name: share.ownerUser.name,
      email: share.ownerUser.email,
    },
  }));
}

export async function removeFolderShare(params: {
  currentUserId: number;
  shareId: number;
}) {
  const { currentUserId, shareId } = params;

  const share = await findFolderShareById(shareId);

  if (!share) {
    throw new AppError("Compartilhamento não encontrado", 404);
  }

  if (share.folder.userId !== currentUserId) {
    throw new AppError(
      "Você não tem permissão para remover este compartilhamento",
      403
    );
  }

  await deleteFolderShare(shareId);

  return {
    message: "Compartilhamento removido com sucesso",
  };
}

export async function getFolderInviteByToken(token: string) {
  const invite = await findFolderShareInviteByToken(token);

  if (!invite) {
    throw new AppError("Convite não encontrado", 404);
  }

  if (invite.acceptedAt) {
    throw new AppError("Este convite já foi aceito", 400);
  }

  return {
    token: invite.token,
    folderName: invite.folder.name,
    ownerName: invite.ownerUser.name,
    invitedEmail: invite.invitedEmail,
    createdAt: invite.createdAt,
  };
}

export async function acceptFolderInvite(token: string, userId: number) {
  const invite = await findFolderShareInviteByToken(token);

  if (!invite) {
    throw new AppError("Convite não encontrado", 404);
  }

  if (invite.acceptedAt) {
    throw new AppError("Este convite já foi aceito", 400);
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (user.email.trim().toLowerCase() !== invite.invitedEmail.trim().toLowerCase()) {
    throw new AppError("Este convite pertence a outro e-mail", 403);
  }

  const existingShare = await findFolderShareByFolderAndUser(invite.folderId, user.id);

  if (!existingShare) {
    await createFolderShare({
      folderId: invite.folderId,
      ownerUserId: invite.ownerUserId,
      sharedWithUserId: user.id,
      role: invite.role,
    });
  }

  await markFolderShareInviteAsAccepted(invite.id);

  return {
    message: "Convite aceito com sucesso",
    folderId: invite.folderId,
  };
}

export async function acceptPendingFolderInvitesForUser(
  userId: number,
  email: string
) {
  const invites = await findPendingInvitesByEmail(email.trim().toLowerCase());

  for (const invite of invites) {
    const existingShare = await findFolderShareByFolderAndUser(
      invite.folderId,
      userId
    );

    if (!existingShare) {
      await createFolderShare({
        folderId: invite.folderId,
        ownerUserId: invite.ownerUserId,
        sharedWithUserId: userId,
        role: invite.role,
      });
    }

    await markFolderShareInviteAsAccepted(invite.id);
  }
}