import { Router } from "express";
const router = Router();
import { 
    createResep, 
    deleteMenuResep, 
    getRecipes, 
    updateMenuResep 
} from "../controllers/hpp.controller";
import verifyToken from "../middlewares/auth.middleware";
import { 
    validateMenuId, 
    validateBahanId, 
    verifyHppOwnership 
} from '../middlewares/hpp.middleware';
import { validate } from "../middlewares/validate.middleware";
import { bahanSchema } from "../validators/HppValidator";

/**
 * @swagger
 * components:
 *   schemas:
 *     Bahan:
 *       type: object
 *       required:
 *         - nama_bahan
 *         - jumlah
 *         - satuan
 *         - harga
 *       properties:
 *         nama_bahan:
 *           type: string
 *           description: Nama bahan
 *         jumlah:
 *           type: number
 *           description: Jumlah bahan
 *         satuan:
 *           type: string
 *           description: Satuan bahan (gram, kg, liter, dll)
 *         harga:
 *           type: number
 *           description: Harga bahan
 *       example:
 *         nama_bahan: Beras
 *         jumlah: 200
 *         satuan: gram
 *         harga: 3000
 *     
 *     RecipeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: ID resep
 *         menuId:
 *           type: number
 *           description: ID menu
 *         nama_bahan:
 *           type: string
 *           description: Nama bahan
 *         jumlah:
 *           type: number
 *           description: Jumlah bahan
 *         satuan:
 *           type: string
 *           description: Satuan bahan
 *         harga:
 *           type: number
 *           description: Harga bahan
 *         total_harga:
 *           type: number
 *           description: Total harga (jumlah * harga)
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
 *         menuId: 1
 *         nama_bahan: Beras
 *         jumlah: 200
 *         satuan: gram
 *         harga: 3000
 *         total_harga: 3000
 *         createdAt: 2023-07-20T10:30:00Z
 *         updatedAt: 2023-07-20T10:30:00Z
 */

router.use(verifyToken);

/**
 * @swagger
 * /resep/{menu_id}:
 *   get:
 *     summary: Mendapatkan semua bahan dari resep menu
 *     tags: [Resep]
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
 *         description: Daftar bahan resep berhasil diambil
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
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RecipeResponse'
 *                     total_hpp:
 *                       type: number
 *                       description: Total harga pokok produksi
 *                       example: 25000
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
    "/:menu_id", 
    validateMenuId,
    verifyHppOwnership,
    getRecipes
);

/**
 * @swagger
 * /resep/{menu_id}:
 *   post:
 *     summary: Menambah bahan baru ke resep menu
 *     tags: [Resep]
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
 *             $ref: '#/components/schemas/Bahan'
 *     responses:
 *       201:
 *         description: Bahan berhasil ditambahkan ke resep
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
 *                   example: Bahan berhasil ditambahkan ke resep
 *                 data:
 *                   $ref: '#/components/schemas/RecipeResponse'
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
router.post(
    "/:menu_id", 
    validate(bahanSchema),
    validateMenuId,
    verifyHppOwnership,
    createResep
);

/**
 * @swagger
 * /resep/{menu_id}/{bahan_id}:
 *   put:
 *     summary: Mengubah bahan dalam resep menu
 *     tags: [Resep]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menu_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *       - in: path
 *         name: bahan_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bahan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bahan'
 *     responses:
 *       200:
 *         description: Bahan berhasil diperbarui
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
 *                   example: Bahan berhasil diperbarui
 *                 data:
 *                   $ref: '#/components/schemas/RecipeResponse'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu atau bahan tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put(
    "/:menu_id/:bahan_id", 
    validate(bahanSchema),
    validateMenuId,
    validateBahanId,
    verifyHppOwnership,
    updateMenuResep
);

/**
 * @swagger
 * /resep/{menu_id}/{bahan_id}:
 *   delete:
 *     summary: Menghapus bahan dari resep menu
 *     tags: [Resep]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menu_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *       - in: path
 *         name: bahan_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bahan
 *     responses:
 *       200:
 *         description: Bahan berhasil dihapus dari resep
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
 *                   example: Bahan berhasil dihapus dari resep
 *                 data:
 *                   $ref: '#/components/schemas/RecipeResponse'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu atau bahan tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete(
    "/:menu_id/:bahan_id", 
    validateMenuId,
    validateBahanId,
    verifyHppOwnership,
    deleteMenuResep
);

export default router;