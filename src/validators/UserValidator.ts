import User from "../models/user.model";
import { ApiError } from "../exceptions/ApiError";
import { z } from "zod"

export const passwordValidation = {
    isValidPassword: (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/-]).{8,}$/;
        return passwordRegex.test(password.trim());
    },
    isPasswordMatch: (password: string, confirmPassword: string): boolean => {
        return password.trim() === confirmPassword.trim()
    },
    getValidationMessage: (password: string, confirmPassword: string): string => {
        if (password.length < 8) return "Password harus setidaknya 8 karakter.";
        if (!/^[A-Z]/.test(password)) return "Password harus diawali dengan huruf besar.";
        if (!/\d/.test(password)) return "Password mengandung setidaknya satu angka.";
        if (!/[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/-]/.test(password)) return "Password harus mengandung setidaknya satu karakter khusus.";
        if (!passwordValidation.isPasswordMatch(password, confirmPassword)) return "Password dan Confirm Password harus sama."
        return "Password valid.";
    }
}

export const emailValidation = {
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email)
    },
    getValidationMessage: (email: string): string => {
        if (!emailValidation.isValidEmail(email)) return "Format Email tidak valid"
        return "Email valid"
    }
}

export const validateUserExists = async (userId: number) => {
    if (isNaN(userId)) {
        throw new ApiError("User ID tidak valid", 400)
    }

    const user = await User.findUserById(userId)
    if (!user) {
        throw new ApiError("User tidak dapat ditemukan", 400)
    }
    return user
}


export const registerSchema = z.object({
    email: z.string().nonempty('Email wajib diisi'),
    username: z.string().nonempty('Username wajib diisi'),
    password: z.string().nonempty('Password wajib diisi'),
    confirmPassword: z.string().nonempty('Confirm Password wajib diisi'),
    nama_usaha: z.string().nonempty('Nama Usaha wajib diisi'),
})

export const loginSchema = z.object({
    email: z.string().nonempty('Email wajib diisi'),
    password: z.string().nonempty('Password wajib diisi')
})

export const updatePasswordSchema = z.object({
    newPassword: z.string().nonempty('Password wajib diisi'),
    confirmPassword: z.string().nonempty('Confirm Password wajib diisi')
})