import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { AuthResponse } from "../../types/auth.type";

/**
 * Controller untuk mereset password
 */
export const resetPasswordController =
  ({
    resetPasswordService,
  }: {
    resetPasswordService: (
      userId: string,
      newPassword: string
    ) => Promise<AuthResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { newPassword, confirmPassword } = req.body;

      const result = await resetPasswordService(req.userId!, newPassword);

      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
