import Hpp from "../models/HppModel";
import { ApiError } from "../exceptions/apiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";

export const addUserResep = async (
  userId: number,
  menuId: number,
  bahan: {
    nama_bahan: string,
    harga_beli: number,
    jumlah: number,
    satuan: string,
    jumlah_digunakan: number
  }
): Promise<any> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const existing = await Hpp.existingResep(menuId, bahan.nama_bahan);
  if (existing) {
    throw new ApiError("Resep sudah ada", 400);
  }

  await Hpp.createBahanWithMenuLink({
    nama: bahan.nama_bahan,
    harga_beli: bahan.harga_beli,
    jumlah: bahan.jumlah,
    satuan: bahan.satuan,
    menuId,
    jumlah_digunakan: bahan.jumlah_digunakan,
  });

  await Hpp.updateTotalHPP(menuId);

  return "Resep Berhasil Ditambahkan";
};

export const deleteUserMenuResep = async (userId: number, menuId: number, bahanId: number): Promise<any> => {
  await validateUserExists(userId);
  const deleted = await Hpp.deleteMenuResep(userId, menuId, bahanId)
  if (!deleted) {
    throw new ApiError("Bahan gagal dihapus", 400)
  }
  return "Bahan Berhasil Dihapus"
}

export const updateUserMenuResep = async (userId: number, menuId: number, bahanId: number, bahan: {
  nama_bahan: string,
  harga_beli: number,
  jumlah: number,
  satuan: string,
  jumlah_digunakan: number
}): Promise<any> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const updated = await Hpp.updateMenuResep(userId, menuId, bahanId, {
    nama: bahan.nama_bahan,
    harga_beli: bahan.harga_beli,
    jumlah: bahan.jumlah,
    satuan: bahan.satuan,
    menuId,
    jumlah_digunakan: bahan.jumlah_digunakan,
  });

  if (!updated) {
    throw new ApiError("Resep Gagal Diperbarui", 400)
  }

  await Hpp.updateTotalHPP(menuId);

  return "Resep Berhasil Diperbarui";
}