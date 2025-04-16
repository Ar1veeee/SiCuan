import Hpp from "../models/HppModel";
import { ApiError } from "../exceptions/apiError";
import {  validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";

export const addUserResep = async (
  userId: number,
  menuId: number,
  bahan: {
      nama: string,
      harga_beli: number,
      jumlah: number,
      satuan: string,
      jumlah_digunakan: number
  }
): Promise<any> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const existingBahan = await Hpp.existingResep(menuId, bahan.nama);
  if (existingBahan) {
      throw new ApiError("Resep sudah ada", 400);
  }

  await Hpp.createResep({
      nama: bahan.nama,
      harga_beli: bahan.harga_beli,
      jumlah: bahan.jumlah,
      satuan: bahan.satuan,
      menuId,
      jumlah_digunakan: bahan.jumlah_digunakan,
  });

  return "Resep Berhasil Ditambahkan";
};