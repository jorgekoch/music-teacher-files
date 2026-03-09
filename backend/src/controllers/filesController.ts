import { NextFunction, Request, Response } from "express";
import * as filesService from "../services/filesService";
import { AppError } from "../errors/AppError";

export async function uploadFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const file = req.file;
    const { folderId } = req.body;
    const userId = req.userId!;

    if (!file) {
      throw new AppError("File not provided", 400);
    }

    const savedFile = await filesService.uploadFile(
      file,
      Number(folderId),
      userId
    );

    res.status(201).send(savedFile);
  } catch (error) {
    next(error);
  }
}

export async function listFiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { folderId } = req.params;
    const userId = req.userId!;

    const files = await filesService.getFilesByFolder(Number(folderId), userId);

    res.send(files);
  } catch (error) {
    next(error);
  }
}

export async function deleteFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    await filesService.deleteFile(Number(id), userId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function getFileDownloadUrl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const url = await filesService.getFileDownloadUrl(Number(id), userId);

    res.send({ url });
  } catch (error) {
    next(error);
  }
}