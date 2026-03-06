import { Request, Response } from "express";
import { loginService } from "../services/authService";

export async function login(req: Request, res: Response) {

 const { email, password } = req.body;

 try {

  const token = await loginService(email, password);

  res.send({ token });

 } catch (error) {

  res.status(401).send({ error: "Invalid credentials" });

 }
}