import UserModel from "../models/user.model";
import PasswordResetModel from "../models/passwordReset.model";
import { ApiError } from "../exceptions/ApiError";
import { comparePassword } from "../utils/password.util";
import { generateOtp } from "../utils/generateOtp.util";
import { sendEmail } from "../utils/sendEmail.util";
import jwt, { JwtPayload } from "jsonwebtoken";
import { passwordValidation } from "../validators/UserValidator";
import bcrypt from "bcryptjs/umd/types";
import { validateOtp } from "../validators/ResetPasswordValidator";

interface AuthResponse {
    message: string;
}

interface LoginResponse extends AuthResponse {
    userID: number | string;
    username: string;
    active_token: string;
}

// Function untuk melakukan pendaftaran pengguna
export const registerService = async (username: string, email: string, password: string, nama_usaha: string): Promise<AuthResponse> => {
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
        throw new ApiError("Email Already Exists", 400)
    }

    await UserModel.createUser(username, email, password, nama_usaha);
    return { message: "Registration Successful" }

}

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
        throw new ApiError("Pengguna Tidak Ditemukan", 404);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError("Password Salah", 400)
    }

    if (!process.env.JWT_SECRET) throw new ApiError("JWT Secret tidak didefinisikan", 403)

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    if (!user.id) {
        throw new ApiError("ID User diperluka", 400)
    }

    const userId = typeof user.id === "string" ? Number(user.id) : user.id

    if (!userId) {
        throw new ApiError("ID User Tidak Valid", 400)
    }

    await UserModel.createOrUpdateAuthToken(userId, accessToken, refreshToken);

    return {
        message: "Login Berhasil",
        userID: user.id,
        username: user.name,
        active_token: accessToken,
    }
}

export const sendOtpService = async (email: string): Promise<AuthResponse> => {
    const user = await UserModel.findUserByEmail(email)
    if (!user) {
        throw new ApiError("Email tidak ditemukan", 404)
    }

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await PasswordResetModel.create({ userId: user.id, otp, expiresAt });
    await sendEmail(email, 'Verifikasi OTP', otp)
    return { message: 'Kode OTP akan dikirim melalui Email anda' }
}

export const verifyOtpService = async (otp: string): Promise<AuthResponse> => {
    const entry = await PasswordResetModel.findValidOtp(otp)
    if (!entry) {
        throw new ApiError('OTP tidak valid atau sudah kadaluwarsa', 400)
    }
    return { message: 'OTP valid' }
}

export const resetPasswordService = async (otp: string, newPassword: string): Promise<AuthResponse> => {
    const entry = await validateOtp(otp)
    await UserModel.updatePassword(entry.userId, newPassword);
    await PasswordResetModel.markOtpUsed(otp);
    return { message: 'Password berhasil diganti' }
}