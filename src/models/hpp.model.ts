import { PrismaClient } from "@prisma/client";
import { ApiError } from "../exceptions/ApiError";
import { ulid } from "ulid";

const prisma = new PrismaClient()

const HppModel = {
    /**
     * Membuat bahan
     * @param data 
     * @returns 
     */
    createBahanWithMenuLink: async (data: {
        userId: string;
        menuId: string;
        nama_bahan: string;
        harga_beli: number;
        jumlah_beli: number;
        satuan: string;
        jumlah_digunakan: number;
        biaya: number
    }) => {
        await prisma.$transaction(async (tx) => {
            let bahan = await tx.bahan.findFirst({
                where: {
                    userId: data.userId,
                    nama_bahan: data.nama_bahan
                }
            });

            if (!bahan) {
                bahan = await tx.bahan.create({
                    data: {
                        id: ulid(),
                        userId: data.userId,
                        nama_bahan: data.nama_bahan,
                        satuan: data.satuan,
                        jumlah: 0,
                        minimum_stock: 0,
                    },
                });
            }

            await tx.menuBahan.create({
                data: {
                    id: ulid(),
                    menuId: data.menuId,
                    bahanId: bahan.id,
                    jumlah_beli: data.jumlah_beli,
                    jumlah_digunakan: data.jumlah_digunakan,
                    biaya: data.biaya,
                    harga_beli: data.harga_beli
                },
            });
        });

        return true;
    },

    getMenuBahanCosts: async (menuId: string) => {
        return await prisma.menuBahan.findMany({
            where: { menuId },
            include: { bahan: true }
        })
    },

    saveMenuCostAndPrive: async (menuId: string, totalHpp: number, hargaJual: number | null) => {
        await prisma.menu.update({
            where: { id: menuId },
            data: { 
                hpp: totalHpp,
                ...(hargaJual !== null && {harga_jual: hargaJual})
            }
        })
    },

    findResepByUserIdAndMenuId: async (userId: string, menuId: string) => {
        return await prisma.menuBahan.findMany({
            where: {
                menu: {
                    userId: userId,
                    id: menuId
                }
            },
            include: {
                bahan: {
                    select: {
                        nama_bahan: true
                    }
                }
            }
        })
    },

    findResepDetail: async (userId: string, menuId: string, bahanId: string) => {
        return await prisma.menuBahan.findFirst({
            where: {
                menuId: menuId,
                bahanId: bahanId,
                menu: {
                    userId: userId
                }
            },
            include: {
                bahan: {
                    select: {
                        nama_bahan: true,
                        satuan: true
                    }
                }
            }
        });
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

    updateMenuResep: async (
        userId: string,
        menuId: string,
        bahanId: string,
        data: {
            harga_beli: number;
            jumlah_beli: number;
            jumlah_digunakan: number;
            biayaBaru: number
        }) => {
        const menuBahan = await prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahanId,
                menu: {
                    userId
                }
            },
            select: {
                biaya: true
            }
        });

        if (!menuBahan) {
            throw new ApiError("Bahan untuk menu ini tidak ditemukan", 400)
        }

        await prisma.menuBahan.update({
            where: {
                menuId_bahanId: {
                    menuId: menuId,
                    bahanId: bahanId,
                },
            },
            data: {
                harga_beli: data.harga_beli,
                jumlah_beli: data.jumlah_beli,
                jumlah_digunakan: data.jumlah_digunakan,
                biaya: data.biayaBaru
            },
        })
        return true
    }
}

export default HppModel;