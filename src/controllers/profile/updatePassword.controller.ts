import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { ProfileResponse } from "../../types/profile.type";

/**
 * Controller untuk memperbarui password pengguna
 */
export const updatePasswordController = (
    { updatePasswordService }: {
        updatePasswordService: (userId: string, newPassword: string) => Promise<ProfileResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await updatePasswordService(req.userId!, req.body.password);
            apiResponse.success(res, result);
        } catch (error) {
            next(error);
        }
    };