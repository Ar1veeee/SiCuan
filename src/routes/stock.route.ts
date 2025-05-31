import { Router } from "express";
const router = Router();
import { 
    createStock, 
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
 *         - nama
 *         - jumlah
 *         - jenis_transaksi
 *       properties:
 *         nama:
 *           type: string
 *           description: Nama stok/bahan
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
 *         nama: Beras
 *         jumlah: 10
 *         jenis_transaksi: Masuk
 *         keterangan: Restok beras
 *     
 *     StockResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: ID transaksi stok
 *         userId:
 *           type: number
 *           description: ID pengguna pemilik stok
 *         nama:
 *           type: string
 *           description: Nama stok/bahan
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
 *         tanggal:
 *           type: string
 *           format: date-time
 *           description: Tanggal transaksi
 *         tanggalFormatted:
 *           type: string
 *           description: Tanggal transaksi yang diformat
 *       example:
 *         id: 1
 *         userId: 1
 *         nama: Beras
 *         jumlah: 10
 *         jenis_transaksi: Masuk
 *         keterangan: Restok beras
 *         tanggal: 2023-07-20T10:30:00Z
 *         tanggalFormatted: 20 Juli 2023, 10:30
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     stocks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StockResponse'
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
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
 *           type: integer
 *         description: ID transaksi stok
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     stock:
 *                       $ref: '#/components/schemas/StockResponse'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Stok tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get("/:stock_id", validateStockId, getStockDetail);

/**
 * @swagger
 * /stock:
 *   post:
 *     summary: Menambah transaksi stok baru
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockRequest'
 *     responses:
 *       201:
 *         description: Stok berhasil ditambahkan
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
 *                   example: Stok berhasil ditambahkan
 *                 data:
 *                   $ref: '#/components/schemas/StockResponse'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */
router.post("/", validate(stockSchema), createStock);

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
 *           type: integer
 *         description: ID transaksi stok
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
 *                 data:
 *                   $ref: '#/components/schemas/StockResponse'
 *       400:
 *         description: Data tidak valid atau jumlah stok tidak cukup
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Stok tidak ditemukan
 *       500:
 *         description: Server error
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
 *           type: integer
 *         description: ID transaksi stok
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
 *                 data:
 *                   $ref: '#/components/schemas/StockResponse'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Stok tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete(
    "/:stock_id",
    validateStockId,
    verifyStockOwnership,
    deleteStock
);

export default router;