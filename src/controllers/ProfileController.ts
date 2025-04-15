import { Request, Response } from "express";
import { passwordValidation } from "../utils/ValidationUtil";
import { apiResponse } from "../utils/ApiResponseUtil";
import { updateUserPassword, getUserProfile } from "../services/ProfileService";

export const updatePassword = async (req: Request, res:Response): Promise<any> => {
    const {user_id} = req.params;
    const {newPassword, confirmPassword} = req.body;

    if (!passwordValidation.isValidPassword(newPassword)) {
        return apiResponse.badRequest(
            res,
            passwordValidation.getValidationMessage(newPassword, confirmPassword),
        );
    }

    if (!passwordValidation.isPasswordMatch(newPassword, confirmPassword)) {
        return apiResponse.badRequest(
            res,
            passwordValidation.getValidationMessage(newPassword, confirmPassword),
        );
    }

    try {
        const userId = Number(user_id);
        const updated = await updateUserPassword(userId, newPassword)
        return apiResponse.success(res, updated)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}

export const userProfile = async (req: Request, res:Response): Promise<any> => {
    const {user_id} = req.params;
    
    try {
        const userId = Number(user_id)
        const Profiles = await getUserProfile(userId)
        return apiResponse.success(res, Profiles)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}