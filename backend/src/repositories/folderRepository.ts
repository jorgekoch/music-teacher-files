import prisma from "../database/prisma";

export function createFolder(name: string) {
  return prisma.folder.create({
    data: { name }
  });
}

export function getFolders() {
  return prisma.folder.findMany({
    include: {
      files: true
    }
  });
}