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
 *         userId:
 *           type: string
 *           description: ID user (ULID)
 *         nama_bahan:
 *           type: string
 *           description: Nama bahan
 *         jumlah:
 *           type: number
 *           description: Jumlah bahan yang digunakan per porsi
 *         harga_beli:
 *           type: number
 *           description: Harga beli per satuan
 *         satuan:
 *           type: string
 *           description: Satuan bahan
 *         minimum_stock:
 *           type: number
 *           description: Stock minimum untuk alert
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembaruan terakhir
 *         menuBahan:
 *           type: array
 *           properties:
 *             jumlah:
 *               type: number
 *               description: Stok tersedia
 *       example:
 *         id: 01JWQ4W8NNKQ7YNDCVNHP3CRA1
 *         userId: 01JWQ4W8NNKQ7YNDCVNHP3CRA2
 *         nama_bahan: Beras
 *         jumlah_digunakan: 0.2
 *         harga_beli: 15000
 *         satuan: kg
 *         minimum_stock: 1
 *         createdAt: 2023-07-20T10:30:00Z
 *         updatedAt: 2023-07-20T10:30:00Z
 *         menuBahan:
 *           jumlah: 5
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: ID bahan (ULID)
 *                           userId:
 *                             type: string
 *                             description: ID user (ULID)
 *                           nama_bahan:
 *                             type: string
 *                             description: Nama bahan
 *                           jumlah:
 *                             type: number
 *                             description: Jumlah stok bahan yang dibeli
 *                           harga_beli:
 *                             type: number
 *                             description: Harga beli per satuan
 *                           satuan:
 *                             type: string
 *                             description: Satuan bahan
 *                           minimum_stock:
 *                             type: number
 *                             description: Stock minimum untuk alert
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Tanggal pembuatan
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Tanggal pembaruan terakhir
 *                           menuBahan:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 jumlah:
 *                                   type: number
 *                                   description: Jumlah bahan yang digunakan dalam resep
 *               example:
 *                 success: true
 *                 message: Success
 *                 data:
 *                   recipes:
 *                     - id: 01JWR2R8PX5423TSEZ4AYX2Z0V
 *                       userId: 01JWR1RQRVABYV4PRFCDRPRSCF
 *                       nama_bahan: Cup
 *                       jumlah: 30
 *                       harga_beli: 25000
 *                       satuan: pcs
 *                       minimum_stock: 0
 *                       createdAt: 2025-06-02T10:24:48.350Z
 *                       updatedAt: 2025-06-02T10:24:48.350Z
 *                       menuBahan:
 *                         - jumlah: 1
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
 *                       example: Bahan berhasil ditambahkan
 *               example:
 *                 success: true
 *                 message: Resource created successfully
 *                 data:
 *                   message: Bahan berhasil ditambahkan
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
 *                 summary: Bahan sudah ada
 *                 value:
 *                   success: false
 *                   message: Bahan sudah ada
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
 *         description: Bahan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Bahan tidak ditemukan
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Bahan berhasil diperbarui
 *               example:
 *                 success: true
 *                 message: Success
 *                 data:
 *                  message: Bahan berhasil diperbarui
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Bahan berhasil dihapus
 *               example:
 *                 success: true
 *                 message: Success
 *                 data:
 *                  message: Bahan berhasil dihapus
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