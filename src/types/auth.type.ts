import { JwtPayload } from "jsonwebtoken";

export interface UserRegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    nama_usaha: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface OtpRequest {
    email: string;
}

export interface VerifyOtpRequest {
    otp: string;
}

export interface ResetPasswordRequest {
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthResponse {
    message: string;
    data?: any;
}

export interface LoginResponse extends AuthResponse {
    data: {
        userID: string | string;
        username: string;
        access_token: string;
        expiresAt?: string;
    };
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            userId?: string;  
        }
    }
}
