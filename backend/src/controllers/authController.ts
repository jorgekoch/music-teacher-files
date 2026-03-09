import { Request, Response, NextFunction } from "express";
import { loginService } from "../services/authService";
import {
  forgotPasswordService,
  resetPasswordService,
} from "../services/passwordResetService";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const token = await loginService(email, password);

    res.send({ token });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    await forgotPasswordService(email);

    res.send({
      message:
        "Se existir uma conta com esse e-mail, enviaremos um link de recuperação.",
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token, password } = req.body;

    await resetPasswordService(token, password);

    res.send({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    next(error);
  }
}