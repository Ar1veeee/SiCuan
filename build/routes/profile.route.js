"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const userAccess_middleware_1 = __importDefault(require("../middlewares/userAccess.middleware"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const UserValidator_1 = require("../validators/UserValidator");
router.use(auth_middleware_1.default);
// Menampilkan profile berdasarkan user_id 
router.get("/:user_id/", userAccess_middleware_1.default, profile_controller_1.userProfile);
// Memperbarui password berdasarkan user_id
router.patch("/:user_id/", (0, validate_middleware_1.validate)(UserValidator_1.updatePasswordSchema), userAccess_middleware_1.default, profile_controller_1.updatePassword);
exports.default = router;
