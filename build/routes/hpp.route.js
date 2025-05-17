"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const hpp_controller_1 = require("../controllers/hpp.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const userAccess_middleware_1 = __importDefault(require("../middlewares/userAccess.middleware"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const HppValidator_1 = require("../validators/HppValidator");
router.use(auth_middleware_1.default);
// Menampilkan bahan berdasarkan menu_id
router.get("/:user_id/:menu_id", userAccess_middleware_1.default, hpp_controller_1.getRecipes);
// Menambah bahan baru untuk menu tertentu berdasarkan menu_id
router.post("/:user_id/:menu_id", (0, validate_middleware_1.validate)(HppValidator_1.bahanSchema), userAccess_middleware_1.default, hpp_controller_1.createResep);
// Mengubah bahan untuk menu tertentu berdasarkan menu_id
router.put("/:user_id/:menu_id/:bahan_id", userAccess_middleware_1.default, hpp_controller_1.updateMenuResep);
// Menghapus bahan dari menu tertentu berdasarkan menu_id
router.delete("/:user_id/:menu_id/:bahan_id", userAccess_middleware_1.default, hpp_controller_1.deleteMenuResep);
exports.default = router;
