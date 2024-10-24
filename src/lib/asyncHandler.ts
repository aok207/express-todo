import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (controller: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      return next(error);
    }
  };

export default asyncHandler;
