import { Request, Response } from "express";
import { passwordValidation } from "../validators/UserValidator";
import { apiResponse } from "../utils/ApiResponseUtil";
import { updateUserPassword, getUserProfile } from "../services/ProfileService";

const validatePasswords = (newPassword: string, confirmPassword: string): string | null => {
    if (!passwordValidation.isValidPassword(newPassword)) {
        return passwordValidation.getValidationMessage(newPassword, confirmPassword);
    }
    if (!passwordValidation.isPasswordMatch(newPassword, confirmPassword)) {
        return passwordValidation.getValidationMessage(newPassword, confirmPassword);
    }
    return null;
};

export const updatePassword = async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    const validateMessage = validatePasswords(newPassword, confirmPassword)
    if (validateMessage) {
        return apiResponse.badRequest(res, validateMessage)
    }

    try {
        const userId = Number(user_id);
        const updated = await updateUserPassword(userId, newPassword)
        return apiResponse.success(res, updated)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}

export const userProfile = async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.params;

    try {
        const userId = Number(user_id)
        const Profiles = await getUserProfile(userId)
        return apiResponse.success(res, Profiles)
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
}