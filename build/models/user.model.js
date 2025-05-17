"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const password_util_1 = require("../utils/password.util");
const prisma = new client_1.PrismaClient();
const User = {
    createUser: (name, email, password, nama_usaha) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield (0, password_util_1.hashPassword)(password);
        return yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                nama_usaha
            }
        });
    }),
    updatePassword: (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
        const newHashedPassword = yield (0, password_util_1.hashPassword)(password);
        return yield prisma.user.update({
            where: { id: userId },
            data: { password: newHashedPassword }
        });
    }),
    findUserByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.user.findUnique({
            where: { email }
        });
    }),
    findUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.user.findUnique({
            where: { id: userId }
        });
    }),
    createOrUpdateAuthToken: (userId, accessToken, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.auth.upsert({
            where: { userId },
            update: { accessToken, refreshToken },
            create: { userId, accessToken, refreshToken }
        });
    }),
    findAuthByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.auth.findUnique({
            where: { userId }
        });
    }),
    refreshToken: (refreshToken, newAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.auth.updateMany({
            where: { refreshToken },
            data: { accessToken: newAccessToken }
        });
    })
};
exports.default = User;
