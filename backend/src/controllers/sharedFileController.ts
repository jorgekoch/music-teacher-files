import { NextFunction, Request, Response } from "express";
import {
  accessSharedFile,
  createSharedFileLink,
  getSharedFileDetails,
} from "../services/sharedFileService";

export async function createShareLink(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const fileId = Number(req.params.id);

    const result = await createSharedFileLink(fileId, userId);

    res.send(result);
  } catch (error) {
    next(error);
  }
}

export async function openSharedFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = String(req.params.token);

    const fileUrl = await accessSharedFile(token);

    res.redirect(fileUrl);
  } catch (error) {
    next(error);
  }
}

export async function getSharedFileInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = String(req.params.token);

    const result = await getSharedFileDetails(token);

    res.send(result);
  } catch (error) {
    next(error);
  }
}