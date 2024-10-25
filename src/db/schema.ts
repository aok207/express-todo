import mongoose from "mongoose";
import { ITodo, IUser } from "../types";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("users", userSchema);

// Todo Model
const todoSchema = new mongoose.Schema<ITodo>(
  {
    task: { type: String, required: true },
    isCompleted: { type: Boolean, required: true, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model<ITodo>("todos", todoSchema);
