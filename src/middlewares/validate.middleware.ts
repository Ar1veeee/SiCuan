import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ApiError } from "../exceptions/ApiError";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (req.method === "GET") {
        schema.parse(req.query);
      } else {
        schema.parse(req.body);
      }
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues
          .map((issue) => issue.message)
          .join(", ");
        next(ApiError.badRequest(errorMessages));
      } else {
        next(error);
      }
    }
  };
