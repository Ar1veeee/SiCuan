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
exports.userProfileService = exports.updatePasswordService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const apiError_1 = require("../exceptions/apiError");
const updatePasswordService = (user_id, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(user_id)) {
        throw new apiError_1.ApiError("ID User tidak valid", 400);
    }
    const updated = yield user_model_1.default.updatePassword(user_id, newPassword);
    if (!updated) {
        throw new apiError_1.ApiError("Password Gagal Diperbarui", 400);
    }
    return { message: "Password Berhasil Diperbarui" };
});
exports.updatePasswordService = updatePasswordService;
const userProfileService = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(user_id)) {
        throw new apiError_1.ApiError("ID User Tidak Valid", 400);
    }
    const user = yield user_model_1.default.findUserById(user_id);
    if (!user) {
        throw new apiError_1.ApiError("User Tidak Ditemukan", 404);
    }
    return {
        userId: user.id,
        username: user.name,
        email: user.email,
        nama_usaha: user.nama_usaha
    };
});
exports.userProfileService = userProfileService;
