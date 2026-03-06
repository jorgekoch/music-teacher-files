import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repositories/userRepository";

export async function loginService(email: string, password: string) {

 const user = await findUserByEmail(email);

 if (!user) {
  throw new Error("Invalid credentials");
 }

 const passwordValid = await bcrypt.compare(password, user.password);

 if (!passwordValid) {
  throw new Error("Invalid credentials");
 }

 const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET as string,
  { expiresIn: "1d" }
 );

 return token;
}