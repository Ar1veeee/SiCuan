import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import { updatePasswordService, userProfileService } from "../services/ProfileService";
import { handleProfileError } from "../middlewares/profile.middleware";

/**
 * Controller untuk memperbarui password pengguna
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const result = await updatePasswordService(userId, req.body.newPassword);
        apiResponse.success(res, result);
    } catch (error) {
        handleProfileError(error, res);
    }
};

/**
 * Controller untuk mendapatkan profil pengguna berdasarkan user_id
 */
export const userProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const profile = await userProfileService(userId);
        apiResponse.success(res, profile);
    } catch (error) {
        handleProfileError(error, res);
    }
};