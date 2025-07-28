import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.util";
import { LoginResponse } from "../../types/auth.type";

/**
 * Controller untuk login pengguna
 */
export const loginController =
  ({
    loginService,
  }: {
    loginService: (
      email: string,
      password: string,
      deviceInfo?: string
    ) => Promise<LoginResponse>;
  }) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const loginResult = await loginService(email, password);

      res.cookie("refreshToken", loginResult.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { refreshToken, ...responseData } = loginResult;

      apiResponse.success(res, responseData);
    } catch (error) {
      next(error);
    }
  };
