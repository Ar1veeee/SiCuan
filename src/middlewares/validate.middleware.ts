import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { apiResponse } from "../utils/apiResponse.util";

// Middleware untuk validasi request body menggunakan Zod
export const validate = (schema: ZodSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        req.body = schema.parse(req.body)
        next()
    } catch (error: any) {
        apiResponse.badRequest(res, error.errors[0].message)
    }
}