import { Request, Response } from "express";
import { passwordValidation, emailValidation } from "../validators/UserValidator";
import { apiResponse } from "../utils/apiResponse.util";
import { registerService, loginService } from "../services/AuthService";
import { sendOtpService, verifyOtpService, resetPasswordService } from "../services/AuthService";
import User from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv-safe";
import { validatePassowrd } from "../validators/PasswordValidator";
import { ApiError } from "../exceptions/ApiError";
dotenv.config();

// Controller untuk mendaftar pengguna baru
export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { username, email, password, confirmPassword, nama_usaha } = req.body;

    if (!passwordValidation.isValidPassword(password)) {
        apiResponse.badRequest(
            res,
            passwordValidation.getValidationMessage(password, confirmPassword),
        );
        return
    }

    if (!passwordValidation.isPasswordMatch(password, confirmPassword)) {
        apiResponse.badRequest(
            res,
            passwordValidation.getValidationMessage(password, confirmPassword),
        );
        return
    }

    if (!emailValidation.isValidEmail(email)) {
        apiResponse.badRequest(
            res,
            emailValidation.getValidationMessage(email),
        );
        return
    }

    try {
        const userData = await registerService(username, email, confirmPassword, nama_usaha)
        apiResponse.created(res, userData)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
};

// Controller untuk login pengguna
export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email, password } = req.body;
    try {
        const loginResult = await loginService(email, password)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        apiResponse.success(res, loginResult);
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
};


// Controller untuk refresh token
export const refreshToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token) {
        apiResponse.badRequest(res, "Refresh Token Required")
        return
    }

    try {
        if (!process.env.JWT_SECRET) throw new Error("JWT Secret is not defined")
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET) as JwtPayload;

        if (!decoded || !decoded.id) {
            apiResponse.badRequest(res, "Invalid or Expired Token")
            return
        }

        const user = await User.findUserById(decoded.id);
        if (!user) {
            apiResponse.badRequest(res, "User Not Found");
            return
        }

        const userId = typeof user.id === "string" ? Number(user.id) : user.id;

        if (!userId) {
            apiResponse.badRequest(res, "Invalid User ID")
            return
        }

        const authRecord = await User.findAuthByUserId(userId);
        if (!authRecord || authRecord.refreshToken !== refresh_token) {
            apiResponse.badRequest(res, "Invalid Refresh Token")
            return
        }

        const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        await User.refreshToken(refresh_token, newAccessToken);

        if (newRefreshToken !== refresh_token) {
            await User.createOrUpdateAuthToken(userId, newAccessToken, newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }

        apiResponse.success(res, {
            loginResult: {
                userID: user.id,
                username: user.name,
                access_token: newAccessToken,
            },
        }, "Token Updated");
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error === 'TokenExpiredError') {
            apiResponse.badRequest(res, "Refresh Token Expired");
        }
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
};

// Controller untuk mengirim OTP
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    try {
        const result = await sendOtpService(email);
        apiResponse.created(res, result)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
};

// Controller untuk memverifikasi OTP
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { otp } = req.body;
    try {
        const result = await verifyOtpService(otp);
        apiResponse.success(res, result)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
};

// Controller untuk mereset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { otp, newPassword, confirmPassword } = req.body;
    const validateMessage = validatePassowrd(newPassword, confirmPassword)
    if (validateMessage) {
        apiResponse.badRequest(res, validateMessage)
        return
    }
    try {
        const updated = await resetPasswordService(otp, newPassword);
        apiResponse.success(res, updated)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
};