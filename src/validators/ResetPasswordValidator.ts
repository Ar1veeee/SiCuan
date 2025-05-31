import PasswordResetModel from "../models/passwordReset.model";
import { ApiError } from "../exceptions/ApiError";
import { z } from "zod"

export const validateOtp = async (otp: string) => {
    const entry = await PasswordResetModel.findValidOtp(otp)
    if (!entry) {
        throw new ApiError('OTP tidak valid atau sudah kadaluwarsa', 400)
    }
    return entry
}

export const verifyeEmailSchema = z.object({
    email: z.string().nonempty('Email wajib diisi')
})

export const verifyeOtpSchema = z.object({
    otp: z.string().nonempty('OTP wajib diisi')
})

export const resetPasswordSchema = z.object({
    otp: z.string().nonempty('OTP wajib diisi'),
    newPassword: z.string().nonempty('Password wajib diisi'),
    confirmPassword: z.string().nonempty('Confirm Password wajib diisi')
})