import prisma from "../database/prisma";

type CreateFileData = {
  name: string;
  url?: string | null;
  storageKey: string;
  size?: number | null;
  folderId: number;
};

export function createFile(data: CreateFileData) {
  return prisma.file.create({
    data: {
      name: data.name,
      url: data.url ?? null,
      storageKey: data.storageKey,
      size: data.size ?? null,
      folderId: data.folderId,
    },
  });
}

export function findFilesByFolder(folderId: number) {
  return prisma.file.findMany({
    where: { folderId },
    orderBy: { createdAt: "desc" },
  });
}

export function findFileByNameInFolder(name: string, folderId: number) {
  return prisma.file.findFirst({
    where: {
      name,
      folderId,
    },
  });
}

export function getFileById(id: number) {
  return prisma.file.findUnique({
    where: { id },
    include: {
      folder: true,
    },
  });
}

export function updateFileName(id: number, name: string) {
  return prisma.file.update({
    where: { id },
    data: { name },
  });
}

export function moveFileToFolder(id: number, folderId: number) {
  return prisma.file.update({
    where: { id },
    data: { folderId },
  });
}

export function deleteFileById(id: number) {
  return prisma.file.delete({
    where: { id },
  });
}

export function getUserFiles(userId: number) {
  return prisma.file.findMany({
    where: {
      folder: {
        userId,
      },
    },
  });
}