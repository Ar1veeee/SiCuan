import { z } from "zod";

export const sellSchema = z.object({
  nama_menu: z.string().nonempty("Nama menu wajib diisi."),
  keuntungan: z.number().min(1, "Keuntungan harus lebih dari 0."),
});
