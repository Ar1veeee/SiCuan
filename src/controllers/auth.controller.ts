import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import PasswordResetModel from "../models/passwordReset.model";
import { 
  registerService, 
  loginService, 
  sendOtpService, 
  verifyOtpService, 
  resetPasswordService,
  refreshTokenService
} from "../services/AuthService";

/**
 * Controller untuk mendaftar pengguna baru
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password, nama_usaha } = req.body;
    const userData = await registerService(username, email, password, nama_usaha);
    apiResponse.created(res, userData);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk login pengguna
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const loginResult = await loginService(email, password);
    
    // Set refresh token cookie
    res.cookie("refreshToken", loginResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    const { refreshToken, ...responseData } = loginResult;
    
    apiResponse.success(res, responseData);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk refresh token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    
    if (!refreshTokenCookie) {
      apiResponse.badRequest(res, "Refresh Token Required");
      return;
    }
    
    const result = await refreshTokenService(refreshTokenCookie);
    
    // Update cookie if needed
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }
    
    apiResponse.success(res, result.data, "Token Updated");
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengirim OTP
 */
export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await sendOtpService(email);
    apiResponse.created(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk memverifikasi OTP
 */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { otp } = req.body;
    const result = await verifyOtpService(otp);
    apiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mereset password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const otpEntry = req.otpEntry;
    const { newPassword, confirmPassword } = req.body;

    const result = await resetPasswordService(otpEntry.userId, newPassword);

    apiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};