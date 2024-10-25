import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/utils";
import { UserData } from "../types";

export async function authOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies["access_token"];

    if (!token) {
      res.status(401);
      next(new Error("You are not logged in!"));
    }

    let decoded = await verifyAccessToken(token);

    if (!decoded) {
      res.status(403);
      next(new Error("Incorrect token!"));
    }

    decoded = decoded as UserData;

    req.user = decoded;

    next();
  } catch (err: any) {
    next(err);
  }
}

export function guestOnly(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["access_token"];
  if (token) {
    res.status(403);
    next(new Error("You are already logged in!"));
  }

  next();
}
