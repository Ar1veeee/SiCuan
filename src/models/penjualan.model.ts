import { PrismaClient } from "@prisma/client";
import { ApiError } from "../exceptions/ApiError";
import { ulid } from "ulid";
import { PenjualanData, PenjualanRequest } from "../types/penjualan.type";
import { StockData } from "../types/stock.type";
const prisma = new PrismaClient()

const toDomainModel = (prismaPenjualan: any): PenjualanData => {
    return {
        id: prismaPenjualan.id,
        userId: prismaPenjualan.userId,
        menuId: prismaPenjualan.menuId,
        harga_jual: prismaPenjualan.harga_jual,
        jumlah_laku: prismaPenjualan.jumlah_laku,
        income: prismaPenjualan.income,
        profit: prismaPenjualan.profit,
        keterangan: prismaPenjualan.keterangan ?? '',
        createdAt: prismaPenjualan.createdAt,
        updateAt: prismaPenjualan.updateAt,
    }
}

const PenjualanModel = {
    createSalesTransaction: async (
        userId: string,
        data: PenjualanRequest
    ): Promise<StockData> => {
        const result =await
    }
}