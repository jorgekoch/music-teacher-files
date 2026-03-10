import * as filesRepository from "../repositories/filesRepository";
import { getOwnedFolderOrFail } from "./folderService";
import { AppError } from "../errors/AppError";
import {
  buildPrivateStorageKey,
  createPrivateUploadUrl,
  deletePrivateFile,
  generatePrivateFileUrl,
} from "./r2Service";
import { getUserStorageUsage, getStorageLimit } from "./storageService";
import { findUserById } from "../repositories/userRepository";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

type CreateUploadUrlInput = {
  folderId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
};

type CompleteUploadInput = {
  folderId: number;
  fileName: string;
  fileSize: number;
  storageKey: string;
};

export async function createUploadUrl(
  input: CreateUploadUrlInput,
  userId: number
) {
  const { folderId, fileName, fileType, fileSize } = input;

  await getOwnedFolderOrFail(folderId, userId);

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (!ALLOWED_MIME_TYPES.includes(fileType)) {
    throw new AppError("File type not allowed", 400);
  }

  const maxFileSize = 500 * 1024 * 1024;
  if (fileSize > maxFileSize) {
    throw new AppError("Arquivo excede o limite por upload", 400);
  }

  const existingFileInFolder = await filesRepository.findFileByNameInFolder(
    fileName,
    folderId
  );

  if (existingFileInFolder) {
    throw new AppError("Já existe um arquivo com esse nome nesta pasta", 400);
  }

  const usedStorage = await getUserStorageUsage(userId);
  const storageLimit = getStorageLimit(user.plan);

  if (usedStorage + fileSize > storageLimit) {
    throw new AppError("Limite de armazenamento do plano atingido", 400);
  }

  const storageKey = buildPrivateStorageKey(fileName, userId, folderId);
  const { url } = await createPrivateUploadUrl(storageKey, fileType);

  return {
    uploadUrl: url,
    storageKey,
  };
}

export async function completeUpload(
  input: CompleteUploadInput,
  userId: number
) {
  const { folderId, fileName, fileSize, storageKey } = input;

  await getOwnedFolderOrFail(folderId, userId);

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const existingFileInFolder = await filesRepository.findFileByNameInFolder(
    fileName,
    folderId
  );

  if (existingFileInFolder) {
    throw new AppError("Já existe um arquivo com esse nome nesta pasta", 400);
  }

  const usedStorage = await getUserStorageUsage(userId);
  const storageLimit = getStorageLimit(user.plan);

  if (usedStorage + fileSize > storageLimit) {
    throw new AppError("Limite de armazenamento do plano atingido", 400);
  }

  return filesRepository.createFile({
    name: fileName,
    url: null,
    storageKey,
    size: fileSize,
    folderId,
  });
}

export async function getFilesByFolder(folderId: number, userId: number) {
  await getOwnedFolderOrFail(folderId, userId);
  return filesRepository.findFilesByFolder(folderId);
}

export async function updateFileName(
  id: number,
  userId: number,
  name: string
) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new AppError("O nome do arquivo é obrigatório", 400);
  }

  const file = await filesRepository.getFileById(id);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.folder.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const existingFileInFolder = await filesRepository.findFileByNameInFolder(
    trimmedName,
    file.folderId
  );

  if (existingFileInFolder && existingFileInFolder.id !== id) {
    throw new AppError("Já existe um arquivo com esse nome nesta pasta", 400);
  }

  return filesRepository.updateFileName(id, trimmedName);
}

export async function moveFileToFolder(
  fileId: number,
  targetFolderId: number,
  userId: number
) {
  const file = await filesRepository.getFileById(fileId);

  if (!file) {
    throw new AppError("Arquivo não encontrado", 404);
  }

  if (file.folder.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const targetFolder = await getOwnedFolderOrFail(targetFolderId, userId);

  if (file.folderId === targetFolder.id) {
    throw new AppError("O arquivo já está nesta pasta", 400);
  }

  const existingFileInTargetFolder = await filesRepository.findFileByNameInFolder(
    file.name,
    targetFolderId
  );

  if (existingFileInTargetFolder) {
    throw new AppError(
      "Já existe um arquivo com esse nome na pasta de destino",
      400
    );
  }

  return filesRepository.moveFileToFolder(fileId, targetFolderId);
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