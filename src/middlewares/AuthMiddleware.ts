import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv-safe";
import { apiResponse } from "../utils/ApiResponseUtil"; // pastikan path benar

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

// Token middleware
const verifyToken = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      apiResponse.unauthorized(res, "Authorization header tidak ditemukan");
      return;
    }

    const tokenParts = authHeader.split(",");
    const lastTokenPart = tokenParts[tokenParts.length - 1].trim();
    const token = lastTokenPart.replace(/^Bearer\s+/i, '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string") {
      apiResponse.forbidden(res, "Format token tidak valid");
      return;
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    apiResponse.error(res, "Token tidak valid", 403, {
      type: error.name,
      detail: error.message,
    });
    return;
  }
};


export default verifyToken;
