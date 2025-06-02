import { Router } from "express";
const router = Router();
import {
    updatePassword,
    userProfile
} from "../controllers/profile.controller";
import verifyToken from "../middlewares/auth.middleware";
import {
    validatePasswordMatch
} from "../middlewares/profile.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updatePasswordSchema } from "../validators/UserValidator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID pengguna (ULID format)
 *         username:
 *           type: string
 *           description: Username pengguna
 *         email:
 *           type: string
 *           format: email
 *           description: Email pengguna
 *         nama_usaha:
 *           type: string
 *           description: Nama usaha pengguna
 *       example:
 *         userId: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *         username: johndoe
 *         email: john@example.com
 *         nama_usaha: John's Restaurant
 *     
 *     UpdatePassword:
 *       type: object
 *       required:
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Password baru (min 8 karakter)
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Konfirmasi password baru
 *       example:
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
 */

router.use(verifyToken);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Mendapatkan profil pengguna
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
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
 *                   example: Profil berhasil diambil
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *               example:
 *                 success: true
 *                 message: Profil berhasil diambil
 *                 data:
 *                   userId: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *                   username: johndoe
 *                   email: john@example.com
 *                   nama_usaha: John's Restaurant
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       404:
 *         description: Profil tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: User tidak ditemukan
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
router.get("/", userProfile);

/**
 * @swagger
 * /profile/password:
 *   patch:
 *     summary: Memperbarui password pengguna
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: Password berhasil diperbarui
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
 *               validationError:
 *                 summary: Data tidak valid
 *                 value:
 *                   success: false
 *                   message: Validation error
 *               passwordMismatch:
 *                 summary: Password tidak cocok
 *                 value:
 *                   success: false
 *                   message: Password dan Confirm Password harus sama
 *               passwordTooShort:
 *                 summary: Password terlalu pendek
 *                 value:
 *                   success: false
 *                   message: Password harus setidaknya 8 karakter
 *               passwordNoUppercase:
 *                 summary: Password tanpa huruf besar
 *                 value:
 *                   success: false
 *                   message: Password harus diawali dengan huruf besar
 *               passwordNoNumber:
 *                 summary: Password tanpa angka
 *                 value:
 *                   success: false
 *                   message: Password mengandung setidaknya satu angka
 *               updateFailed:
 *                 summary: Gagal memperbarui
 *                 value:
 *                   success: false
 *                   message: Password gagal diperbarui
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
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
router.patch(
    "/password",
    validate(updatePasswordSchema),
    validatePasswordMatch,
    updatePassword
);

export default router;