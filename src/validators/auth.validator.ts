import User from "../models/user.model";
import { ApiError } from "../exceptions/ApiError";
import { z } from "zod";

export const validateUserExists = async (userId: string) => {
  const user = await User.findUserById(userId);
  if (!user) {
    throw ApiError.notFound("User tidak dapat ditemukan");
  }
  return user;
};

export const passwordSchema = z
  .string()
  .min(8, "Password harus setidaknya 8 karakter.")
  .regex(/[A-Z]/, "Password harus mengandung setidaknya satu huruf besar.")
  .regex(/[0-9]/, "Password harus mengandung setidaknya satu angka.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password harus mengandung setidaknya satu karakter khusus."
  );

export const registerSchema = z
  .object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: passwordSchema,
    confirmPassword: z.string().min(8, "Konfirmasi password wajib diisi"),
    nama_usaha: z.string().min(3, "Nama Usaha minimal 3 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfimasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().nonempty("Password wajib diisi."),
});

export const resetPasswordSchema = z
  .object({
    otp: z.string().nonempty("OTP wajib diisi."),
    newPassword: z
      .string()
      .min(8, "Password baru harus setidaknya 8 karakter."),
    confirmPassword: z
      .string()
      .nonempty("Konfirmasi password baru wajib diisi."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru dan konfirmasi tidak cocok.",
    path: ["confirmPassword"],
  });

export const passwordConfirmationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });
