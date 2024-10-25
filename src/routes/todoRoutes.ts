import { Router } from "express";
import { authOnly } from "../middlewares/authMiddleware";
import { getAllTodos, createTodo, updateTodo, deleteTodo } from "../controllers/todoControllers";
import asyncHandler from "../lib/asyncHandler";

const router = Router();

router
  .route("/")
  .all(authOnly)
  .get(asyncHandler(getAllTodos))
  .post(asyncHandler(createTodo));

router
  .route("/:id")
  .all(authOnly)
  .patch(asyncHandler(updateTodo))
  .delete(asyncHandler(deleteTodo));

export default router;
