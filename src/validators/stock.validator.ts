import { z } from "zod";

export const stockSchema = z.object({
    nama_bahan: z.string().nonempty('Nama bahan wajib diisi'),
    jumlah: z.number().positive("Jumlah harus angka positif."),
    jenis_transaksi: z.enum(['PEMBELIAN', 'PENJUALAN', 'PENYESUAIAN'], {
        errorMap: () => ({ message: "Jenis transaksi tidak valid." })
    }),
    minimum_stock: z.number().min(1, 'Minimal stok harus lebih dari 0'),
    keterangan: z.string().optional(),
})