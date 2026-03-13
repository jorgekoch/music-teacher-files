import { api } from "./api";

export type FolderShareUser = {
  id: number;
  name: string;
  email: string;
};

export type FolderShareItem = {
  id: number;
  role: "viewer" | "editor";
  createdAt: string;
  user: FolderShareUser;
};

export type SharedFolderItem = {
  shareId: number;
  role: "viewer" | "editor";
  folder: {
    id: number;
    name: string;
    createdAt: string;
  };
  owner: {
    id: number;
    name: string;
    email: string;
  };
};

type CreateFolderShareResponse = {
  id: number;
  folderId: number;
  folderName: string;
  sharedWithUser: {
    id: number;
    name: string;
    email: string;
  };
  role: "viewer" | "editor";
  createdAt: string;
};

export async function shareFolder(folderId: number, email: string) {
  const response = await api.post<CreateFolderShareResponse>("/folder-shares", {
    folderId,
    email,
  });

  return response.data;
}

export async function getFolderShares(folderId: number) {
  const response = await api.get<FolderShareItem[]>(
    `/folder-shares/folder/${folderId}`
  );

  return response.data;
}

export async function getSharedFolders() {
  const response = await api.get<SharedFolderItem[]>(
    "/folder-shares/shared-with-me"
  );

  return response.data;
}

export async function removeFolderShare(shareId: number) {
  const response = await api.delete<{ message: string }>(
    `/folder-shares/${shareId}`
  );

  return response.data;
}