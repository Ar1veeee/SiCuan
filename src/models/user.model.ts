import { hashPassword } from "../utils/password.util";
import { ulid } from "ulid";
import DatabaseService from "../config/database.config";

const prisma = DatabaseService.getInstance();

const User = {
  createUser: async (
    name: string,
    email: string,
    password: string,
    nama_usaha: string
  ) => {
    const hashedPassword = await hashPassword(password);
    return await prisma.user.create({
      data: {
        id: ulid(),
        name,
        email,
        password: hashedPassword,
        nama_usaha,
      },
    });
  },

  updatePassword: async (userId: string, password: string) => {
    const newHashedPassword = await hashPassword(password);
    return await prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
  },

  findUserByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  findUserById: async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  },

  createOrUpdateAuthToken: async (
    userId: string,
    accessToken: string,
    refreshToken: string,
    deviceInfo?: string,
    expiresAt?: Date
  ) => {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      throw new Error("Gagal membuat Auth: userId tidak ditemukan.");
    }

    const defaultExpiresAt =
      expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return await prisma.auth.upsert({
      where: { userId },
      update: {
        accessToken,
        refreshToken,
        deviceInfo,
        expiresAt: defaultExpiresAt,
        isActive: true,
      },
      create: {
        id: ulid(),
        userId,
        accessToken,
        refreshToken,
        deviceInfo,
        expiresAt: defaultExpiresAt,
        isActive: true,
      },
    });
  },

  findAuthByUserId: async (userId: string) => {
    return await prisma.auth.findUnique({
      where: { userId },
    });
  },

  refreshToken: async (
    oldRefreshToken: string,
    newAccessToken: string,
    newRefreshToken: string
  ) => {
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return await prisma.auth.updateMany({
      where: {
        refreshToken: oldRefreshToken,
        isActive: true,
      },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
      },
    });
  },

  revokeAuth: async (userId: string) => {
    return await prisma.auth.updateMany({
      where: { userId },
      data: {
        isActive: false,
        accessToken: null,
        refreshToken: null,
      },
    });
  },
};

export default User;
