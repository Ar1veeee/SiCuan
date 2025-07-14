import { Bahan, MenuBahan } from "@prisma/client";
import { ulid } from "ulid";
import DatabaseService from "../config/database.config";

const prisma = DatabaseService.getInstance()

const SalesModel = {
    getSummary: async (userId: string) => {
        const summary = await prisma.sales.aggregate({
            where: {
                userId: userId,
            },
            _sum: {
                income: true,
                profit: true,
            },
        });

        return {
            totalPenjualan: summary._sum.income || 0,
            totalKeuntungan: summary._sum.profit || 0,
        };
    },
    
    findSalesByIdAndUserId: async (
        userId: string,
        salesId: string,
    ) => {
        return await prisma.sales.findFirst({
            where: {
                userId,
                id: salesId
            }
        })
    },

    findSalesByDate: async (userId: string, startDate: Date, endDate: Date) => {
        return await prisma.sales.findMany({
            where: {
                userId,
                tanggal: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                menu: {
                    select: {
                        nama_menu: true
                    }
                }
            },
            orderBy: {
                tanggal: 'desc'
            }
        })
    },

    executeSalesTransaction: async (
        userId: string,
        menuId: string,
        salesData: any,
        recipe: (MenuBahan & { bahan: Bahan })[]
    ) => {
        return await prisma.$transaction(async (tx) => {
            const sales = await tx.sales.create({
                data: {
                    id: ulid(),
                    userId,
                    menuId,
                    tanggal: new Date(salesData.tanggal),
                    harga_jual: salesData.harga_jual,
                    jumlah_laku: salesData.jumlah_laku,
                    hpp: salesData.hpp,
                    income: salesData.income,
                    profit: salesData.profit,
                    keterangan: salesData.keterangan
                }
            })

            for (const recipeItem of recipe) {
                const lessQuantity = (recipeItem.jumlah_digunakan || 0) * salesData.jumlah_laku;

                await tx.bahan.update({
                    where: { id: recipeItem.bahanId },
                    data: {
                        jumlah: {
                            decrement: lessQuantity
                        }
                    }
                })

                await tx.stockTransaction.create({
                    data: {
                        id: ulid(),
                        userId,
                        bahanId: recipeItem.bahanId,
                        jumlah: lessQuantity,
                        jenis_transaksi: 'PENJUALAN',
                        keterangan: `Penjualan menu "${salesData.nama_menu}" (${salesData.jumlah_laku} porsi)`
                    }
                })
            }
            return sales
        })
    },

    deleteSalesByIdAndUserId: async (userId: string, salesId: string) => {
        return await prisma.sales.deleteMany({
            where: {
                userId,
                id: salesId,
            }
        })
    }
}

export default SalesModel;