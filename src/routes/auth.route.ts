// src/routes/auth.route.ts (dengan dokumentasi Swagger)
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

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - confirmPassword
 *         - nama_usaha
 *       properties:
 *         username:
 *           type: string
 *           description: Username pengguna
 *         email:
 *           type: string
 *           format: email
 *           description: Email pengguna
 *         password:
 *           type: string
 *           format: password
 *           description: Password pengguna (min 8 karakter)
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Konfirmasi password
 *         nama_usaha:
 *           type: string
 *           description: Nama usaha pengguna
 *       example:
 *         username: johndoe
 *         email: john@example.com
 *         password: Password123!
 *         confirmPassword: Password123!
 *         nama_usaha: John's Restaurant
 *     
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email pengguna
 *         password:
 *           type: string
 *           format: password
 *           description: Password pengguna
 *       example:
 *         email: john@example.com
 *         password: Password123!
 *     
 *     OtpRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email pengguna
 *       example:
 *         email: john@example.com
 *     
 *     OtpVerify:
 *       type: object
 *       required:
 *         - otp
 *       properties:
 *         otp:
 *           type: string
 *           description: Kode OTP (6 digit)
 *       example:
 *         otp: "123456"
 *     
 *     ResetPassword:
 *       type: object
 *       required:
 *         - otp
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         otp:
 *           type: string
 *           description: Kode OTP (6 digit)
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Password baru (min 8 karakter)
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Konfirmasi password baru
 *       example:
 *         otp: "123456"
 *         newPassword: NewPassword123!
 *         confirmPassword: NewPassword123!
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Mendaftarkan pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Pendaftaran berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pendaftaran berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *       400:
 *         description: Data tidak valid
 *       409:
 *         description: Email atau username sudah terdaftar
 *       500:
 *         description: Server error
 */
router.post(
    "/register",
    validate(registerSchema),
    validateRegistrationData,
    register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     access_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Server error
 */
router.post(
    "/login",
    validate(loginSchema),
    login
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Token tidak valid atau kedaluwarsa
 */
router.post(
    "/refresh-token",
    refreshToken
);

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Mengirimkan kode OTP untuk reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpRequest'
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Kode OTP telah dikirim ke email Anda
 *       400:
 *         description: Email tidak valid
 *       404:
 *         description: Email tidak terdaftar
 *       500:
 *         description: Server error
 */
router.post(
    "/forget-password",
    validate(verifyeEmailSchema),
    sendOtp
);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verifikasi kode OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpVerify'
 *     responses:
 *       200:
 *         description: OTP berhasil diverifikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Kode OTP valid
 *       400:
 *         description: OTP tidak valid
 *       401:
 *         description: OTP salah
 *       500:
 *         description: Server error
 */
router.post(
    "/verify-otp",
    validate(verifyeOtpSchema),
    verifyOtp
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password berhasil diubah
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: OTP tidak valid
 *       500:
 *         description: Server error
 */
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
);

export default router;