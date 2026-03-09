import { NextFunction, Request, Response } from "express";
import {
  getProfileService,
  updateAvatarService,
  updatePasswordService,
  updateProfileService,
} from "../services/profileService";
import { AppError } from "../errors/AppError";
import { uploadPublicFile } from "../services/r2Service";

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const profile = await getProfileService(userId);
    res.send(profile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const { name } = req.body;
    const profile = await updateProfileService(userId, name);
    res.send(profile);
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body;
    await updatePasswordService(userId, currentPassword, newPassword);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function updateAvatar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const file = req.file;

    if (!file) {
      throw new AppError("File not provided", 400);
    }

    const uploaded = await uploadPublicFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      "avatars"
    );

    const profile = await updateAvatarService(userId, uploaded.url);

    res.send(profile);
  } catch (error) {
    next(error);
  }
}