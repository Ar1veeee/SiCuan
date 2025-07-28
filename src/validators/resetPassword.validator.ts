import { z } from "zod";
import { passwordSchema } from "./auth.validator";

export const verifyEmailSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const verifyOtpSchema = z.object({
  otp: z.string().nonempty("OTP wajib diisi"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru dan konfirmasi tidak cocok.",
    path: ["confirmPassword"],
  });
