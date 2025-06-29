import { Router } from "express";
const router = Router();
import {
    register,
    login,
    refreshToken,
    sendOtp,
    verifyOtp,
    resetPassword
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import {
    resetPasswordSchema,
    verifyEmailSchema,
    verifyOtpSchema
} from "../validators/resetPassword.validator";
import { verifyAndAttachOtpEntry } from "../middlewares/auth.middleware";


router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.post(
    "/refresh-token",
    refreshToken
);


router.post(
    "/forget-password",
    validate(verifyEmailSchema),
    sendOtp
);

router.post(
    "/verify-otp",
    validate(verifyOtpSchema),
    verifyOtp
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    verifyAndAttachOtpEntry,
    resetPassword
);

export default router;