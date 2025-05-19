// src/routes/menu.route.ts (dengan dokumentasi Swagger)
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
 *         nama_menu: Nasi Goreng
 *     
 *     MenuResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: ID menu
 *         userId:
 *           type: number
 *           description: ID pengguna pemilik menu
 *         nama_menu:
 *           type: string
 *           description: Nama menu
 *         jumlah_hpp:
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
 *         id: 1
 *         userId: 1
 *         nama_menu: Nasi Goreng
 *         jumlah_hpp: 15000
 *         createdAt: 2023-07-20T10:30:00Z
 *         updatedAt: 2023-07-20T10:30:00Z
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
 *       500:
 *         description: Server error
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
 *           type: integer
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
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu tidak ditemukan
 *       500:
 *         description: Server error
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
 *                   example: Menu berhasil ditambahkan
 *                 data:
 *                   $ref: '#/components/schemas/MenuResponse'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
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
 *           type: integer
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
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu tidak ditemukan
 *       500:
 *         description: Server error
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
 *           type: integer
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
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete(
    "/:menu_id",
    validateMenuId,
    verifyMenuOwnership,
    deleteMenu
);

export default router;