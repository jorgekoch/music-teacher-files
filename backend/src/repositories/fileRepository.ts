import prisma from "../database/prisma";

export async function createFile(name: string, url: string) {
  return prisma.file.create({
    data: { name, url }
  });
}

export async function getFiles() {
  return prisma.file.findMany({
    orderBy: { createdAt: "desc" }
  });
}