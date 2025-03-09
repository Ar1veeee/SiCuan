"use strict";

import { Request, Response } from "express";
import { passwordValidation, emailValidation } from "../utils/ValidationUtil";
import { apiResponse } from "../utils/ApiResponseUtil";
import { userRegister, userLogin } from "../services/AuthService";
import User from "../models/UserModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv-safe";
dotenv.config();

// User Registration
// Handles user registration by validating the password format,
// checking for existing email, and saving new user data.
export const register = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { username, email, password, confirmPassword } = req.body;

    if (!passwordValidation.isValidPassword(password)) {
        return apiResponse.badRequest(
            res,
            passwordValidation.getValidationMessage(password, confirmPassword),
        );
    }

    if (!passwordValidation.isPasswordMatch(password, confirmPassword)) {
        return apiResponse.badRequest(
            res,
            passwordValidation.getValidationMessage(password, confirmPassword),
        );
    }

    if (!emailValidation.isValidEmail(email)) {
        return apiResponse.badRequest(
            res,
            emailValidation.getValidationMessage(email),
        );
    }

    try {
        const message = await userRegister(username, email, confirmPassword)
        return apiResponse.created(res, message)
    } catch (error: any) {
        console.log(error)
        return apiResponse.internalServerError(res, error.message)
    }
};

// User Login
// Handles user login by verifying email and password,
// and generating access and refresh tokens.
export const login = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { email, password } = req.body;
    try {
        const loginResult = await userLogin(email, password)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return apiResponse.success(res, loginResult);
    } catch (error: any) {
        return apiResponse.internalServerError(res, error.message)
    }
};

// Refresh Active Token
// Generates a new active token using the refresh token,
// ensuring continued authentication without requiring a login.
export const refreshToken = async (
    req: Request,
    res: Response
): Promise<any> => {
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token) return apiResponse.badRequest(res, "Refresh Token Required")

    try {
        if (!process.env.JWT_SECRET) throw new Error("JWT Secret is not defined")
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET) as JwtPayload;

        if (!decoded || !decoded.id) return apiResponse.badRequest(res, "Invalid or Expired Token")

        const user = await User.findUserById(decoded.id);
        if (!user) return apiResponse.badRequest(res, "User Not Found");

        const userId = typeof user.id === "string" ? Number(user.id) : user.id;

        if (!userId) return apiResponse.badRequest(res, "Invalid User ID")

        const authRecord = await User.findAuthByUserId(userId);
        if (!authRecord || authRecord.refreshToken !== refresh_token) {
            return apiResponse.badRequest(res, "Invalid Refresh Token")
        }

        const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        await User.refreshToken(refresh_token, newAccessToken);

        if (newRefreshToken !== refresh_token) {
            await User.createOrUpdateAuthToken(userId, newAccessToken, newRefreshToken);                        
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
        }

        return apiResponse.success(res, {
            loginResult: {
                userID: user.id,
                username: user.name,
                access_token: newAccessToken,
            },
        }, "Token Updated");
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return apiResponse.badRequest(res, "Refresh Token Expired");
        }
        return apiResponse.internalServerError(res, error.message)
    }
};
