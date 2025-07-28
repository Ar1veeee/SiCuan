import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { LoginResponse } from "../../types/auth.type";

/**
 * Controller untuk refresh token
 */
export const refreshTokenController =
  ({
    refreshTokenService,
  }: {
    refreshTokenService: (refreshTokenValue: string) => Promise<LoginResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenCookie = req.cookies.refreshToken;

      if (!refreshTokenCookie) {
        apiResponse.badRequest(res, "Refresh Token Required");
        return;
      }

      const result = await refreshTokenService(refreshTokenCookie);

      if (result.refreshToken) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      apiResponse.success(res, result.data, "Token Updated");
    } catch (error) {
      next(error);
    }
  };
