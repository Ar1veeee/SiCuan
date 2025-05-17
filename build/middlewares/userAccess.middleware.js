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
const apiResponse_util_1 = require("../utils/apiResponse.util");
// Middleware untuk memverifikasi akses user
const verifyUserAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const paramId = parseInt(req.params.user_id);
    const tokenUserId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
    if (!paramId || !tokenUserId) {
        apiResponse_util_1.apiResponse.unauthorized(res, "User ID tidak valid");
        return;
    }
    if (paramId !== tokenUserId) {
        apiResponse_util_1.apiResponse.forbidden(res, "Akses ditolak: token bukan milik user ini");
        return;
    }
    next();
});
exports.default = verifyUserAccess;
