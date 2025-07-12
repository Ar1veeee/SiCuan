import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { ProfileData, ProfileResponse } from "../../types/profile.type";

/**
 * Controller untuk mendapatkan profil pengguna berdasarkan user_id
 */
export const userProfileController = (
    { userProfileService }: {
        userProfileService: (userId: string) => Promise<ProfileData>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const profile = await userProfileService(req.userId!);
            apiResponse.success(res, { profile });
        } catch (error) {
            next(error);
        }
    };