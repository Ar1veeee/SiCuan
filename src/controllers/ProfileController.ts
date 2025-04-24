"use strict";

import { Request, Response } from "express";
import { apiResponse } from "../utils/ApiResponseUtil";
import { updateUserPassword, getUserProfile } from "../services/ProfileService";
import { validatePassowrd } from "../validators/PasswordValidator";

export const updatePassword = async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    const validateMessage = validatePassowrd(newPassword, confirmPassword)
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