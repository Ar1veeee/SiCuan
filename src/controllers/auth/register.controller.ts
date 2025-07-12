import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { AuthResponse } from "../../types/auth.type";

/**
 * Controller untuk mendaftar pengguna baru
 */
export const registerController = (
    { registerService }: {
        registerService: (username: string, email: string, password: string, nama_usaha: string) => Promise<AuthResponse>
    }) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, email, password, nama_usaha } = req.body;
            const userData = await registerService(username, email, password, nama_usaha);
            apiResponse.created(res, userData);
        } catch (error) {
            next(error);
        }
    };