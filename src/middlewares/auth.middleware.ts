import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";
import PasswordResetModel from "../models/passwordReset.model";
import jwt from "jsonwebtoken";

/**
 * Middleware to validate token from request header
 */
const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw ApiError.unauthorized("Authorization header tidak ditemukan");
    }

    const tokenParts = authHeader.split(" ");
    const token = tokenParts[1]?.trim();

    if (!token) {
      throw ApiError.unauthorized("Token tidak ditemukan");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string") {
      throw ApiError.forbidden("Format token tidak valid");
    }

    req.user = decoded;

    if (decoded.id !== undefined) {
      req.userId = decoded.id;
      next();
    } else {
      throw ApiError.forbidden("Token tidak berisi informasi ID pengguna");
    }
  } catch (error) {
    next(error)
  };
}

/**
 * Middleware untuk memverifikasi OTP dari req.body.
 * Jika valid, lampirkan data entri OTP ke`req.otpEntry`.
 */
export const verifyAndAttachOtpEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { otp } = req.body;

    if (!otp) {
      throw ApiError.badRequest("OTP wajib diisi.");
    }

    const otpEntry = await PasswordResetModel.findValidOtp(otp);

    if (!otpEntry) {
      throw ApiError.badRequest("OTP tidak valid atau sudah kedaluwarsa.");
    }

    req.otpEntry = otpEntry;

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyToken;