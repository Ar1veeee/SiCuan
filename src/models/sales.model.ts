import { PrismaClient, Sales } from "@prisma/client";
import { ApiError } from "../exceptions/ApiError";
import { ulid } from "ulid";
import { SalesData } from "../types/sales.type";
const prisma = new PrismaClient()

const SalesModel = {
    createSalesWithStockUpdate: async (data: SalesData) => {
        const {
            userId,
            nama_menu,
            tanggal = new Date(),
            harga_jual,
            jumlah_laku,
            hpp,
            keterangan
        } = data;

        return await prisma.$transaction(async (tx) => {
            const menu = await tx.menu.findUnique({
                where: {
                    userId_nama_menu: {
                        userId,
                        nama_menu
                    }
                },
                include: {
                    bahanList: {
                        include: {
                            bahan: true
                        }
                    }
                }
            });

            if (!menu) {
                throw new ApiError(`Menu dengan nama${nama_menu} tidak ditemukan`, 404);
            };

            for (const menuBahan of menu.bahanList) {
                const totalNeeded = (menuBahan.jumlah || 0) * jumlah_laku;

                if (totalNeeded > menuBahan.bahan.jumlah) {
                    throw new ApiError(
                        `Bahan ${menuBahan.bahan.nama_bahan} tidak cukup untuk membuat ${jumlah_laku} porsi ${nama_menu}.` +
                        `Dibutuhkan ${totalNeeded} ${menuBahan.bahan.satuan} tersedia ${menuBahan.bahan.jumlah} ${menuBahan.bahan.satuan}`,
                        400);
                }
            };

            const hppUsed = hpp || menu.hpp || 0;
            const income = harga_jual * jumlah_laku;
            const profit = (harga_jual - hppUsed) * jumlah_laku;

            const sales = await tx.sales.create({
                data: {
                    id: ulid(),
                    userId,
                    menuId: menu.id,
                    tanggal,
                    harga_jual,
                    jumlah_laku,
                    hpp: hppUsed,
                    income,
                    profit,
                    keterangan
                }
            });

            for (const menuBahan of menu.bahanList) {
                const lessQuantity = (menuBahan.jumlah || 0) * jumlah_laku;

                await tx.bahan.update({
                    where: {
                        id: menuBahan.bahanId
                    },
                    data: {
                        jumlah: {
                            decrement: lessQuantity
                        }
                    }
                });

                await tx.stockTransaction.create({
                    data: {
                        id: ulid(),
                        userId,
                        bahanId: menuBahan.bahanId,
                        jumlah: -lessQuantity,
                        jenis_transaksi: "keluar",
                        keterangan: `Penggunaan bahan untuk penjualan menu "${nama_menu}" sebanyak ${jumlah_laku} porsi`
                    }
                });
            }
            return sales;
        });
    },

    getSalesById: async (salesId: string, userId: string) => {
        const sales = await prisma.sales.findUnique({
            where: {
                id: salesId,
                userId
            },
            include: {
                menu: {
                    include: {
                        bahanList: {
                            include: {
                                bahan: true
                            }
                        }
                    }
                }
            }
        });

        if (!sales) {
            throw new ApiError("Data penjualan tidak ditemukan", 404);
        }
        return sales;
    },

    getSalesReport: async (userId: string, startDate: Date, endDate: Date) => {
        const whereClause: any = { userId };

        if (startDate || endDate) {
            whereClause.tanggal = {};
            if (startDate) whereClause.tanggal.gte = startDate;
            if (endDate) whereClause.tanggal.lte = endDate;
        }

        const sales = await prisma.sales.findMany({
            where: whereClause,
            include: {
                menu: true
            },
            orderBy: {
                tanggal: 'desc'            }
        });

        const totalIncome = sales.reduce((sum, sale) => sum + (sale.income || 0), 0);
        const totalProfit = sales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

        return {
            sales,
            summary: {
                totalTransactions: sales.length,
                totalIncome,
                totalProfit
            }
        }
    },

    checkStockAvailability: async (userId: string, nama_menu: string, jumlah_laku: number) => {
        const menu = await prisma.menu.findUnique({
            where: {
                userId_nama_menu: {
                    userId,
                    nama_menu
                }
            },
            include: {
                bahanList: {
                    include: {
                        bahan: true
                    }
                }
            }
        });
        
        if (!menu) {
            throw new ApiError(`Menu dengan nama ${nama_menu} tidak ditemukan`, 404)
        }

        const stockCheck = menu.bahanList.map((menuBahan) => {
            const totalNeeded = (menuBahan.jumlah || 0) * jumlah_laku;
            const isAvailable = totalNeeded <= menuBahan.bahan.jumlah;

            return {
                nama_bahan: menuBahan.bahan.nama_bahan,
                kebutuhan: totalNeeded,
                tersedia: menuBahan.bahan.jumlah,
                satuan: menuBahan.bahan.satuan,
                cukup: isAvailable
            };
        });

        const allAvailable = stockCheck.every((item) => item.cukup)

        return {
            available: allAvailable,
            details: stockCheck
        }
    }
}

export default SalesModel;