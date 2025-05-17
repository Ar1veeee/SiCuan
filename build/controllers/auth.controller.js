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
exports.resetPassword = exports.verifyOtp = exports.sendOtp = exports.refreshToken = exports.login = exports.register = void 0;
const UserValidator_1 = require("../validators/UserValidator");
const apiResponse_util_1 = require("../utils/apiResponse.util");
const AuthService_1 = require("../services/AuthService");
const AuthService_2 = require("../services/AuthService");
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const PasswordValidator_1 = require("../validators/PasswordValidator");
const apiError_1 = require("../exceptions/apiError");
dotenv_safe_1.default.config();
// Controller untuk mendaftar pengguna baru
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, confirmPassword, nama_usaha } = req.body;
    if (!UserValidator_1.passwordValidation.isValidPassword(password)) {
        apiResponse_util_1.apiResponse.badRequest(res, UserValidator_1.passwordValidation.getValidationMessage(password, confirmPassword));
        return;
    }
    if (!UserValidator_1.passwordValidation.isPasswordMatch(password, confirmPassword)) {
        apiResponse_util_1.apiResponse.badRequest(res, UserValidator_1.passwordValidation.getValidationMessage(password, confirmPassword));
        return;
    }
    if (!UserValidator_1.emailValidation.isValidEmail(email)) {
        apiResponse_util_1.apiResponse.badRequest(res, UserValidator_1.emailValidation.getValidationMessage(email));
        return;
    }
    try {
        const userData = yield (0, AuthService_1.registerService)(username, email, confirmPassword, nama_usaha);
        apiResponse_util_1.apiResponse.created(res, userData);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.register = register;
// Controller untuk login pengguna
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const loginResult = yield (0, AuthService_1.loginService)(email, password);
        res.cookie("refreshToken", exports.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        apiResponse_util_1.apiResponse.success(res, loginResult);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.login = login;
// Controller untuk refresh token
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) {
        apiResponse_util_1.apiResponse.badRequest(res, "Refresh Token Required");
        return;
    }
    try {
        if (!process.env.JWT_SECRET)
            throw new Error("JWT Secret is not defined");
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            apiResponse_util_1.apiResponse.badRequest(res, "Invalid or Expired Token");
            return;
        }
        const user = yield user_model_1.default.findUserById(decoded.id);
        if (!user) {
            apiResponse_util_1.apiResponse.badRequest(res, "User Not Found");
            return;
        }
        const userId = typeof user.id === "string" ? Number(user.id) : user.id;
        if (!userId) {
            apiResponse_util_1.apiResponse.badRequest(res, "Invalid User ID");
            return;
        }
        const authRecord = yield user_model_1.default.findAuthByUserId(userId);
        if (!authRecord || authRecord.refreshToken !== refresh_token) {
            apiResponse_util_1.apiResponse.badRequest(res, "Invalid Refresh Token");
            return;
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        yield user_model_1.default.refreshToken(refresh_token, newAccessToken);
        if (newRefreshToken !== refresh_token) {
            yield user_model_1.default.createOrUpdateAuthToken(userId, newAccessToken, newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }
        apiResponse_util_1.apiResponse.success(res, {
            loginResult: {
                userID: user.id,
                username: user.name,
                access_token: newAccessToken,
            },
        }, "Token Updated");
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error === 'TokenExpiredError') {
            apiResponse_util_1.apiResponse.badRequest(res, "Refresh Token Expired");
        }
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.refreshToken = refreshToken;
// Controller untuk mengirim OTP
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const result = yield (0, AuthService_2.sendOtpService)(email);
        apiResponse_util_1.apiResponse.created(res, result);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.sendOtp = sendOtp;
// Controller untuk memverifikasi OTP
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    try {
        const result = yield (0, AuthService_2.verifyOtpService)(otp);
        apiResponse_util_1.apiResponse.success(res, result);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.verifyOtp = verifyOtp;
// Controller untuk mereset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, newPassword, confirmPassword } = req.body;
    const validateMessage = (0, PasswordValidator_1.validatePassowrd)(newPassword, confirmPassword);
    if (validateMessage) {
        apiResponse_util_1.apiResponse.badRequest(res, validateMessage);
        return;
    }
    try {
        const updated = yield (0, AuthService_2.resetPasswordService)(otp, newPassword);
        apiResponse_util_1.apiResponse.success(res, updated);
    }
    catch (error) {
        console.log("Error detail:", error);
        if (error instanceof apiError_1.ApiError) {
            apiResponse_util_1.apiResponse.error(res, error.message, error.statusCode);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti");
        }
    }
});
exports.resetPassword = resetPassword;
