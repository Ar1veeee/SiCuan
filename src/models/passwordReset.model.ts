import { ulid } from "ulid";
import DatabaseService from "../config/database.config";

const prisma = DatabaseService.getInstance()

const PasswordReset = {
  create: async ({ userId, otp, expiresAt }: { userId: string; otp: string; expiresAt: Date }) => {
    return prisma.passwordReset.create({
      data: {
        id: ulid(),
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