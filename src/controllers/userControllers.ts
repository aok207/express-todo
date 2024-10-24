import { Request, Response } from "express";
import { hashPassword, setJwtCookie } from "../lib/utils";
import { User } from "../db/schema";
import bcrypt from "bcrypt";

// auth
export async function signUpController(req: Request, res: Response) {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please fill in every field!");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match!");
  }

  // 1. find if user or email exists
  const usernameExists = await User.findOne({ username });

  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists!");
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    res.status(400);
    throw new Error("There's already an account assosiated with this email!");
  }

  // 2. Create user
  const hashedPassword = await hashPassword(password);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  // 3. Set cookie
  setJwtCookie(res, { _id: user._id, email: user.email });

  res.status(201).json({ message: "User registered successfully!" });
}

export async function logInController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in every field!");
  }

  // find the user
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Incorrect email or password!");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Incorrect email or password!");
  }

  setJwtCookie(res, { _id: user._id, email: user.email });

  res.status(200).json({ message: "Logged in successfully!" });
}

export async function logOutController(req: Request, res: Response) {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logged out successfully!" });
}

// profile
export async function getAccount(req: Request, res: Response) {
  const user = await User.findById(req.user?._id, {
    password: 0,
    _id: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });

  res.status(200).json({ user });
}

export async function updateAccount(req: Request, res: Response) {
  // get the details user submitted
  let { email, username } = req.body;

  // check if username and email exists
  const [usernameExists, emailExists] = await Promise.all([
    User.findOne({ username }),
    User.findOne({ email }),
  ]);

  if (usernameExists && username !== req.user?.username) {
    return res.status(400).json({
      error: "Username is already taken!",
    });
  }

  if (emailExists && email !== req.user?.email) {
    return res.status(400).json({
      error: "Email is already in use!",
    });
  }

  // Update details
  console.log(username);
  const user = await User.findById(req.user?._id);
  user!.username = username || req.user?.username;
  user!.email = email || req.user?.email;

  await user?.save();

  const updatedUser = await User.findById(user?._id, {
    _id: 0,
    password: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });

  res.status(200).json({
    message: "Profile updated successfully!",
    data: updatedUser,
  });
}

export async function deleteAccount(req: Request, res: Response) {
  if (!req.user?.email) {
    res.status(403);
    throw new Error("You are not allowed to delete this account!");
  }

  const user = await User.findOne({ email: req.user.email });

  await user?.deleteOne();

  res.clearCookie("access_token");

  res.status(204).json({ message: "Account deleted successfully!" });
}
