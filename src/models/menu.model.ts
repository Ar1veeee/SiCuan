import { PrismaClient } from "@prisma/client";
import { MenuData } from "../types/menu.type";
import { ulid } from "ulid";
const prisma = new PrismaClient()

const toDomainModel = (prismaMenu: any): MenuData => {
    return {
        id: prismaMenu.id,
        userId: prismaMenu.userId,
        nama_menu: prismaMenu.nama_menu,
        hpp: prismaMenu.hpp,
        createdAt: prismaMenu.createdAt,
        updatedAt: prismaMenu.updatedAt
    };
};

const MenuModel = {
    /**
     * Membuat menu baru
     */
    createMenu: async (userId: string, nama_menu: string): Promise<MenuData> => {
        const result = await prisma.menu.create({
            data: {
                id: ulid(),
                userId,
                nama_menu
            }
        });
        return toDomainModel(result);
    },

    /**
     * Memperbarui menu berdasarkan userId dan menuId
     */
    updateMenu: async (userId: string, menuId: string, nama_menu: string): Promise<MenuData> => {
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
    deleteMenu: async (menuId: string): Promise<MenuData> => {
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
    findMenusByUserId: async (userId: string): Promise<MenuData[]> => {
        const results = await prisma.menu.findMany({
            where: { userId },
            orderBy: { id: 'asc' }
        });
        return results.map(toDomainModel);
    },

    /**
     * Mencari menu berdasarkan nama dan userId
     */
    findExistingMenu: async (userId: string, nama_menu: string): Promise<MenuData | null> => {
        const result = await prisma.menu.findFirst({
            where: { userId, nama_menu }
        });
        return result ? toDomainModel(result) : null;
    },

    /**
     * Mencari menu berdasarkan menuId
     */
    findMenuById: async (menuId: string): Promise<MenuData | null> => {
        const result = await prisma.menu.findUnique({
            where: { id: menuId }
        });
        return result ? toDomainModel(result) : null;
    },

    /**
     * Mencari menu berdasarkan menuId dan userId
     */
    findMenuByIdAndUserId: async (userId: string, menuId: string): Promise<MenuData | null> => {
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