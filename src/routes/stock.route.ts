import { Router } from "express";
const router = Router();
import { 
    getStocks, 
    getStockDetail,
    updateStock,
    deleteStock, 
} from "../controllers/stock.controller";
import verifyToken from "../middlewares/auth.middleware";
import { 
    validateStockId, 
    verifyStockOwnership 
} from "../middlewares/stock.middleware";
import { validate } from "../middlewares/validate.middleware";
import { stockSchema } from "../validators/StockValidator";

/**
 * @swagger
 * components:
 *   schemas:
 *     StockRequest:
 *       type: object
 *       required:
 *         - jumlah
 *         - jenis_transaksi
 *         - keterangan
 *       properties:
 *         jumlah:
 *           type: number
 *           description: Jumlah stok
 *         jenis_transaksi:
 *           type: string
 *           enum: [Masuk, Keluar, Penyesuaian]
 *           description: Jenis transaksi stok
 *         keterangan:
 *           type: string
 *           description: Keterangan tambahan
 *       example:
 *         jumlah: 10
 *         jenis_transaksi: Masuk
 *         keterangan: Restok beras
 *     
 *     StockData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID transaksi stok (ULID)
 *         userId:
 *           type: string
 *           description: ID pengguna pemilik stok (ULID)
 *         bahanId:
 *           type: string
 *           description: ID bahan (ULID)
 *         nama_bahan:
 *           type: string
 *           description: Nama bahan
 *         jumlah:
 *           type: number
 *           description: Jumlah stok
 *         jenis_transaksi:
 *           type: string
 *           enum: [Masuk, Keluar, Penyesuaian]
 *           description: Jenis transaksi stok
 *         keterangan:
 *           type: string
 *           description: Keterangan tambahan
 *         createdAt:
 *           type: string
 *           description: Tanggal pembuatan (formatted)
 *         updatedAt:
 *           type: string
 *           description: Tanggal pembaruan (formatted)
 *       example:
 *         id: 01JWQ4W8NNKQ7YNDCVNHP3CRA1
 *         userId: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *         bahanId: 01JWQ4W8NNKQ7YNDCVNHP3CRA3
 *         nama_bahan: Beras
 *         jumlah: 10
 *         jenis_transaksi: Masuk
 *         keterangan: Restok beras
 *         createdAt: 20 Juli 2023, 10:30
 *         updatedAt: 20 Juli 2023, 10:30
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
 * /stock:
 *   get:
 *     summary: Mendapatkan semua transaksi stok pengguna
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar stok berhasil diambil
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
 *                   example: Daftar stok berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     stocks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StockData'
 *               example:
 *                 success: true
 *                 message: Daftar stok berhasil diambil
 *                 data:
 *                   stocks:
 *                     - id: 01JWQ4W8NNKQ7YNDCVNHP3CRA1
 *                       userId: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *                       bahanId: 01JWQ4W8NNKQ7YNDCVNHP3CRA3
 *                       nama_bahan: Beras
 *                       jumlah: 10
 *                       jenis_transaksi: Masuk
 *                       keterangan: Restok beras
 *                       createdAt: 20 Juli 2023, 10:30
 *                       updatedAt: 20 Juli 2023, 12:30
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
router.get("/", getStocks);

/**
 * @swagger
 * /stock/{stock_id}:
 *   get:
 *     summary: Mendapatkan detail transaksi stok
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID transaksi stok (ULID format)
 *     responses:
 *       200:
 *         description: Detail stok berhasil diambil
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
 *                   example: Detail stok berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     stock:
 *                       $ref: '#/components/schemas/StockData'
 *               example:
 *                 success: true
 *                 message: Detail stok berhasil diambil
 *                 data:
 *                   stock:
 *                     id: 01JWQ4W8NNKQ7YNDCVNHP3CRA1
 *                     userId: 01JWQ4VJ6GN4A16CGPMGMJHJDD
 *                     bahanId: 01JWQ4W8NNKQ7YNDCVNHP3CRA3
 *                     nama_bahan: Beras
 *                     jumlah: 10
 *                     jenis_transaksi: Masuk
 *                     keterangan: Restok beras
 *                     createdAt: 20 Juli 2023, 10:30
 *                     updatedAt: 20 Juli 2023, 12:30
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
 *         description: Stok tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Stok tidak ditemukan
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
router.get("/:stock_id", validateStockId, getStockDetail);

/**
 * @swagger
 * /stock/{stock_id}:
 *   patch:
 *     summary: Memperbarui transaksi stok
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID transaksi stok (ULID format)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockRequest'
 *     responses:
 *       200:
 *         description: Stok berhasil diperbarui
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
 *                   example: Stok berhasil diperbarui
 *               example:
 *                 success: true
 *                 message: Stok berhasil diperbarui
 *       400:
 *         description: Data tidak valid atau jumlah stok tidak cukup
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
 *               insufficientStock:
 *                 summary: Stok tidak cukup
 *                 value:
 *                   success: false
 *                   message: Jumlah tidak cukup. Stok Beras saat ini adalah 5
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
 *         description: Stok tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Stok tidak ditemukan
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
    "/:stock_id", 
    validate(stockSchema),
    validateStockId,
    verifyStockOwnership,
    updateStock
);

/**
 * @swagger
 * /stock/{stock_id}:
 *   delete:
 *     summary: Menghapus transaksi stok
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID transaksi stok (ULID format)
 *     responses:
 *       200:
 *         description: Stok berhasil dihapus
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
 *                   example: Stok berhasil dihapus
 *               example:
 *                 success: true
 *                 message: Stok berhasil dihapus
 *       400:
 *         description: Gagal menghapus stok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Gagal menghapus stok
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
 *         description: Stok tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Stok tidak ditemukan
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
    "/:stock_id",
    validateStockId,
    verifyStockOwnership,
    deleteStock
);

export default router;