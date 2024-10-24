import { Request, Response } from "express";

export function signUpController(req: Request, res: Response) {
  res.send("Hello from signup");
}
