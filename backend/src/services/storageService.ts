import { getUserFiles } from "../repositories/filesRepository";

export const FREE_STORAGE_LIMIT = 500 * 1024 * 1024; // 500 MB
export const PRO_STORAGE_LIMIT = 20 * 1024 * 1024 * 1024; // 20 GB

export async function getUserStorageUsage(userId: number) {
  const files = await getUserFiles(userId);

  const total = files.reduce((sum, file) => {
    return sum + (file.size ?? 0);
  }, 0);

  return total;
}

export function getStorageLimit(plan: string) {
  if (plan === "PRO") {
    return PRO_STORAGE_LIMIT;
  }

  return FREE_STORAGE_LIMIT;
}