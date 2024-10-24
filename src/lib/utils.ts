import bcrypt from "bcrypt";
import { JwtPayload, UserData } from "../types";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "../db/schema";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export function createAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: "15 days",
  });
}

export async function verifyAccessToken(
  token: string
): Promise<false | UserData> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;

  if (!decoded) {
    return false;
  }

  const user = await User.findById(decoded._id, { password: 0 });

  if (!user) {
    return false;
  }

  return user;
}

export function setJwtCookie(res: Response, payload: JwtPayload) {
  const token = createAccessToken(payload);

  res.cookie("access_token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
