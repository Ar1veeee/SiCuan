import {z} from "zod"

export const bahanSchema = z.object({
    nama_bahan: z.string().nonempty('Nama bahan wajib diisi'),
    harga_beli: z.string().nonempty('Harga beli wajib diisi'),
    jumlah: z.string().nonempty('Jumlah wajib diisi'),
    satuan: z.string().nonempty('Satuan wajib diisi'),
    jumlah_digunakan: z.string().nonempty('Jumlah digunakan wajib diisi'),
})