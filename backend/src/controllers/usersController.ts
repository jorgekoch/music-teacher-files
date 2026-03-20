import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser } from "../repositories/userRepository";
import { AppError } from "../errors/AppError";
import { acceptPendingFolderInvitesForUser } from "../services/folderShareService";
import { generateEmailVerificationForUser } from "../services/emailVerificationService";

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, hashedPassword, name);

    console.log("USUARIO CRIADO", user.id, user.email)

    await acceptPendingFolderInvitesForUser(user.id, user.email);

    console.log("GERANDO TOKEN DE VERIFICAÇÃO...")

    await generateEmailVerificationForUser({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    res.status(201).send({
      message:
        "Cadastro criado com sucesso. Enviamos um link de confirmação para o seu e-mail.",
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return next(new AppError("Email already in use", 409));
    }

    next(error);
  }
}