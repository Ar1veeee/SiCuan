import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password.util";
import { ulid } from "ulid";
const prisma = new PrismaClient()

const User = {
    createUser: async (name: string, email: string, password: string, nama_usaha: string) => {
        const hashedPassword = await hashPassword(password)
        return await prisma.user.create({
            data: {
                id: ulid(),
                name,
                email,
                password: hashedPassword,
                nama_usaha
            }
        })
    },

    updatePassword: async (userId: string, password: string) => {
        const newHashedPassword = await hashPassword(password)
        return await prisma.user.update({
            where: { id: userId },
            data: { password: newHashedPassword }
        })
    },

    findUserByEmail: async (email: string) => {
        return await prisma.user.findUnique({
            where: { email }
        })
    },

    findUserById: async (userId: string) => {
        return await prisma.user.findUnique({
            where: { id: userId }
        })
    },

    createOrUpdateAuthToken: async (userId: string, accessToken: string, refreshToken: string) => {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });

        if (!userExists) {
            throw new Error("Gagal membuat Auth: userId tidak ditemukan.");
        }
        return await prisma.auth.upsert({
            where: { userId },
            update: { accessToken, refreshToken },
            create: { id: ulid(), userId, accessToken, refreshToken }
        })
    },

    findAuthByUserId: async (userId: string) => {
        return await prisma.auth.findUnique({
            where: { userId }
        })
    },

    refreshToken: async (refreshToken: string, newAccessToken: string) => {
        return await prisma.auth.updateMany({
            where: { refreshToken },
            data: { accessToken: newAccessToken }
        })
    }
};

export default User;
