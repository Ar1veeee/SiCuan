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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = exports.updatePassword = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const ProfileService_1 = require("../services/ProfileService");
const PasswordValidator_1 = require("../validators/PasswordValidator");
const apiError_1 = require("../exceptions/apiError");
// Controller untuk memperbarui password pengguna
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const validateMessage = (0, PasswordValidator_1.validatePassowrd)(newPassword, confirmPassword);
    if (validateMessage) {
        apiResponse_util_1.apiResponse.badRequest(res, validateMessage);
        return;
    }
    try {
        const userId = parseInt(user_id, 10);
        const updated = yield (0, ProfileService_1.updatePasswordService)(userId, newPassword);
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
exports.updatePassword = updatePassword;
// Controller untuk mendapatkan profil pengguna berdasarkan user_id
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    try {
        const userId = parseInt(user_id, 10);
        const Profiles = yield (0, ProfileService_1.userProfileService)(userId);
        apiResponse_util_1.apiResponse.success(res, Profiles);
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
exports.userProfile = userProfile;
