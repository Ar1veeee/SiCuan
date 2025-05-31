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
    nama: z.string().nonempty('Nama stok wajib diisi'),
    jumlah: z.number().min(1, 'Jumlah harus lebih dari 0'),
    jenis_transaksi: z.string().nonempty('Jenis transaksi stok wajib diisi'),
    keterangan: z.string().nonempty('Keterangan stok wajib diisi'),
})