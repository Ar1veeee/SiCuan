import User from "../models/UserModel";
import { ApiError } from "../exceptions/apiError";

export const updateUserPassword = async (user_id: number, newPassword: string): Promise<string> => {
    if (isNaN(user_id)) {
        throw new ApiError("ID User tidak valid", 400)
    }
    const updated = await User.updateOldPassword(user_id, newPassword)
    if (!updated) {
        throw new ApiError("Password Gagal Diperbarui", 400)
    }
    return "Password Berhasil Diperbarui"
}

export const getUserProfile = async (user_id: number) => {
    if (isNaN(user_id)) {
        throw new ApiError("ID User Tidak Valid", 400)
    }

    const user = await User.findUserById(user_id);
    if (!user) {
        throw new ApiError("User Tidak Ditemukan", 400)
    }
    return {
        userId: user.id,
        username: user.name,
        email: user.email,
        nama_usaha: user.nama_usaha
    }
}