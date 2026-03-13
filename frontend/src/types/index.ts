export type LoginData = {
  email: string;
  password: string;
};

export type Folder = {
  id: number;
  name: string;
  ownerName?: string;
  shareCount?: number;
};

export type FileItem = {
  id: number;
  name: string;
  url: string | null;
  storageKey?: string;
  size?: number | null;
  folderId: number;
  createdAt: string;
};

export type Profile = {
  id: number;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  plan: "FREE" | "PRO";
  storageUsed: number;
  storageLimit: number;
};