import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util";
import { updatePasswordService, userProfileService } from "../services/ProfileService";

/**
 * Controller untuk memperbarui password pengguna
 */
export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const result = await updatePasswordService(userId, req.body.password);
        apiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller untuk mendapatkan profil pengguna berdasarkan user_id
 */
export const userProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            apiResponse.badRequest(res, "User ID tidak valid");
            return;
        }

        const profile = await userProfileService(userId);
        apiResponse.success(res, profile);
    } catch (error) {
        next(error);
    }
};