import { ulid } from "ulid";
import { CreateStockTransactionRequest } from "../types/stock.type";
import DatabaseService from "../config/database.config";

const prisma = DatabaseService.getInstance()

const StockModel = {
    /**
     * Menghitung jumlah bahan dan bahan yang menipis
     * @param userId 
     * @returns 
     */
    getSummary: async (userId: string) => {
        const totalBahanPromise = prisma.bahan.count({
            where: { userId }
        });

        const hampirHabisPromise = prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count FROM Bahan
            WHERE userId = ${userId}
            AND minimum_stock IS NOT NULL
            AND minimum_stock > 0
            AND jumlah <= minimum_stock
        `;

        const [totalBahan, hampirHabisResult] = await Promise.all([
            totalBahanPromise,
            hampirHabisPromise,
        ]);

        const hampirHabis = Number(hampirHabisResult[0]?.count || 0);

        return {
            totalBahan,
            hampirHabis,
        };
    },

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
            where: { userId }
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
                    orderBy: { createdAt: 'desc', }
                }
            }
        })
    },

    /**
     * Menghapus transaksi stok
     */
    deleteBahanAndRelations: async (
        bahanId: string,
    ) => {
        return prisma.$transaction(async (tx) => {
            await tx.menuBahan.deleteMany({
                where: { bahanId: bahanId, }
            });

            await tx.stockTransaction.deleteMany({
                where: { bahanId: bahanId, }
            });

            const deletedBahan = await tx.bahan.delete({
                where: { id: bahanId, }
            });

            return deletedBahan;
        })
    },

    findMenusByBahanId: async (bahanId: string) => {
        const menuBahanRecords = await prisma.menuBahan.findMany({
            where: { bahanId: bahanId },
            select: { menuId: true },
            distinct: ['menuId'],
        });

        return menuBahanRecords.map(record => record.menuId);
    }
}

export default StockModel;