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
const prisma = new client_1.PrismaClient();
const MenuModel = {
    addMenu: (userId, nama_menu) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.menu.create({
            data: {
                userId,
                nama_menu
            }
        });
    }),
    findMenusByUserId: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.menu.findMany({
            where: { userId }
        });
    }),
    findExistingMenu: (userId, nama_menu) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.menu.findFirst({
            where: { userId, nama_menu }
        });
    }),
    findMenuByIdAndUserId: (userId, menuId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.menu.findFirst({
            where: {
                userId,
                id: menuId
            }
        });
    }),
    updateUserMenu: (userId, menuId, nama_menu) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.menu.update({
            where: {
                userId: userId,
                id: menuId
            },
            data: {
                nama_menu: nama_menu
            }
        });
    }),
    deleteUserMenu: (userId, menuId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.menu.delete({
            where: {
                userId: userId,
                id: menuId
            }
        });
    }),
};
exports.default = MenuModel;
