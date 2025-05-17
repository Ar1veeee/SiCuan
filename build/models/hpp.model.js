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
const hppCalculate_util_1 = require("../utils/hppCalculate.util");
const apiError_1 = require("../exceptions/apiError");
const Hpp = {
    createBahanWithMenuLink: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const biaya = (0, hppCalculate_util_1.calculateHpp)(data.harga_beli, data.jumlah, data.jumlah_digunakan);
        let bahan = yield prisma.bahan.findUnique({
            where: { nama: data.nama }
        });
        if (!bahan) {
            bahan = yield prisma.bahan.create({
                data: {
                    nama: data.nama,
                    jumlah: data.jumlah,
                },
            });
        }
        else {
            yield prisma.bahan.update({
                where: { id: bahan.id },
                data: { jumlah: data.jumlah }
            });
        }
        yield prisma.menuBahan.create({
            data: {
                menuId: data.menuId,
                bahanId: bahan.id,
                jumlah: data.jumlah_digunakan,
                harga_beli: data.harga_beli,
                satuan: data.satuan,
                biaya: biaya
            },
        });
        const existingStockTransaction = yield prisma.stockTransaction.findFirst({
            where: {
                nama: data.nama
            }
        });
        if (!existingStockTransaction && data.userId) {
            yield prisma.stockTransaction.create({
                data: {
                    userId: data.userId,
                    nama: data.nama,
                    jumlah: 0,
                    jenis_transaksi: 'info',
                    keterangan: `Menu ingredient added: ${data.nama}`,
                }
            });
        }
        return bahan;
    }),
    updateTotalHPP: (menuId) => __awaiter(void 0, void 0, void 0, function* () {
        const totalBiayaHpp = yield prisma.menuBahan.findMany({
            where: { menuId },
            include: { bahan: true },
        });
        const jumlahHpp = totalBiayaHpp.reduce((acc, item) => { var _a; return acc + ((_a = item.biaya) !== null && _a !== void 0 ? _a : 0); }, 0);
        yield prisma.menu.update({
            where: { id: menuId },
            data: { jumlah_hpp: jumlahHpp },
        });
    }),
    findResepByUserIdAndMenuId: (userId, menuId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.bahan.findMany({
            where: {
                menuBahan: {
                    some: {
                        menu: {
                            userId: userId,
                            id: menuId
                        }
                    }
                }
            },
            include: {
                menuBahan: {
                    where: {
                        menuId: menuId
                    },
                    select: {
                        jumlah: true
                    }
                }
            }
        });
    }),
    existingResep: (menuId, nama_bahan) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahan: {
                    nama: nama_bahan,
                },
            },
            include: {
                bahan: true
            }
        });
    }),
    deleteMenuResep: (userId, menuId, bahanId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const menuBahan = yield prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahanId,
                menu: {
                    userId
                }
            },
            include: {
                bahan: true
            }
        });
        if (!menuBahan) {
            throw new apiError_1.ApiError("Bahan untuk menu ini tidak ditemukan", 400);
        }
        const hppPerBahan = (_a = menuBahan.biaya) !== null && _a !== void 0 ? _a : 0;
        yield prisma.menuBahan.delete({
            where: {
                menuId_bahanId: {
                    menuId,
                    bahanId
                }
            }
        });
        yield prisma.bahan.delete({
            where: {
                id: bahanId
            }
        });
        yield prisma.menu.update({
            where: {
                id: menuId
            },
            data: {
                jumlah_hpp: {
                    decrement: hppPerBahan
                }
            }
        });
        return true;
    }),
    updateMenuResep: (userId, menuId, bahanId, data) => __awaiter(void 0, void 0, void 0, function* () {
        const menuBahan = yield prisma.menuBahan.findFirst({
            where: {
                menuId,
                bahanId,
                menu: {
                    userId
                }
            },
            include: {
                bahan: true
            }
        });
        if (!menuBahan) {
            throw new apiError_1.ApiError("Bahan untuk menu ini tidak ditemukan", 400);
        }
        const biayaBaru = (0, hppCalculate_util_1.calculateHpp)(data.harga_beli, data.jumlah, data.jumlah_digunakan);
        yield prisma.bahan.update({
            where: {
                id: bahanId,
            },
            data: {
                nama: data.nama,
                jumlah: data.jumlah,
            },
        });
        yield prisma.menuBahan.update({
            where: {
                menuId_bahanId: {
                    menuId: menuId,
                    bahanId: bahanId
                },
            },
            data: {
                jumlah: data.jumlah_digunakan,
                harga_beli: data.harga_beli,
                satuan: data.satuan,
                biaya: biayaBaru
            }
        });
        return true;
    })
};
exports.default = Hpp;
