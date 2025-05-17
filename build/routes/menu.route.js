"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const menu_controller_1 = require("../controllers/menu.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const userAccess_middleware_1 = __importDefault(require("../middlewares/userAccess.middleware"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const MenuValidator_1 = require("../validators/MenuValidator");
router.use(auth_middleware_1.default);
// Menampilkan menu berdasarkan user_id
router.get("/:user_id", userAccess_middleware_1.default, menu_controller_1.getMenus);
// Menambah menu baru untuk user
router.post("/:user_id", (0, validate_middleware_1.validate)(MenuValidator_1.menuSchema), userAccess_middleware_1.default, menu_controller_1.createMenu);
// Memperbarui menu berdasarkan user_id dan menu_id
router.patch("/:user_id/:menu_id", (0, validate_middleware_1.validate)(MenuValidator_1.menuSchema), userAccess_middleware_1.default, menu_controller_1.updateMenu);
// Menghapus menu berdasarkan user_id dan menu_id
router.delete("/:user_id/:menu_id", userAccess_middleware_1.default, menu_controller_1.deleteMenu);
exports.default = router;
