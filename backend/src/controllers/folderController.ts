import { Request, Response } from "express";
import { createFolderService, getFoldersService } from "../services/folderService";

export async function createFolder(req: Request, res: Response) {

  const { name } = req.body;

  const folder = await createFolderService(name);

  res.status(201).send(folder);
}

export async function getFolders(req: Request, res: Response) {

  const folders = await getFoldersService();

  res.send(folders);
}