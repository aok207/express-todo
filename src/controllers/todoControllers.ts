import { Request, Response } from "express";
import { Todo } from "../db/schema";

export async function getAllTodos(req: Request, res: Response) {
  const todos = await Todo.aggregate([
    {
      $match: {
        userId: req.user?._id,
      },
    },

    {
      $lookup: {
        localField: "userId",
        foreignField: "_id",
        from: "users",
        as: "user",
      },
    },

    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },

    {
      $project: {
        __v: 0,
        updatedAt: 0,
        userId: 0,
        "user.password": 0,
        "user.__v": 0,
        "user._id": 0,
        "user.createdAt": 0,
        "user.updatedAt": 0,
      },
    },
  ]);

  res.status(200).json({ todos });
}

export async function createTodo(req: Request, res: Response) {
  const { task } = req.body;

  if (!task) {
    res.status(400);
    throw new Error("Please enter a task!");
  }

  const todo = new Todo();
  todo.task = task;
  todo.userId = req.user!._id;
  await todo.save();

  res.status(201).json({
    todo: { _id: todo._id, task: todo.task, isCompleted: todo.isCompleted },
  });
}

export async function updateTodo(req: Request, res: Response) {
  const { id } = req.params;

  const todo = await Todo.findById(id);

  if (!todo || todo.userId.toString() !== req.user?._id.toString()) {
    res.status(404);
    throw new Error("Todo not found!");
  }

  const { task, isCompleted } = req.body;

  // If the user give a new task use it otherwise use the original task
  todo.task = task || todo.task;
  todo.isCompleted = isCompleted === undefined ? todo.isCompleted : isCompleted;

  await todo.save();

  const updatedTodo = await Todo.findById(id, {
    __v: 0,
    updatedAt: 0,
    userId: 0,
  });

  res.status(200).json({ message: "Todo updated", todo: updatedTodo });
}

export async function deleteTodo(req: Request, res: Response) {
  const todo = await Todo.findById(req.params.id);

  // if the owner id of the todo doesn't match the current logged in user id, return error
  if (!todo || todo.userId.toString() !== req.user?._id.toString()) {
    res.status(404);
    throw new Error("Todo not found!");
  }

  await todo.deleteOne();

  res.sendStatus(204);
}
