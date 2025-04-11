import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const Menu = {
    addMenu: async (userId: number, name_menu: string) => {
        return await prisma.menu.create({
            data: {
                userId,
                name_menu
            }
        })
    },
    findMenuByUserId: async (userId: number) => {
        return await prisma.menu.findMany({
            where: { userId }
        })
    },
    existingMenu: async (userId: number, name_menu: string) => {
        return await prisma.menu.findFirst({
            where: { userId, name_menu }
        })
    },
    findMenuByIdAndUserId: async (userId: number, menuId: number) => {
        return await prisma.menu.findMany({
            where: {
                userId,
                id: menuId
            }
        })
    },
    validateMenuByIdAndUserId: async (userId: number, menuId: number) => {
        return await prisma.menu.findFirst({
            where: {
                userId,
                id: menuId
            }
        })
    },
    updateUserMenu: async (userId: number, menuId: number, name_menu: string) => {
        return await prisma.menu.update({
            where: {
                id_userId: {
                    userId: userId,
                    id: menuId
                }
            },
            data: {
                name_menu: name_menu
            }
        })
    },
    deleteUserMenu: async (userId: number, menuId: number) => {
        return await prisma.menu.delete({
            where: {
                id_userId: {
                    userId: userId,
                    id: menuId
                }
            }
        })
    },
}

export default Menu; 