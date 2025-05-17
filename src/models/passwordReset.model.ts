import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const PasswordReset = {
  create: async ({ userId, otp, expiresAt }: { userId: number; otp: string; expiresAt: Date }) => {
    return prisma.passwordReset.create({
      data: {
        userId,
        otp,
        expiresAt,
      },
    });
  },
  findValidOtp: async (otp: string) => {
    return prisma.passwordReset.findFirst({
      where: {
        otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
  },
  markOtpUsed: async (otp: string) => {
    return prisma.passwordReset.updateMany({
      where: { otp },
      data: { used: true },
    });
  },
};

export default PasswordReset;