import { Request, Response, NextFunction } from "express";
import { verifyEmailToken } from "../services/emailVerificationService";

export async function confirmEmailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.params.token;

    const result = await verifyEmailToken(token);

    res.send(result);
  } catch (error) {
    next(error);
  }
}