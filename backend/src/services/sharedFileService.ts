import crypto from "crypto";
import { AppError } from "../errors/AppError";
import * as filesRepository from "../repositories/filesRepository";
import * as sharedFileRepository from "../repositories/sharedFileRepository";
import { generatePrivateFileUrl } from "./r2Service";

function getValidSharedFileOrThrow(sharedFile: any) {
  if (!sharedFile) {
    throw new AppError("Link de compartilhamento inválido", 404);
  }

  if (sharedFile.expiresAt && sharedFile.expiresAt.getTime() < Date.now()) {
    throw new AppError("Link de compartilhamento expirado", 400);
  }

  return sharedFile;
}

function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
}

function getMimeTypeFromFileName(fileName: string) {
  const extension = getFileExtension(fileName);

  const mimeTypesByExtension: Record<string, string> = {
    pdf: "application/pdf",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  return mimeTypesByExtension[extension] || "application/octet-stream";
}

export async function createSharedFileLink(fileId: number, userId: number) {
  const file = await filesRepository.getFileById(fileId);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.folder.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const existingSharedFile =
    await sharedFileRepository.findSharedFileByFileId(fileId);

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (existingSharedFile) {
    return {
      shareUrl: `${frontendUrl}/shared/${existingSharedFile.token}`,
    };
  }

  const token = crypto.randomBytes(24).toString("hex");

  const sharedFile = await sharedFileRepository.createSharedFile(
    fileId,
    token,
    null
  );

  return {
    shareUrl: `${frontendUrl}/shared/${sharedFile.token}`,
  };
}

export async function accessSharedFile(token: string) {
  const sharedFile = await sharedFileRepository.findSharedFileByToken(token);
  const validSharedFile = getValidSharedFileOrThrow(sharedFile);

  return generatePrivateFileUrl(validSharedFile.file.storageKey);
}

export async function getSharedFileDetails(token: string) {
  const sharedFile = await sharedFileRepository.findSharedFileByToken(token);
  const validSharedFile = getValidSharedFileOrThrow(sharedFile);

  const file = validSharedFile.file;
  const temporaryUrl = await generatePrivateFileUrl(file.storageKey);

  return {
    token: validSharedFile.token,
    name: file.name,
    size: file.size,
    createdAt: file.createdAt,
    mimeType: getMimeTypeFromFileName(file.name),
    fileUrl: temporaryUrl,
  };
}