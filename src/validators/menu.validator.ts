import {z} from "zod"

export const menuBodySchema = z.object({
    nama_menu: z.string({
        required_error: "Nama menu wajib diisi",
        invalid_type_error: "Nama menu harus berupa teks"
    }).min(3, 'Nama menu minimal 3 karakter')
})