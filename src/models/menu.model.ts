import { MenuData } from "../types/menu.type";
import { ulid } from "ulid";
import DatabaseService from "../config/database.config";
const prisma = DatabaseService.getInstance()

const toDomainModel = (prismaMenu: any): MenuData => {
    return {
        id: prismaMenu.id,
        userId: prismaMenu.userId,
        nama_menu: prismaMenu.nama_menu,
        hpp: prismaMenu.hpp,
        keuntungan: prismaMenu.keuntungan,
        harga_jual: prismaMenu.harga_jual,
        createdAt: prismaMenu.createdAt,
        updatedAt: prismaMenu.updatedAt
    };
};

const MenuModel = {
    /**
     * Membuat menu baru
     * @param userId 
     * @param nama_menu 
     * @returns 
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
     * @param menuId 
     * @param nama_menu 
     * @returns 
     */
    updateMenu: async (menuId: string, nama_menu: string): Promise<MenuData> => {
        const result = await prisma.menu.update({
            where: { id: menuId, },
            data: {
                nama_menu
            }
        });
        return toDomainModel(result);
    },

    /**
     * Memperbarui keuntungan dan harga jual dari sebuah menu.
     * @param {string} menuId
     * @param {number} keuntungan
     * @param {number} harga_jual
     * @returns {Promise<MenuData>}
     */
    updateMenuPricing: async (menuId: string, keuntungan: number, harga_jual: number): Promise<MenuData> => {
        const updatedMenu = await prisma.menu.update({
            where: { id: menuId, },
            data: {
                keuntungan,
                harga_jual,
            }
        });
        return toDomainModel(updatedMenu);
    },

    /**
     * Menghapus menu berdasarkan menuId
     * @param menuId 
     * @returns 
     */
    deleteMenu: async (menuId: string): Promise<MenuData> => {
        const result = await prisma.menu.delete({
            where: { id: menuId }
        });
        return toDomainModel(result);
    },

    /**
     * Mencari semua menu berdasarkan userId
     * @param userId 
     * @returns 
     */
    findMenusByUserId: async (userId: string): Promise<MenuData[]> => {
        const results = await prisma.menu.findMany({
            where: { userId },
            orderBy: { id: 'asc' }
        });
        return results.map(toDomainModel);
    },

    /**
     * Mencari menu berdasarkan nama_menu dan userId
     * @param userId 
     * @param nama_menu 
     * @returns 
     */
    findMenuByName: async (userId: string, nama_menu: string): Promise<MenuData | null> => {
        const menu = await prisma.menu.findFirst({
            where: {
                userId,
                nama_menu
            }
        });

        return menu ? toDomainModel(menu) : null;
    },

    /**
     * Mencari menu, menuBahan, bahan berdasarkan userId dan nama menu
     * @param userId 
     * @param nama_menu 
     * @returns 
     */
    findMenuByNameWithBahan: async (userId: string, nama_menu: string) => {
        return await prisma.menu.findUnique({
            where: {
                userId_nama_menu: {
                    userId: userId,
                    nama_menu: nama_menu,
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
    },

    /**
     * Mencari menu berdasarkan menuId
     * @param menuId 
     * @returns 
     */
    findMenuById: async (menuId: string): Promise<MenuData | null> => {
        const result = await prisma.menu.findUnique({
            where: { id: menuId }
        });
        return result ? toDomainModel(result) : null;
    },

    /**
     * Mencari menu berdasarkan menuId dan userId
     * @param userId 
     * @param menuId 
     * @returns 
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