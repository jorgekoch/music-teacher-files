import { Request, Response } from "express";
import {
  acceptFolderInvite,
  getFolderInviteByToken,
  listFolderShares,
  listSharedFolders,
  removeFolderShare,
  shareFolder,
} from "../services/folderShareService";

export async function createFolderShareController(req: Request, res: Response) {
  const currentUserId = req.userId!;
  const { folderId, email } = req.body;

  const share = await shareFolder({
    currentUserId,
    folderId: Number(folderId),
    email,
  });

  return res.status(201).send(share);
}

export async function listFolderSharesController(req: Request, res: Response) {
  const currentUserId = req.userId!;
  const folderId = Number(req.params.folderId);

  const shares = await listFolderShares({
    currentUserId,
    folderId,
  });

  return res.status(200).send(shares);
}

export async function listSharedFoldersController(req: Request, res: Response) {
  const currentUserId = req.userId!;

  const sharedFolders = await listSharedFolders(currentUserId);

  return res.status(200).send(sharedFolders);
}

export async function removeFolderShareController(req: Request, res: Response) {
  const currentUserId = req.userId!;
  const shareId = Number(req.params.shareId);

  const result = await removeFolderShare({
    currentUserId,
    shareId,
  });

  return res.status(200).send(result);
}

export async function getFolderInviteByTokenController(
  req: Request,
  res: Response
) {
  const token = req.params.token;

  const invite = await getFolderInviteByToken(token);

  return res.status(200).send(invite);
}

export async function acceptFolderInviteController(
  req: Request,
  res: Response
) {
  const currentUserId = req.userId!;
  const token = req.params.token;

  const result = await acceptFolderInvite(token, currentUserId);

  return res.status(200).send(result);
}