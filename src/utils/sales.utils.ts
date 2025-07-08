import { ApiError } from "../exceptions/ApiError";
import { MenuWithRecipe } from "../types/sales.type";

export const validateStockAvailability = async (menu: MenuWithRecipe, jumlah_laku: number) => {
    for (const resepItem of menu.bahanList) {
        const totalDibutuhkan = (resepItem.jumlah_digunakan || 0) * jumlah_laku;
        if (totalDibutuhkan > resepItem.bahan.jumlah) {
            throw new ApiError(
                `Stok ${resepItem.bahan.nama_bahan} tidak cukup. Dibutuhkan: ${totalDibutuhkan}, Tersedia: ${resepItem.bahan.jumlah}.`,
                400
            );
        }
    }
}

export const calculateFinancials = (menu: MenuWithRecipe, jumlah_laku: number) => {
    const hppMenu = menu.hpp || 0;
    const hargaJualMenu = menu.harga_jual || 0;
    return {
        hpp: hppMenu,
        harga_jual: hargaJualMenu,
        income: hargaJualMenu * jumlah_laku,
        profit: (hargaJualMenu - hppMenu) * jumlah_laku,
    };
}