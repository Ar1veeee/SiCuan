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
 *         - email
 *         - username
 *         - password
 *         - confirmPassword
 *         - nama_usaha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email pengguna
 *         username:
 *           type: string
 *           description: Username pengguna
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
 *         email: john@example.com
 *         username: johndoe
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
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Pesan error
 *       required:
 *         - success
 *         - message
 *     
 *     AuthSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           description: Pesan sukses
 *         data:
 *           type: object
 *           description: Data response
 *       required:
 *         - success
 *         - message
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
 *               example:
 *                 success: true
 *                 message: Pendaftaran berhasil
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               passwordMismatch:
 *                 summary: Password tidak cocok
 *                 value:
 *                   success: false
 *                   message: Password dan Confirm Password harus sama.
 *               passwordTooShort:
 *                 summary: Password terlalu pendek
 *                 value:
 *                   success: false
 *                   message: Password harus setidaknya 8 karakter.
 *               passwordNoUppercase:
 *                 summary: Password tanpa huruf besar
 *                 value:
 *                   success: false
 *                   message: Password harus diawali dengan huruf besar.
 *               passwordNoNumber:
 *                 summary: Password tanpa angka
 *                 value:
 *                   success: false
 *                   message: Password mengandung setidaknya satu angka.
 *               emailInvalid:
 *                 summary: Format email tidak valid
 *                 value:
 *                   success: false
 *                   message: Format Email tidak valid
 *               emailExists:
 *                 summary: Email sudah terdaftar
 *                 value:
 *                   success: false
 *                   message: Email sudah terdaftar
 *               requiredFields:
 *                 summary: Field wajib tidak diisi
 *                 value:
 *                   success: false
 *                   message: Email wajib diisi
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Internal server error
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Login berhasil
 *                     userID:
 *                       type: string
 *                       description: ID pengguna (ULID format)
 *                       example: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     access_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-27T10:30:00.000Z
 *               example:
 *                 success: true
 *                 message: Success
 *                 data:
 *                   message: Login berhasil
 *                   userID: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *                   username: johndoe
 *                   access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   expiresAt: 2024-01-27T10:30:00.000Z
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPassword:
 *                 summary: Password salah
 *                 value:
 *                   success: false
 *                   message: Password salah
 *               requiredFields:
 *                 summary: Field wajib tidak diisi
 *                 value:
 *                   success: false
 *                   message: Email wajib diisi
 *       404:
 *         description: Pengguna tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Pengguna tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Internal server error
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
 *                 message:
 *                   type: string
 *                   example: Token berhasil diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: string
 *                       description: ID pengguna (ULID format)
 *                       example: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     access_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-27T10:30:00.000Z
 *               example:
 *                 success: true
 *                 message: Token berhasil diperbarui
 *                 data:
 *                   userID: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *                   username: johndoe
 *                   access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   expiresAt: 2024-01-27T10:30:00.000Z
 *       400:
 *         description: Token tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Token tidak valid atau kedaluwarsa
 *       401:
 *         description: Token kedaluwarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Token sudah kedaluwarsa
 *       404:
 *         description: Pengguna tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Pengguna tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Internal server error
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
 *               example:
 *                 success: true
 *                 message: Kode OTP telah dikirim ke email Anda
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               requiredEmail:
 *                 summary: Email tidak diisi
 *                 value:
 *                   success: false
 *                   message: Email wajib diisi
 *               invalidEmail:
 *                 summary: Format email tidak valid
 *                 value:
 *                   success: false
 *                   message: Format Email tidak valid
 *       404:
 *         description: Email tidak terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email tidak ditemukan
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Internal server error
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
 *                   example: OTP valid
 *               example:
 *                 success: true
 *                 message: OTP valid
 *       400:
 *         description: OTP tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               requiredOtp:
 *                 summary: OTP tidak diisi
 *                 value:
 *                   success: false
 *                   message: OTP wajib diisi
 *               invalidOtp:
 *                 summary: OTP tidak valid
 *                 value:
 *                   success: false
 *                   message: OTP tidak valid atau sudah kadaluwarsa
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Internal server error
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
 *                   example: Password berhasil diperbarui
 *               example:
 *                 success: true
 *                 message: Password berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               requiredOtp:
 *                 summary: OTP tidak diisi
 *                 value:
 *                   success: false
 *                   message: OTP wajib diisi
 *               invalidOtp:
 *                 summary: OTP tidak valid
 *                 value:
 *                   success: false
 *                   message: OTP tidak valid atau sudah kadaluwarsa
 *               requiredPassword:
 *                 summary: Password tidak diisi
 *                 value:
 *                   success: false
 *                   message: Password wajib diisi
 *               requiredConfirmPassword:
 *                 summary: Konfirmasi password tidak diisi
 *                 value:
 *                   success: false
 *                   message: Confirm Password wajib diisi
 *               passwordMismatch:
 *                 summary: Password tidak cocok
 *                 value:
 *                   success: false
 *                   message: Konfirmasi password tidak cocok
 *               passwordTooShort:
 *                 summary: Password terlalu pendek
 *                 value:
 *                   success: false
 *                   message: Password harus setidaknya 8 karakter.
 *               passwordNoUppercase:
 *                 summary: Password tanpa huruf besar
 *                 value:
 *                   success: false
 *                   message: Password harus diawali dengan huruf besar.
 *               passwordNoNumber:
 *                 summary: Password tanpa angka
 *                 value:
 *                   success: false
 *                   message: Password mengandung setidaknya satu angka.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Internal server error
 */
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
);

export default router;