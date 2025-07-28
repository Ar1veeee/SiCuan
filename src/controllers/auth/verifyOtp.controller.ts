import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { AuthResponse } from "../../types/auth.type";

/**
 * Controller untuk memverifikasi OTP
 */
export const verifyOtpController =
  ({
    verifyOtpService,
  }: {
    verifyOtpService: (otp: string) => Promise<AuthResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { otp } = req.body;
      const result = await verifyOtpService(otp);
      apiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  };
