import UserModel from "../models/user.model";
import PasswordResetModel from "../models/passwordReset.model";
import { ApiError } from "../exceptions/ApiError";
import { comparePassword } from "../utils/password.util";
import { generateOtp } from "../utils/generateOtp.util";
import PubSubService from "./PubSubService";
import jwt, { JwtPayload } from "jsonwebtoken";
import { validateOtp } from "../validators/ResetPasswordValidator";
import { AuthResponse, LoginResponse } from "../types/auth.type";

/**
 * Service untuk melakukan pendaftaran pengguna
 */
export const registerService = async (
    username: string,
    email: string,
    password: string,
    nama_usaha: string
): Promise<AuthResponse> => {
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
        throw new ApiError("Email sudah terdaftar", 400);
    }

    await UserModel.createUser(username, email, password, nama_usaha);
    return {
        message: "Pendaftaran berhasil"
    };
};

/**
 * Service untuk login pengguna
 */
export const loginService = async (
    email: string,
    password: string
): Promise<LoginResponse & { refreshToken: string }> => {
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
        throw new ApiError("Pengguna tidak ditemukan", 404);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError("Password salah", 400);
    }

    if (!process.env.JWT_SECRET) {
        throw new ApiError("JWT Secret tidak didefinisikan", 500);
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    const userId = user.id;
    if (!userId) {
        throw new ApiError("ID user tidak valid", 500);
    }

    await UserModel.createOrUpdateAuthToken(userId, accessToken, refreshToken);

    return {
        message: "Login berhasil",
        data: {
            userID: user.id,
            username: user.name,
            access_token: accessToken,
        },
        refreshToken: refreshToken 
    };
};

/**
 * Service untuk refresh token
 */
export const refreshTokenService = async (
    refreshTokenValue: string
): Promise<{ data: any, refreshToken?: string }> => {
    if (!process.env.JWT_SECRET) {
        throw new ApiError("JWT Secret tidak didefinisikan", 500);
    }

    const decoded = jwt.verify(refreshTokenValue, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id) {
        throw new ApiError("Token tidak valid atau kedaluwarsa", 400);
    }

    const user = await UserModel.findUserById(decoded.id);
    if (!user) {
        throw new ApiError("Pengguna tidak ditemukan", 404);
    }

    const userId = user.id;

    const authRecord = await UserModel.findAuthByUserId(userId);
    if (!authRecord || authRecord.refreshToken !== refreshTokenValue) {
        throw new ApiError("Refresh token tidak valid", 400);
    }

    const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    await UserModel.refreshToken(refreshTokenValue, newAccessToken);

    if (newRefreshToken !== refreshTokenValue) {
        await UserModel.createOrUpdateAuthToken(userId, newAccessToken, newRefreshToken);

        return {
            data: {
                userID: user.id,
                username: user.name,
                access_token: newAccessToken,
            },
            refreshToken: newRefreshToken
        };
    }

    return {
        data: {
            userID: user.id,
            username: user.name,
            access_token: newAccessToken,
        }
    };
};

/**
 * Service untuk mengirim OTP (Updated with Pub/Sub)
 */
export const sendOtpService = async (email: string): Promise<AuthResponse> => {
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
        throw new ApiError("Email tidak ditemukan", 404);
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordResetModel.create({ userId: user.id, otp, expiresAt });
    
    try {
        await PubSubService.publishEmailMessage({
            to: email,
            subject: 'Verifikasi OTP',
            otp: otp,
            type: 'otp'
        });
        
        console.log(`OTP email message published for ${email}`);
    } catch (error) {
        console.error('Failed to publish email message:', error);
    }

    return {
        message: 'Kode OTP telah dikirim ke email Anda'
    };
};

/**
 * Service untuk verifikasi OTP
 */
export const verifyOtpService = async (otp: string): Promise<AuthResponse> => {
    const entry = await PasswordResetModel.findValidOtp(otp);
    if (!entry) {
        throw new ApiError('OTP tidak valid atau sudah kedaluwarsa', 400);
    }

    return {
        message: 'OTP valid'
    };
};

/**
 * Service untuk reset password
 */
export const resetPasswordService = async (
    otp: string,
    newPassword: string
): Promise<AuthResponse> => {
    const entry = await validateOtp(otp);
    await UserModel.updatePassword(entry.userId, newPassword);
    await PasswordResetModel.markOtpUsed(otp);

    return {
        message: 'Password berhasil diperbarui'
    };
};