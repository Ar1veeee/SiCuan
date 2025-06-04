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
import { loginSchema, registerSchema } from "../validators/UserValidator";
import {
    resetPasswordSchema,
    verifyeEmailSchema,
    verifyeOtpSchema
} from "../validators/ResetPasswordValidator";
import { validateRegistrationData } from "../middlewares/auth.middleware";


router.post(
    "/register",
    validate(registerSchema),
    validateRegistrationData,
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
    validate(verifyeEmailSchema),
    sendOtp
);

router.post(
    "/verify-otp",
    validate(verifyeOtpSchema),
    verifyOtp
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
);

export default router;