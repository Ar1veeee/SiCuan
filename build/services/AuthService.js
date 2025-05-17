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
exports.resetPasswordService = exports.verifyOtpService = exports.sendOtpService = exports.loginService = exports.registerService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const passwordReset_model_1 = __importDefault(require("../models/passwordReset.model"));
const apiError_1 = require("../exceptions/apiError");
const password_util_1 = require("../utils/password.util");
const generateOtp_util_1 = require("../utils/generateOtp.util");
const sendEmail_util_1 = require("../utils/sendEmail.util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ResetPasswordValidator_1 = require("../validators/ResetPasswordValidator");
// Function untuk melakukan pendaftaran pengguna
const registerService = (username, email, password, nama_usaha) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.findUserByEmail(email);
    if (existingUser) {
        throw new apiError_1.ApiError("Email Already Exists", 400);
    }
    yield user_model_1.default.createUser(username, email, password, nama_usaha);
    return { message: "Registration Successful" };
});
exports.registerService = registerService;
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findUserByEmail(email);
    if (!user) {
        throw new apiError_1.ApiError("Pengguna Tidak Ditemukan", 404);
    }
    const isPasswordValid = yield (0, password_util_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError("Password Salah", 400);
    }
    if (!process.env.JWT_SECRET)
        throw new apiError_1.ApiError("JWT Secret tidak didefinisikan", 403);
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    if (!user.id) {
        throw new apiError_1.ApiError("ID User diperluka", 400);
    }
    const userId = typeof user.id === "string" ? Number(user.id) : user.id;
    if (!userId) {
        throw new apiError_1.ApiError("ID User Tidak Valid", 400);
    }
    yield user_model_1.default.createOrUpdateAuthToken(userId, accessToken, refreshToken);
    return {
        message: "Login Berhasil",
        userID: user.id,
        username: user.name,
        active_token: accessToken,
    };
});
exports.loginService = loginService;
const sendOtpService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findUserByEmail(email);
    if (!user) {
        throw new apiError_1.ApiError("Email tidak ditemukan", 404);
    }
    const otp = (0, generateOtp_util_1.generateOtp)();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    yield passwordReset_model_1.default.create({ userId: user.id, otp, expiresAt });
    yield (0, sendEmail_util_1.sendEmail)(email, 'Verifikasi OTP', otp);
    return { message: 'Kode OTP akan dikirim melalui Email anda' };
});
exports.sendOtpService = sendOtpService;
const verifyOtpService = (otp) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield passwordReset_model_1.default.findValidOtp(otp);
    if (!entry) {
        throw new apiError_1.ApiError('OTP tidak valid atau sudah kadaluwarsa', 400);
    }
    return { message: 'OTP valid' };
});
exports.verifyOtpService = verifyOtpService;
const resetPasswordService = (otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield (0, ResetPasswordValidator_1.validateOtp)(otp);
    yield user_model_1.default.updatePassword(entry.userId, newPassword);
    yield passwordReset_model_1.default.markOtpUsed(otp);
    return { message: 'Password berhasil diganti' };
});
exports.resetPasswordService = resetPasswordService;
