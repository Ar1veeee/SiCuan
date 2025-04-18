import { z } from "zod"

export const bahanSchema = z.object({
    nama_bahan: z.string().nonempty('Nama bahan wajib diisi'),
    harga_beli: z.number().min(1, 'Harga beli harus lebih dari 0'),
    jumlah: z.number().min(1, 'Jumlah harus lebih dari 0'),
    satuan: z.string().nonempty('Satuan wajib diisi'),
    jumlah_digunakan: z.number().min(1, 'Jumlah yang digunakan harus lebih dari 0'),
})