import Stock from "../models/stock.model";
import { ApiError } from "../exceptions/ApiError";
import {z} from "zod";

export const validateStockOwnership = async (userId: string, stockId: string) => {
    const stock = await Stock.findStockTransactionByIdAndUserId(userId, stockId);
    if (!stock) {
        throw new ApiError("Stok tidak dapat ditemukan", 400)
    }
    return stock
}

export const stockSchema = z.object({
    jumlah: z.number().min(1, 'Jumlah harus lebih dari 0'),
    jenis_transaksi: z.string().nonempty('Jenis transaksi stok wajib diisi'),
})