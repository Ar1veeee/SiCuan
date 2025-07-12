import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { AuthResponse } from "../../types/auth.type";

/**
 * Controller untuk mengirim OTP
 */
export const sendOtpController = (
    { sendOtpService }: {
        sendOtpService: (email: string) => Promise<AuthResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;
            const result = await sendOtpService(email);
            apiResponse.created(res, result);
        } catch (error) {
            next(error);
        }
    };