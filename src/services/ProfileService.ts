import UserModel from "../models/user.model";
import { ApiError } from "../exceptions/apiError";

interface ProfileResponse {
    message: string;
}

export const updatePasswordService = async (user_id: number, newPassword: string): Promise<ProfileResponse> => {
    if (isNaN(user_id)) {
        throw new ApiError("ID User tidak valid", 400)
    }
    const updated = await UserModel.updatePassword(user_id, newPassword)
    if (!updated) {
        throw new ApiError("Password Gagal Diperbarui", 400)
    }
    return { message: "Password Berhasil Diperbarui" }
}

export const userProfileService = async (user_id: number) => {
    if (isNaN(user_id)) {
        throw new ApiError("ID User Tidak Valid", 400)
    }

    const user = await UserModel.findUserById(user_id);
    if (!user) {
        throw new ApiError("User Tidak Ditemukan", 404)
    }
    return {
        userId: user.id,
        username: user.name,
        email: user.email,
        nama_usaha: user.nama_usaha
    }
}