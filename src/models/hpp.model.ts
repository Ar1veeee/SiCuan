import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import { calculateHpp } from "../utils/hppCalculate.util";
import { ApiError } from "../exceptions/ApiError";

const Hpp = {
    createBahanWithMenuLink: async (data: {
        nama: string;
        harga_beli: number;
        jumlah: number;
        satuan: string;
        menuId: number;
        jumlah_digunakan: number;
        userId: number;
    }) => {
        const biaya = calculateHpp(data.harga_beli, data.jumlah, data.jumlah_digunakan);

        let bahan = await prisma.bahan.findUnique({
            where: { nama: data.nama }
        });

        if (!bahan) {
            bahan = await prisma.bahan.create({
                data: {
                    nama: data.nama,
                    jumlah: data.jumlah,
                },
            });
        } else {

            await prisma.bahan.update({
                where: { id: bahan.id },
                data: { jumlah: data.jumlah }
            });
        }

        await prisma.menuBahan.create({
            data: {
                menuId: data.menuId,
                bahanId: bahan.id,
                jumlah: data.jumlah_digunakan,
                harga_beli: data.harga_beli,
                satuan: data.satuan,
                biaya: biaya
            },
        });

        const existingStockTransaction = await prisma.stockTransaction.findFirst({
            where: {
                nama: data.nama
            }
        });

        if (!existingStockTransaction && data.userId) {
            await prisma.stockTransaction.create({
                data: {
                    userId: data.userId,
                    nama: data.nama,
                    jumlah: 0,
                    jenis_transaksi: 'info',
                    keterangan: `Menu ingredient added: ${data.nama}`,
                }
            });
        }

        return bahan;
    },

    updateTotalHPP: async (menuId: number) => {
        const totalBiayaHpp = await prisma.menuBahan.findMany({
            where: { menuId },
            include: { bahan: true },
        });

        const jumlahHpp = totalBiayaHpp.reduce((acc, item) => acc + (item.biaya ?? 0), 0);

        await prisma.menu.update({
            where: { id: menuId },
            data: { jumlah_hpp: jumlahHpp },
        });
    },

    findResepByUserIdAndMenuId: async (userId: number, menuId: number) => {
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

    existingResep: async (menuId: number, nama_bahan: string) => {
        return await prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahan: {
                    nama: nama_bahan,
                },
            },
            include: {
                bahan: true
            }
        })
    },

    deleteMenuResep: async (userId: number, menuId: number, bahanId: number) => {
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
                jumlah_hpp: {
                    decrement: hppPerBahan
                }
            }
        })
        return true
    },

    updateMenuResep: async (userId: number, menuId: number, bahanId: number, data: {
        nama: string;
        harga_beli: number;
        jumlah: number;
        satuan: string;
        menuId: number;
        jumlah_digunakan: number;
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
                nama: data.nama,
                jumlah: data.jumlah,

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
                harga_beli: data.harga_beli,
                satuan: data.satuan,
                biaya: biayaBaru
            }
        })
        return true
    }
}

export default Hpp;