"use strict";

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/PasswordUtil";
import { create } from "domain";
const prisma = new PrismaClient()

const User = {
    createUser: async (name: string, email: string, password: string) => {
        const hashedPassword = await hashPassword(password)
        return await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
    },
    updateOldPassword: async (userId: number, password: string) => {
        const hashedPassword = await hashPassword(password)
        return await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })
    },
    findUserByEmail: async (email: string) => {
        return await prisma.user.findUnique({
            where: { email }
        })
    },
    findUserById: async (userId: number) => {
        return await prisma.user.findUnique({
            where: { id: userId }
        })
    },
    createOrUpdateAuthToken: async (userId: number, accessToken: string, refreshToken: string) => {
        return await prisma.auth.upsert({
            where: { userId },
            update: { accessToken, refreshToken },
            create: { userId, accessToken, refreshToken }
        })
    },
    findAuthByUserId: async (userId: number) => {
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
