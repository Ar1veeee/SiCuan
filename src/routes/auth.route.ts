// import configurations
import { Router } from "express";
import container from "../config/container.config";
const router = Router();

// import validations
import { loginSchema, registerSchema } from "../validators/auth.validator";
import {
  resetPasswordSchema,
  verifyEmailSchema,
  verifyOtpSchema,
} from "../validators/resetPassword.validator";

// import middleware
import { validate } from "../middlewares/validate.middleware";
import verifyToken from "../middlewares/auth.middleware";

const register = container.resolve("register");
const login = container.resolve("login");
const refreshToken = container.resolve("refreshToken");
const sendOtp = container.resolve("sendOtp");
const verifyOtp = container.resolve("verifyOtp");
const resetPassword = container.resolve("resetPassword");

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh-token", refreshToken);

router.post("/forget-password", validate(verifyEmailSchema), sendOtp);

router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  verifyToken,
  resetPassword
);

export default router;
