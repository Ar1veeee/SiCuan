"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = require("../controllers/auth.controller");
const auth_controller_2 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const UserValidator_1 = require("../validators/UserValidator");
const ResetPasswordValidator_1 = require("../validators/ResetPasswordValidator");
// Melakukan pendaftaran
router.post("/register", (0, validate_middleware_1.validate)(UserValidator_1.registerSchema), auth_controller_1.register);
// Melakukan login
router.post("/login", (0, validate_middleware_1.validate)(UserValidator_1.loginSchema), auth_controller_1.login);
// Melakukan lupa password
router.post("/forget-password", (0, validate_middleware_1.validate)(ResetPasswordValidator_1.verifyeEmailSchema), auth_controller_2.sendOtp);
// Melakukan verifikasi otp
router.post("/verify-otp", (0, validate_middleware_1.validate)(ResetPasswordValidator_1.verifyeOtpSchema), auth_controller_2.verifyOtp);
// Memperbarui password lama
router.post("/reset-password", (0, validate_middleware_1.validate)(ResetPasswordValidator_1.resetPasswordSchema), auth_controller_2.resetPassword);
exports.default = router;
