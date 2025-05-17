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
exports.resetPasswordSchema = exports.verifyeOtpSchema = exports.verifyeEmailSchema = exports.validateOtp = void 0;
const passwordReset_model_1 = __importDefault(require("../models/passwordReset.model"));
const apiError_1 = require("../exceptions/apiError");
const zod_1 = require("zod");
const validateOtp = (otp) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield passwordReset_model_1.default.findValidOtp(otp);
    if (!entry) {
        throw new apiError_1.ApiError('OTP tidak valid atau sudah kadaluwarsa', 400);
    }
    return entry;
});
exports.validateOtp = validateOtp;
exports.verifyeEmailSchema = zod_1.z.object({
    email: zod_1.z.string().nonempty('Email wajib diisi')
});
exports.verifyeOtpSchema = zod_1.z.object({
    otp: zod_1.z.string().nonempty('OTP wajib diisi')
});
exports.resetPasswordSchema = zod_1.z.object({
    otp: zod_1.z.string().nonempty('OTP wajib diisi'),
    newPassword: zod_1.z.string().nonempty('Password wajib diisi'),
    confirmPassword: zod_1.z.string().nonempty('Confirm Password wajib diisi')
});
