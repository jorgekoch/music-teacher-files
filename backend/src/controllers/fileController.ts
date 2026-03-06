import { Request, Response } from "express";
import { createFile, getFiles } from "../repositories/fileRepository";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function uploadFile(req: MulterRequest, res: Response) {

 const file = req.file;

 if (!file) return res.sendStatus(400);

 const url = `files/${file.originalname}`;

 await createFile(file.originalname, url);

 res.sendStatus(201);
}

export async function listFiles(req: Request, res: Response) {

 const files = await getFiles();

 res.send(files);
}