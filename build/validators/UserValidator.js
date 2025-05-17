"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordSchema = exports.loginSchema = exports.registerSchema = exports.validateUserExists = exports.emailValidation = exports.passwordValidation = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_1 = require("../exceptions/apiError");
const zod_1 = require("zod");
exports.passwordValidation = {
    isValidPassword: (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/-]).{8,}$/;
        return passwordRegex.test(password.trim());
    },
    isPasswordMatch: (password, confirmPassword) => {
        return password.trim() === confirmPassword.trim();
    },
    getValidationMessage: (password, confirmPassword) => {
        if (password.length < 8)
            return "Password harus setidaknya 8 karakter.";
        if (!/^[A-Z]/.test(password))
            return "Password harus diawali dengan huruf besar.";
        if (!/\d/.test(password))
            return "Password mengandung setidaknya satu angka.";
        if (!/[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/-]/.test(password))
            return "Password harus mengandung setidaknya satu karakter khusus.";
        if (!exports.passwordValidation.isPasswordMatch(password, confirmPassword))
            return "Password dan Confirm Password harus sama.";
        return "Password valid.";
    }
};
exports.emailValidation = {
    isValidEmail: (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    },
    getValidationMessage: (email) => {
        if (!exports.emailValidation.isValidEmail(email))
            return "Format Email tidak valid";
        return "Email valid";
    }
};
const validateUserExists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(userId)) {
        throw new apiError_1.ApiError("User ID tidak valid", 400);
    }
    const user = yield user_model_1.default.findUserById(userId);
    if (!user) {
        throw new apiError_1.ApiError("User tidak dapat ditemukan", 400);
    }
    return user;
});
exports.validateUserExists = validateUserExists;
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().nonempty('Email wajib diisi'),
    username: zod_1.z.string().nonempty('Username wajib diisi'),
    password: zod_1.z.string().nonempty('Password wajib diisi'),
    confirmPassword: zod_1.z.string().nonempty('Confirm Password wajib diisi'),
    nama_usaha: zod_1.z.string().nonempty('Nama Usaha wajib diisi'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().nonempty('Email wajib diisi'),
    password: zod_1.z.string().nonempty('Password wajib diisi')
});
exports.updatePasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().nonempty('Password wajib diisi'),
    confirmPassword: zod_1.z.string().nonempty('Confirm Password wajib diisi')
});
