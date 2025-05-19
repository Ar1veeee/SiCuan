import { PrismaClient } from "@prisma/client";
import { MenuData } from "../types/menu.type";
const prisma = new PrismaClient()

const toDomainModel = (prismaMenu: any): MenuData => {
    return {
        id: prismaMenu.id,
        userId: prismaMenu.userId,
        nama_menu: prismaMenu.nama_menu,
        jumlah_hpp: prismaMenu.jumlah_hpp,
        createdAt: prismaMenu.createdAt,
        updatedAt: prismaMenu.updatedAt
    };
};

const MenuModel = {
    /**
     * Membuat menu baru
     */
    createMenu: async (userId: number, nama_menu: string): Promise<MenuData> => {
        const result = await prisma.menu.create({
            data: {
                userId,
                nama_menu
            }
        });
        return toDomainModel(result);
    },

    /**
     * Memperbarui menu berdasarkan userId dan menuId
     */
    updateMenu: async (userId: number, menuId: number, nama_menu: string): Promise<MenuData> => {
        const result = await prisma.menu.update({
            where: {
                id: menuId,
                userId
            },
            data: {
                nama_menu
            }
        });
        return toDomainModel(result);
    },

    /**
     * Menghapus menu berdasarkan menuId
     */
    deleteMenu: async (menuId: number): Promise<MenuData> => {
        const result = await prisma.menu.delete({
            where: {
                id: menuId
            }
        });
        return toDomainModel(result);
    },

    /**
     * Mencari semua menu berdasarkan userId
     */
    findMenusByUserId: async (userId: number): Promise<MenuData[]> => {
        const results = await prisma.menu.findMany({
            where: { userId }
        });
        return results.map(toDomainModel);
    },

    /**
     * Mencari menu berdasarkan nama dan userId
     */
    findExistingMenu: async (userId: number, nama_menu: string): Promise<MenuData | null> => {
        const result = await prisma.menu.findFirst({
            where: { userId, nama_menu }
        });
        return result ? toDomainModel(result) : null;
    },

    /**
     * Mencari menu berdasarkan menuId
     */
    findMenuById: async (menuId: number): Promise<MenuData | null> => {
        const result = await prisma.menu.findUnique({
            where: { id: menuId }
        });
        return result ? toDomainModel(result) : null;
    },

    /**
     * Mencari menu berdasarkan menuId dan userId
     */
    findMenuByIdAndUserId: async (userId: number, menuId: number): Promise<MenuData | null> => {
        const result = await prisma.menu.findFirst({
            where: {
                userId,
                id: menuId
            }
        });
        return result ? toDomainModel(result) : null;
    },
};

export default MenuModel;