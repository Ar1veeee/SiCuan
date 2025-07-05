import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";
import { CreateStockTransactionRequest } from "../types/stock.type";
import { count } from "console";
import { bigint } from "zod";

const prisma = new PrismaClient();

const StockModel = {
    /**
     * Memperbarui transaksi stok
     */
    createTransactionAndUpdateBahan: async (
        userId: string,
        bahanId: string,
        data: CreateStockTransactionRequest
    ) => {
        return prisma.$transaction(async (tx) => {
            let jumlahPerubahan = data.jumlah;
            if (data.jenis_transaksi === 'PENJUALAN') {
                jumlahPerubahan = -data.jumlah;
            }

            if (data.jenis_transaksi === 'PENYESUAIAN') {
                const bahanSaatIni = await tx.bahan.findUniqueOrThrow({ where: { id: bahanId } });
                jumlahPerubahan = data.jumlah - bahanSaatIni.jumlah;
            }

            const bahanDiupdate = await tx.bahan.update({
                where: { id: bahanId },
                data: {
                    nama_bahan: data.nama_bahan,
                    jumlah: {
                        increment: jumlahPerubahan
                    },
                    minimum_stock: data.minimum_stock,
                }
            });

            await tx.stockTransaction.create({
                data: {
                    id: ulid(),
                    userId,
                    bahanId,
                    jenis_transaksi: data.jenis_transaksi,
                    jumlah: data.jumlah,
                    keterangan: data.keterangan,
                }
            });

            return bahanDiupdate;
        });
    },

    findBahanByUserId: async (
        userId: string
    ) => {
        return await prisma.bahan.findMany({
            where: {
                userId
            }
        })
    },

    findBahanByName: async (
        userId: string,
        nama_bahan: string,
    ) => {
        return await prisma.bahan.findFirst({
            where: {
                userId,
                nama_bahan: nama_bahan
            }
        })
    },

    findBahanByIdAndUserId: async (
        userId: string,
        bahanId: string
    ) => {
        return await prisma.bahan.findFirst({
            where: {
                id: bahanId,
                userId
            },
            include: {
                stockTransactions: {
                    select: {
                        jenis_transaksi: true,
                        jumlah: true,
                        keterangan: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                }
            }
        })
    },

    getSummary: async (userId: string) => {
        const totalBahanPromise = prisma.bahan.count({
            where: { userId }
        });

        const hampirHabisPromise = await prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count FROM Bahan
            WHERE userId = ${userId}
            AND minimum_stock IS NOT NULL
            AND minimum_stock > 0
            AND jumlah <= minimum_stock
        `;

        const [totalBahan] = await Promise.all([
            totalBahanPromise,
        ]);

        const hampirHabis = Number(hampirHabisPromise[0]?.count || 0);

        return {
            totalBahan,
            hampirHabis,
        };
    }

    // /**
    //  * Menghapus transaksi stok
    //  */
    // deleteStockTransaction: async (
    //     stockId: string
    // ) => {
    //     const result = await prisma.stockTransaction.delete({
    //         where: { id: stockId },
    //         include: {
    //             bahan: true
    //         }
    //     });
    //     return toDomainModel(result);
    // },

    // /**
    //  * Mencari semua transaksi stok berdasarkan userId
    //  */
    // findStockTransactionByUserId: async (userId: string): Promise<StockData[]> => {
    //     const results = await prisma.stockTransaction.findMany({
    //         where: { userId },
    //         include: {
    //             bahan: true
    //         },
    //         orderBy: {
    //             createdAt: 'desc'
    //         }
    //     });
    //     return results.map(toDomainModel);
    // },

    // /**
    //  * Mencari transaksi stok berdasarkan id dan userId
    //  */
    // findStockTransactionByIdAndUserId: async (
    //     userId: string,
    //     stockTransactionId: string
    // ): Promise<StockData | null> => {
    //     const result = await prisma.stockTransaction.findFirst({
    //         where: {
    //             userId,
    //             id: stockTransactionId
    //         },
    //         include: {
    //             bahan: true
    //         }
    //     });
    //     return result ? toDomainModel(result) : null;
    // },

    // /**
    //  * Mendapatkan ringkasan stok per bahan (aggregated)
    //  */
    // getStockSummaryByUserId: async (userId: string) => {
    //     const results = await prisma.stockTransaction.findMany({
    //         where: { userId },
    //         include: {
    //             bahan: true
    //         },
    //         orderBy: {
    //             createdAt: 'asc'
    //         }
    //     });

    //     const stockSummary = new Map();

    //     results.forEach(transaction => {
    //         const bahanId = transaction.bahanId;
    //         const namaBahan = transaction.bahan?.nama_bahan || '';

    //         if (!stockSummary.has(bahanId)) {
    //             stockSummary.set(bahanId, {
    //                 bahanId,
    //                 nama_bahan: namaBahan,
    //                 jumlah: 0
    //             });
    //         }

    //         const currentStock = stockSummary.get(bahanId);

    //         switch (transaction.jenis_transaksi.toLowerCase()) {
    //             case 'masuk':
    //             case 'penyesuaian':
    //                 currentStock.jumlah += transaction.jumlah;
    //                 break;
    //             case 'keluar':
    //                 currentStock.jumlah -= transaction.jumlah;
    //                 break;
    //         }

    //         stockSummary.set(bahanId, currentStock);
    //     });

    //     return Array.from(stockSummary.values());
    // }
};

export default StockModel;