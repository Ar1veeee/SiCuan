"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const stock_controller_1 = require("../controllers/stock.controller");
const stock_middleware_1 = require("../middlewares/stock.middleware");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const userAccess_middleware_1 = __importDefault(require("../middlewares/userAccess.middleware"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const StockValidator_1 = require("../validators/StockValidator");
router.use(auth_middleware_1.default);
// Mengambil semua stok untuk user tertentu berdasarkan user_id
router.get("/:user_id", userAccess_middleware_1.default, stock_middleware_1.validateUserId, stock_controller_1.getStocks);
// Menambahkan stok untuk user tertentu berdasarkan user_id
router.post("/:user_id", (0, validate_middleware_1.validate)(StockValidator_1.stockSchema), userAccess_middleware_1.default, stock_middleware_1.validateUserId, stock_controller_1.createStock);
// Mengupdate stok untuk user tertentu berdasarkan user_id dan stock_id
router.put("/:user_id/:stock_id", (0, validate_middleware_1.validate)(StockValidator_1.stockSchema), userAccess_middleware_1.default, stock_middleware_1.validateUserId, stock_middleware_1.validateStockId, stock_controller_1.updateStock);
// Menghapus stok untuk user tertentu berdasarkan user_id dan stock_id
router.delete("/:user_id/:stock_id", userAccess_middleware_1.default, stock_middleware_1.validateUserId, stock_middleware_1.validateStockId, stock_controller_1.deleteStock);
exports.default = router;
