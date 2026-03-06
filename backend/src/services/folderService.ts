import * as folderRepository from "../repositories/folderRepository";

export function createFolderService(name: string) {
  return folderRepository.createFolder(name);
}

export function getFoldersService() {
  return folderRepository.getFolders();
}