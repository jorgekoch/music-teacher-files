import { api } from "./api";
import type { StorageInfo } from "../components/StorageUsage";

export async function getStorageInfo(): Promise<StorageInfo> {
  const response = await api.get<StorageInfo>("/storage");
  return response.data;
}