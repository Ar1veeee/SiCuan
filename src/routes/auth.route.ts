import { Router } from "express"
const router = Router()
import { register, login } from "../controllers/auth.controller"
import { sendOtp, verifyOtp, resetPassword } from "../controllers/auth.controller"
import { validate } from "../middlewares/validate.middleware"
import { loginSchema, registerSchema } from "../validators/UserValidator"
import { resetPasswordSchema, verifyeEmailSchema, verifyeOtpSchema } from "../validators/ResetPasswordValidator"

// Melakukan pendaftaran
router.post("/register", validate(registerSchema), register)

// Melakukan login
router.post("/login", validate(loginSchema), login)

// Melakukan lupa password
router.post("/forget-password", validate(verifyeEmailSchema), sendOtp)

// Melakukan verifikasi otp
router.post("/verify-otp", validate(verifyeOtpSchema), verifyOtp)

// Memperbarui password lama
router.post("/reset-password", validate(resetPasswordSchema), resetPassword)

export default router