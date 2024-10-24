import { Router } from "express";
import {
  signUpController,
  logOutController,
  logInController,
  deleteAccount,
  getAccount,
  updateAccount,
} from "../controllers/userControllers";
import asyncHandler from "../lib/asyncHandler";
import { authOnly, guestOnly } from "../middlewares/authMiddleware";

const router = Router();

router.post("/sign-up", guestOnly, asyncHandler(signUpController));
router.post("/log-in", guestOnly, asyncHandler(logInController));
router.post("/logout", authOnly, asyncHandler(logOutController));

// profile
router
  .route("/profile")
  .all(authOnly)
  .get(asyncHandler(getAccount))
  .patch(asyncHandler(updateAccount))
  .delete(asyncHandler(deleteAccount));

export default router;
