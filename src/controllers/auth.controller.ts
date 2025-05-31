import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import { 
  registerService, 
  loginService, 
  sendOtpService, 
  verifyOtpService, 
  resetPasswordService,
  refreshTokenService
} from "../services/AuthService";
import { validatePassowrd } from "../validators/PasswordValidator";
import { handleAuthError } from "../middlewares/auth.middleware";

/**
 * Controller untuk mendaftar pengguna baru
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, confirmPassword, nama_usaha } = req.body;
    const userData = await registerService(username, email, password, nama_usaha);
    apiResponse.created(res, userData);
  } catch (error) {
    handleAuthError(error, res);
  }
};

/**
 * Controller untuk login pengguna
 */
export const login = async (req: Request, res: Response): Promise<void> => {
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
    
    // Remove refreshToken from response data
    const { refreshToken, ...responseData } = loginResult;
    
    apiResponse.success(res, responseData);
  } catch (error) {
    handleAuthError(error, res);
  }
};

/**
 * Controller untuk refresh token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
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
    handleAuthError(error, res);
  }
};

/**
 * Controller untuk mengirim OTP
 */
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await sendOtpService(email);
    apiResponse.created(res, result);
  } catch (error) {
    handleAuthError(error, res);
  }
};

/**
 * Controller untuk memverifikasi OTP
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp } = req.body;
    const result = await verifyOtpService(otp);
    apiResponse.success(res, result);
  } catch (error) {
    handleAuthError(error, res);
  }
};

/**
 * Controller untuk mereset password
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;
    
    const validateMessage = validatePassowrd(newPassword, confirmPassword);
    if (validateMessage) {
      apiResponse.badRequest(res, validateMessage);
      return;
    }
    
    const updated = await resetPasswordService(otp, newPassword);
    apiResponse.success(res, updated);
  } catch (error) {
    handleAuthError(error, res);
  }
};