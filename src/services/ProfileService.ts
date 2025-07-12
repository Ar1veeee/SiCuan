import UserModel from "../models/user.model";
import { ApiError } from "../exceptions/ApiError";
import { ProfileData, ProfileResponse, } from "../types/profile.type";

/**
 * Service untuk memperbarui password pengguna
 */
export const updatePasswordService = async (
    userId: string,
    newPassword: string
): Promise<ProfileResponse> => {
    await UserModel.updatePassword(userId, newPassword);

    return {
        message: "Password berhasil diperbarui"
    };
};

/**
 * Service untuk mendapatkan profil pengguna
 */
export const userProfileService = async (userId: string): Promise<ProfileData> => {
    const user = await UserModel.findUserById(userId);
    if (!user) {
        throw new ApiError("User tidak ditemukan", 404);
    }

    return {
        userId: user.id,
        username: user.name,
        email: user.email,
        nama_usaha: user.nama_usaha
    }
};