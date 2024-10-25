import { Types } from "mongoose";
import { Express } from "express-serve-static-core";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodo {
  _id: Types.ObjectId;
  task: string;
  userId: Types.ObjectId;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  _id: Types.ObjectId;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserData | null;
  }
}

export type JwtPayload = {
  _id?: mongoose.Types.ObjectId;
  email?: string;
};
