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
 *     BahanRequest:
 *       type: object
 *       required:
 *         - nama_bahan
 *         - harga_beli
 *         - jumlah
 *         - satuan
 *         - jumlah_digunakan
 *         - minimum_stock
 *       properties:
 *         nama_bahan:
 *           type: string
 *           description: Nama bahan
 *         harga_beli:
 *           type: number
 *           description: Harga beli per satuan
 *         jumlah:
 *           type: number
 *           description: Jumlah stok bahan yang dibeli
 *         satuan:
 *           type: string
 *           description: Satuan bahan (gram, kg, liter, pcs, dll)
 *         jumlah_digunakan:
 *           type: number
 *           description: Jumlah bahan yang digunakan dalam resep per porsi
 *         minimum_stock:
 *           type: number
 *           description: Minimum stok untuk alert
 *       example:
 *         nama_bahan: Beras
 *         harga_beli: 15000
 *         jumlah: 5
 *         satuan: kg
 *         jumlah_digunakan: 0.2
 *         minimum_stock: 1
 *     
 *     RecipeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID resep (ULID)
 *         menuId:
 *           type: string
 *           description: ID menu (ULID)
 *         bahanId:
 *           type: string
 *           description: ID bahan (ULID)
 *         nama_bahan:
 *           type: string
 *           description: Nama bahan
 *         jumlah_digunakan:
 *           type: number
 *           description: Jumlah bahan yang digunakan per porsi
 *         harga_beli:
 *           type: number
 *           description: Harga beli per satuan
 *         satuan:
 *           type: string
 *           description: Satuan bahan
 *         biaya:
 *           type: number
 *           description: Total biaya untuk resep (jumlah_digunakan * harga_beli)
 *         bahan:
 *           type: object
 *           properties:
 *             nama_bahan:
 *               type: string
 *             jumlah:
 *               type: number
 *               description: Stok tersedia
 *             minimum_stock:
 *               type: number
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
 *         menuId: 01JWQ4W8NNKQ7YNDCVNHP3CRA2
 *         bahanId: 01JWQ4W8NNKQ7YNDCVNHP3CRA3
 *         nama_bahan: Beras
 *         jumlah_digunakan: 0.2
 *         harga_beli: 15000
 *         satuan: kg
 *         biaya: 3000
 *         bahan:
 *           nama_bahan: Beras
 *           jumlah: 5
 *           minimum_stock: 1
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
 *           type: string
 *         description: ID menu (ULID format)
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
 *                 message:
 *                   type: string
 *                   example: Resep berhasil diambil
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
 *               example:
 *                 success: true
 *                 message: Resep berhasil diambil
 *                 data:
 *                   recipes:
 *                     - id: 01JWQ4W8NNKQ7YNDCVNHP3CRA1
 *                       menuId: 01JWQ4W8NNKQ7YNDCVNHP3CRA2
 *                       bahanId: 01JWQ4W8NNKQ7YNDCVNHP3CRA3
 *                       nama_bahan: Beras
 *                       jumlah_digunakan: 0.2
 *                       biaya: 3000
 *                   total_hpp: 25000
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
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
 *           type: string
 *         description: ID menu (ULID format)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BahanRequest'
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
 *             examples:
 *               validationError:
 *                 summary: Data tidak valid
 *                 value:
 *                   success: false
 *                   message: Validation error
 *               recipeExists:
 *                 summary: Resep sudah ada
 *                 value:
 *                   success: false
 *                   message: Resep sudah ada
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
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
 *           type: string
 *         description: ID menu (ULID format)
 *       - in: path
 *         name: bahan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID bahan (ULID format)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BahanRequest'
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
 *                   example: Resep berhasil diperbarui
 *               example:
 *                 success: true
 *                 message: Resep berhasil diperbarui
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
 *               updateFailed:
 *                 summary: Gagal memperbarui
 *                 value:
 *                   success: false
 *                   message: Resep gagal diperbarui
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
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
 *         description: Menu atau bahan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Menu atau bahan tidak ditemukan
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
 *           type: string
 *         description: ID menu (ULID format)
 *       - in: path
 *         name: bahan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID bahan (ULID format)
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
 *                   example: Bahan berhasil dihapus
 *               example:
 *                 success: true
 *                 message: Bahan berhasil dihapus
 *       400:
 *         description: Gagal menghapus bahan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Bahan gagal dihapus
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
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
 *         description: Menu atau bahan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Menu atau bahan tidak ditemukan
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
    "/:menu_id/:bahan_id", 
    validateMenuId,
    validateBahanId,
    verifyHppOwnership,
    deleteMenuResep
);

export default router;