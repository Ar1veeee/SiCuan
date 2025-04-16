import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import { calculateHpp } from "../utils/HppCalculate";

const Hpp = {
    createBahanWithMenuLink: async (data: {
        nama: string;
        harga_beli: number;
        jumlah: number;
        satuan: string;
        menuId: number;
        jumlah_digunakan: number;
    }) => {
        const bahan = await prisma.bahan.create({
            data: {
                nama: data.nama,
                harga_beli: data.harga_beli,
                jumlah: data.jumlah,
                satuan: data.satuan,
                biaya: calculateHpp(data.harga_beli, data.jumlah, data.jumlah_digunakan),
            },
        });

        await prisma.menuBahan.create({
            data: {
                menuId: data.menuId,
                bahanId: bahan.id,
                jumlah: data.jumlah_digunakan,
            },
        });

        return bahan;
    },

    updateTotalHPP: async (menuId: number) => {
        const totalBiayaHpp = await prisma.menuBahan.findMany({
            where: { menuId },
            include: { bahan: true },
        });

        const jumlahHpp = totalBiayaHpp.reduce((acc, item) => acc + item.bahan.biaya, 0);

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
    }
}

export default Hpp;