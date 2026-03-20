import { Request, Response, NextFunction } from "express";
import { loginService } from "../services/authService";
import {
  forgotPasswordService,
  resetPasswordService,
} from "../services/passwordResetService";
import { verifyEmailService } from "../services/emailVerificationService";



export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    res.send(result);
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

export async function verifyEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;

    await verifyEmailService(token);

    // Redireciona pro frontend (melhor UX)
    res.redirect(`${process.env.FRONTEND_URL}/email-confirmed`);
  } catch (error) {
    next(error);
  }
}