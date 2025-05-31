import UserModel from "../models/user.model";
import { ApiError } from "../exceptions/ApiError";
import { ProfileResponse, UserProfile } from "../types/profile.type";

/**
 * Service untuk memperbarui password pengguna
 */
export const updatePasswordService = async (
    userId: string,
    newPassword: string
): Promise<ProfileResponse> => {
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
export const userProfileService = async (userId: string): Promise<UserProfile> => {
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