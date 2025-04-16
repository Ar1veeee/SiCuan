import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const Menu = {
    addMenu: async (userId: number, nama_menu: string) => {
        return await prisma.menu.create({
            data: {
                userId,
                nama_menu
            }
        })
    },
    findMenuByUserId: async (userId: number) => {
        return await prisma.menu.findMany({
            where: { userId }
        })
    },
    existingMenu: async (userId: number, nama_menu: string) => {
        return await prisma.menu.findFirst({
            where: { userId, nama_menu }
        })
    },
    
    findMenuByIdAndUserId: async (userId: number, menuId: number) => {
        return await prisma.menu.findFirst({
            where: {
                userId,
                id: menuId
            }
        })
    },
    
    updateUserMenu: async (userId: number, menuId: number, nama_menu: string) => {
        return await prisma.menu.update({
            where: {
                userId: userId,
                id: menuId
            },
            data: {
                nama_menu: nama_menu
            }
        })
    },
    deleteUserMenu: async (userId: number, menuId: number) => {
        return await prisma.menu.delete({
            where: {
                userId: userId,
                id: menuId
            }
        })
    },
}

export default Menu; 