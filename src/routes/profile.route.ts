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
 *         id:
 *           type: number
 *           description: ID pengguna
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
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan akun
 *       example:
 *         id: 1
 *         username: johndoe
 *         email: john@example.com
 *         nama_usaha: John's Restaurant
 *         created_at: 2023-07-20T10:30:00Z
 *     
 *     UpdatePassword:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           description: Password saat ini
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Password baru (min 8 karakter)
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Konfirmasi password baru
 *       example:
 *         currentPassword: CurrentPass123!
 *         newPassword: NewPassword123!
 *         confirmPassword: NewPassword123!
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
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Profil tidak ditemukan
 *       500:
 *         description: Server error
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
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi atau password saat ini salah
 *       500:
 *         description: Server error
 */
router.patch(
    "/password",
    validate(updatePasswordSchema),
    validatePasswordMatch,
    updatePassword
);

export default router;