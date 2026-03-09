import * as folderRepository from "../repositories/folderRepository";
import { AppError } from "../errors/AppError";
import { deletePrivateFile } from "./r2Service";

export function createFolderService(name: string, userId: number) {
  return folderRepository.createFolder(name, userId);
}

export function getFoldersService(userId: number) {
  return folderRepository.getFoldersByUserId(userId);
}

export function getFolderListService(userId: number) {
  return folderRepository.getFolderListByUserId(userId);
}

export async function getOwnedFolderOrFail(folderId: number, userId: number) {
  const folder = await folderRepository.getFolderById(folderId);

  if (!folder) {
    throw new AppError("Folder not found", 404);
  }

  if (folder.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  return folder;
}

export async function updateFolderService(
  folderId: number,
  userId: number,
  name: string
) {
  await getOwnedFolderOrFail(folderId, userId);

  return folderRepository.updateFolderName(folderId, name);
}

export async function deleteFolderService(folderId: number, userId: number) {
  const folder = await getOwnedFolderOrFail(folderId, userId);

  for (const file of folder.files) {
    await deletePrivateFile(file.storageKey);
  }

  await folderRepository.deleteFilesByFolderId(folderId);
  await folderRepository.deleteFolderById(folderId);
}