"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bahanSchema = void 0;
const zod_1 = require("zod");
exports.bahanSchema = zod_1.z.object({
    nama_bahan: zod_1.z.string().nonempty('Nama bahan wajib diisi'),
    harga_beli: zod_1.z.number().min(1, 'Harga beli harus lebih dari 0'),
    jumlah: zod_1.z.number().min(1, 'Jumlah harus lebih dari 0'),
    satuan: zod_1.z.string().nonempty('Satuan wajib diisi'),
    jumlah_digunakan: zod_1.z.number().min(1, 'Jumlah yang digunakan harus lebih dari 0'),
});
