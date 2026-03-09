import * as filesRepository from "../repositories/filesRepository";
import { getOwnedFolderOrFail } from "./folderService";
import { AppError } from "../errors/AppError";
import {
  deletePrivateFile,
  generatePrivateFileUrl,
  uploadPrivateFile,
} from "./r2Service";
import { getUserStorageUsage, getStorageLimit } from "./storageService";
import { findUserById } from "../repositories/userRepository";

export async function uploadFile(
  file: Express.Multer.File,
  folderId: number,
  userId: number
) {
  await getOwnedFolderOrFail(folderId, userId);

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const usedStorage = await getUserStorageUsage(userId);
  const storageLimit = getStorageLimit(user.plan);

  if (usedStorage + file.size > storageLimit) {
    throw new AppError("Limite de armazenamento do plano atingido", 400);
  }

  const uploaded = await uploadPrivateFile(
    file.buffer,
    file.originalname,
    file.mimetype,
    userId,
    folderId
  );

  return filesRepository.createFile({
    name: file.originalname,
    url: null,
    storageKey: uploaded.key,
    size: file.size,
    folderId,
  });
}

export async function getFilesByFolder(folderId: number, userId: number) {
  await getOwnedFolderOrFail(folderId, userId);

  return filesRepository.findFilesByFolder(folderId);
}

export async function deleteFile(id: number, userId: number) {
  const file = await filesRepository.getFileById(id);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.folder.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await deletePrivateFile(file.storageKey);

  await filesRepository.deleteFileById(id);
}

export async function getFileDownloadUrl(id: number, userId: number) {
  const file = await filesRepository.getFileById(id);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.folder.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  return generatePrivateFileUrl(file.storageKey);
}