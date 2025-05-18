import HppModel from "../models/hpp.model";
import { ApiError } from "../exceptions/ApiError";
import { validateUserExists } from "../validators/UserValidator";
import { validateMenuOwnership } from "../validators/MenuValidator";

interface ResepResponse {
  message: string;
}

export const createRecipeService = async (
  userId: number,
  menuId: number,
  bahan: {
    nama_bahan: string,
    harga_beli: number,
    jumlah: number,
    satuan: string,
    jumlah_digunakan: number
  }
): Promise<ResepResponse> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const existing = await HppModel.existingResep(menuId, bahan.nama_bahan);
  if (existing) {
    throw new ApiError("Resep sudah ada", 400);
  }
  
  await HppModel.createBahanWithMenuLink({
    nama: bahan.nama_bahan,
    harga_beli: bahan.harga_beli,
    jumlah: bahan.jumlah,
    satuan: bahan.satuan,
    menuId,
    jumlah_digunakan: bahan.jumlah_digunakan,
    userId, // Pass the userId to the model function
  });

  await HppModel.updateTotalHPP(menuId);
  return { message: "Resep Berhasil Ditambahkan" }
};

export const deleteRecipeService = async (userId: number, menuId: number, bahanId: number): Promise<ResepResponse> => {
  await validateUserExists(userId);
  const deleted = await HppModel.deleteMenuResep(userId, menuId, bahanId)
  if (!deleted) {
    throw new ApiError("Bahan gagal dihapus", 400)
  }
  return { message: "Bahan Berhasil Dihapus" }
}

export const updateRecipeService = async (userId: number, menuId: number, bahanId: number, bahan: {
  nama_bahan: string,
  harga_beli: number,
  jumlah: number,
  satuan: string,
  jumlah_digunakan: number
}): Promise<ResepResponse> => {
  await validateUserExists(userId);
  await validateMenuOwnership(userId, menuId);

  const updated = await HppModel.updateMenuResep(userId, menuId, bahanId, {
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

  await HppModel.updateTotalHPP(menuId);

  return { message: "Resep Berhasil Diperbarui" }
}