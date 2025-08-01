import { z } from "zod";

export const salesSchema = z.object({
  nama_menu: z.string().nonempty("Nama menu wajib diisi"),
  tanggal: z
    .string()
    .datetime("Format tanggal harus ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"),
  jumlah_laku: z.number().positive("Jumlah yang digunakan harus angka positif"),
  keterangan: z.string().optional(),
});

export const getSalesQuerySchema = z
  .object({
    startDate: z
      .string()
      .datetime("Format tanggal harus ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"),

    endDate: z
      .string()
      .datetime("Format tanggal harus ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
    },
    {
      message: "Tanggal mulai harus lebih kecil dari tanggal akhir.",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const sevenDaysInMiliseconds = 7 * 24 * 60 * 60 * 1000;

        const diffTime = endDate.getTime() - startDate.getTime();
        return diffTime <= sevenDaysInMiliseconds;
      }
      return true;
    },
    {
      message: "Rentang tanggal maksimal 7 hari.",
      path: ["startDate"],
    }
  );
