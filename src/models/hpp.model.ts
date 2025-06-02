import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import { calculateHpp } from "../utils/hppCalculate.util";
import { ApiError } from "../exceptions/ApiError";
import { ulid } from "ulid";

const HppModel = {
    createBahanWithMenuLink: async (data: {
        userId: string;
        menuId: string;
        nama_bahan: string;
        harga_beli: number;
        jumlah: number;
        satuan: string;
        jumlah_digunakan: number;
        minimum_stock?: number;
    }) => {
        const biaya = calculateHpp(data.harga_beli, data.jumlah, data.jumlah_digunakan);

        let bahan = await prisma.bahan.findUnique({
            where: {
                nama_bahan: data.nama_bahan,
                userId: data.userId
            }
        });

        if (!bahan) {
            bahan = await prisma.bahan.create({
                data: {
                    id: ulid(),
                    userId: data.userId,
                    nama_bahan: data.nama_bahan,
                    jumlah: data.jumlah,
                    harga_beli: data.harga_beli,
                    satuan: data.satuan,
                    minimum_stock: data.minimum_stock ?? 0,
                },
            });
        } else {
            await prisma.bahan.update({
                where: {
                    id: bahan.id,
                    userId: data.userId
                },
                data: { jumlah: data.jumlah }
            });
        }

        await prisma.menuBahan.create({
            data: {
                id: ulid(),
                menuId: data.menuId,
                bahanId: bahan.id,
                jumlah: data.jumlah_digunakan,
                biaya: biaya
            },
        });

        const existingStockTransaction = await prisma.stockTransaction.findFirst({
            where: {
                nama_bahan: data.nama_bahan
            }
        });

        if (!existingStockTransaction && data.userId) {
            await prisma.stockTransaction.create({
                data: {
                    id: ulid(),
                    userId: data.userId,
                    bahanId: bahan.id,
                    nama_bahan: data.nama_bahan,
                    jumlah: data.jumlah,
                    jenis_transaksi: 'PENYESUAIAN',
                    keterangan: `Menambah Bahan Menu: ${data.nama_bahan}`,
                }
            });
        }

        return bahan;
    },

    updateTotalHPP: async (menuId: string) => {
        const totalBiayaHpp = await prisma.menuBahan.findMany({
            where: { menuId },
            include: { bahan: true },
        });

        const jumlahHpp = totalBiayaHpp.reduce((acc: number, item: typeof totalBiayaHpp[0]) => acc + (item.biaya ?? 0), 0);

        await prisma.menu.update({
            where: { id: menuId },
            data: { hpp: jumlahHpp },
        });
    },

    findResepByUserIdAndMenuId: async (userId: string, menuId: string) => {
        return await prisma.bahan.findMany({
            where: {
                menuBahan: {
                    some: {
                        menu: {
                            userId: userId,
                            id: menuId
                        }
                    }
                }
            },
            include: {
                menuBahan: {
                    where: {
                        menuId: menuId
                    },
                    select: {
                        jumlah: true
                    }
                }
            }
        })
    },

    existingResep: async (menuId: string, nama_bahan: string) => {
        return await prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahan: {
                    nama_bahan: nama_bahan,
                },
            },
            include: {
                bahan: true
            }
        })
    },

    deleteMenuResep: async (userId: string, menuId: string, bahanId: string) => {
        const menuBahan = await prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahanId,
                menu: {
                    userId
                }
            },
            include: {
                bahan: true
            }
        });

        if (!menuBahan) {
            throw new ApiError("Bahan untuk menu ini tidak ditemukan", 400)
        }

        const hppPerBahan = menuBahan.biaya ?? 0

        await prisma.menuBahan.delete({
            where: {
                menuId_bahanId: {
                    menuId,
                    bahanId
                }
            }
        })
        await prisma.bahan.delete({
            where: {
                id: bahanId
            }
        })
        await prisma.menu.update({
            where: {
                id: menuId
            },
            data: {
                hpp: {
                    decrement: hppPerBahan
                }
            }
        })
        return true
    },

    updateMenuResep: async (userId: string, menuId: string, bahanId: string, data: {
        nama_bahan: string;
        harga_beli: number;
        jumlah: number;
        satuan: string;
        menuId: string;
        jumlah_digunakan: number;
        minimum_stock?: number;
    }) => {
        const menuBahan = await prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahanId,
                menu: {
                    userId
                }
            },
            include: {
                bahan: true
            }
        });

        if (!menuBahan) {
            throw new ApiError("Bahan untuk menu ini tidak ditemukan", 400)
        }

        const biayaBaru = calculateHpp(data.harga_beli, data.jumlah, data.jumlah_digunakan)


        await prisma.bahan.update({
            where: {
                id: bahanId,
            },
            data: {
                nama_bahan: data.nama_bahan,
                jumlah: data.jumlah,
                harga_beli: data.harga_beli,
                satuan: data.satuan,
            },
        })

        await prisma.menuBahan.update({
            where: {
                menuId_bahanId: {
                    menuId: menuId,
                    bahanId: bahanId
                },
            },
            data: {
                jumlah: data.jumlah_digunakan,
                biaya: biayaBaru
            }
        })
        return true
    }
}

export default HppModel;