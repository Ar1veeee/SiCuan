import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/apiResponse.util";
import { passwordValidation, emailValidation } from "../validators/UserValidator";
import { ApiError } from "../exceptions/ApiError";

/**
 * Middleware to validate token from request header
 */
const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      apiResponse.unauthorized(res, "Authorization header tidak ditemukan");
      return;
    }

    const tokenParts = authHeader.split(" ");
    const token = tokenParts[1]?.trim();

    if (!token) {
      apiResponse.unauthorized(res, "Token tidak ditemukan");
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string") {
      apiResponse.forbidden(res, "Format token tidak valid");
      return;
    }

    req.user = decoded;

    if (decoded.id !== undefined) {
      req.userId = typeof decoded.id === 'string' ? parseInt(decoded.id) : decoded.id;
      next();
    } else {
      apiResponse.forbidden(res, "Token tidak berisi informasi ID pengguna");
      return;
    }
  } catch (error: any) {
    console.error("Token verification error:", error);
    apiResponse.error(res, "Token tidak valid", 403, {
      type: error.name,
      detail: error.message,
    });
  }
};

/**
 * Middleware to validate registration data
 */
export const validateRegistrationData = (req: Request, res: Response, next: NextFunction): void => {
  const { password, confirmPassword, email } = req.body;

  if (!passwordValidation.isValidPassword(password)) {
    apiResponse.badRequest(
      res,
      passwordValidation.getValidationMessage(password, confirmPassword)
    );
    return;
  }

  if (!passwordValidation.isPasswordMatch(password, confirmPassword)) {
    apiResponse.badRequest(
      res,
      passwordValidation.getValidationMessage(password, confirmPassword)
    );
    return;
  }

  if (!emailValidation.isValidEmail(email)) {
    apiResponse.badRequest(
      res,
      emailValidation.getValidationMessage(email)
    );
    return;
  }

  next();
};

/**
 * Handler error global untuk controller auth
 */
export const handleAuthError = (error: unknown, res: Response): void => {
  console.error("[Auth Error]:", error);

  if (error instanceof ApiError) {
    apiResponse.error(res, error.message, error.statusCode);
  } else if (error === 'TokenExpiredError') {
    apiResponse.badRequest(res, "Token telah kedaluwarsa");
  } else {
    apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
  }
};

export default verifyToken;