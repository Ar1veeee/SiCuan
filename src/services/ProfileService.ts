import UserModel from "../models/user.model";
import { ApiError } from "../exceptions/ApiError";
import { ProfileResponse, UserProfile } from "../types/profile.type";

/**
 * Service untuk memperbarui password pengguna
 */
export const updatePasswordService = async (
    userId: number,
    newPassword: string
): Promise<ProfileResponse> => {
    if (isNaN(userId)) {
        throw new ApiError("ID User tidak valid", 400);
    }

    const updated = await UserModel.updatePassword(userId, newPassword);
    if (!updated) {
        throw new ApiError("Password gagal diperbarui", 400);
    }

    return {
        message: "Password berhasil diperbarui"
    };
};

/**
 * Service untuk mendapatkan profil pengguna
 */
export const userProfileService = async (userId: number): Promise<UserProfile> => {
    if (isNaN(userId)) {
        throw new ApiError("ID User tidak valid", 400);
    }

    const user = await UserModel.findUserById(userId);
    if (!user) {
        throw new ApiError("User tidak ditemukan", 404);
    }

    return {
        userId: user.id,
        username: user.name,
        email: user.email,
        nama_usaha: user.nama_usaha
    };
};