import User from "../models/UserModel";
import { ApiError } from "../exceptions/ApiError";
import { comparePassword } from "../utils/PasswordUtil";
import jwt, { JwtPayload } from "jsonwebtoken";


export const userRegister = async (username: string, email: string, password: string): Promise<string> => {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
        throw new ApiError("Email Already Exists", 400)
    }

    await User.createUser(username, email, password);
    return "Registration Successfully"
}

export const userLogin = async (email: string, password: string): Promise<any> => {
    const user = await User.findUserByEmail(email);
    if (!user) {
        throw new ApiError("User Not Found", 404);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError("Invalid Password", 400)
    }

    if (!process.env.JWT_SECRET) throw new ApiError("JWT Secret is not defined", 403)

    const activeToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    if (!user.id) {
        throw new ApiError("User ID are required", 400)
    }

    const userId = typeof user.id === "string" ? Number(user.id) : user.id

    if (!userId) {
        throw new ApiError("Invalid User ID", 400)
    }

    // await User.createOrUpdateAuthToken(userId, activeToken, refreshToken);

    return {
        userID: user.id,
        username: user.username,
        active_token: activeToken,
    }
}