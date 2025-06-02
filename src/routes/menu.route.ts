import { Router } from "express";
const router = Router();
import {
    createMenu,
    getMenus,
    getMenuDetail,
    updateMenu,
    deleteMenu,
} from "../controllers/menu.controller";
import verifyToken from "../middlewares/auth.middleware";
import {
    validateMenuId,
    verifyMenuOwnership
} from "../middlewares/menu.middleware";
import { validate } from "../middlewares/validate.middleware";
import { menuSchema } from "../validators/MenuValidator";

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - nama_menu
 *       properties:
 *         nama_menu:
 *           type: string
 *           description: Nama menu
 *       example:
 *         nama_menu: Es Teh
 *     
 *     MenuResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID menu
 *         userId:
 *           type: string
 *           description: ID pengguna pemilik menu
 *         nama_menu:
 *           type: string
 *           description: Nama menu
 *         hpp:
 *           type: number
 *           nullable: true
 *           description: Harga pokok produksi
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembaruan terakhir
 *       example:
 *         id: 01JWQ4W8NNKQ7YNDCVNHP3CRA1
 *         userId: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *         nama_menu: Es Teh
 *         hpp: 2000
 *         createdAt: 2023-07-20T10:30:00Z
 *         updatedAt: 2023-07-20T10:30:00Z
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

// Semua rute memerlukan autentikasi
router.use(verifyToken);

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Mendapatkan semua menu pengguna saat ini
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar menu berhasil diambil
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
 *                     menus:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MenuResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Authorization header tidak ditemukan
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
router.get("/", getMenus);

/**
 * @swagger
 * /menu/{menu_id}:
 *   get:
 *     summary: Mendapatkan detail menu berdasarkan ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menu_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Detail menu berhasil diambil
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
 *                     menu:
 *                       $ref: '#/components/schemas/MenuResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Authorization header tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Forbidden access
 *       404:
 *         description: Menu tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Menu tidak ditemukan
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
router.get("/:menu_id", validateMenuId, getMenuDetail);

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Membuat menu baru
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menu berhasil dibuat
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
 *                   example: Resource created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Menu berhasil ditambahkan
 *               example:
 *                 success: true
 *                 message: Resource created successfully
 *                 data:
 *                   message: Menu berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Validation error
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Authorization header tidak ditemukan
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
router.post("/", validate(menuSchema), createMenu);

/**
 * @swagger
 * /menu/{menu_id}:
 *   patch:
 *     summary: Memperbarui menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menu_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menu berhasil diperbarui
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
 *                   example: Menu berhasil diperbarui
 *                 data:
 *                   $ref: '#/components/schemas/MenuResponse'
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Validation error
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Authorization header tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Forbidden access
 *       404:
 *         description: Menu tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Menu tidak ditemukan
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
    "/:menu_id",
    validate(menuSchema),
    validateMenuId,
    verifyMenuOwnership,
    updateMenu
);

/**
 * @swagger
 * /menu/{menu_id}:
 *   delete:
 *     summary: Menghapus menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menu_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Menu berhasil dihapus
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
 *                   example: Menu berhasil dihapus
 *                 data:
 *                   $ref: '#/components/schemas/MenuResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Authorization header tidak ditemukan
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Forbidden access
 *       404:
 *         description: Menu tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Menu tidak ditemukan
 *       422:
 *         description: Menu sudah dipakai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Menu sudah dipakai
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
router.delete(
    "/:menu_id",
    validateMenuId,
    verifyMenuOwnership,
    deleteMenu
);

export default router;