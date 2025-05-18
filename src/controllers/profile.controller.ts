
import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import { updatePasswordService, userProfileService } from "../services/ProfileService";
import { validatePassowrd } from "../validators/PasswordValidator";
import { ApiError } from "../exceptions/ApiError";

// Controller untuk memperbarui password pengguna
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    const validateMessage = validatePassowrd(newPassword, confirmPassword)
    if (validateMessage) {
        apiResponse.badRequest(res, validateMessage)
        return
    }

    try {
        const userId = parseInt(user_id, 10);
        const updated = await updatePasswordService(userId, newPassword)
        apiResponse.success(res, updated)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}

// Controller untuk mendapatkan profil pengguna berdasarkan user_id
export const userProfile = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;

    try {
        const userId = parseInt(user_id, 10)
        const Profiles = await userProfileService(userId)
        apiResponse.success(res, Profiles)
    } catch (error: unknown) {
        console.log("Error detail:", error)
        if (error instanceof ApiError) {
            apiResponse.error(res, error.message, error.statusCode)
        } else {
            apiResponse.internalServerError(res, "Terjadi kesalahan pada server. Silahkan coba lagi nanti")
        }
    }
}