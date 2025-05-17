import { Router } from "express";
const router = Router();
import { createMenu, deleteMenu, getMenus, updateMenu } from "../controllers/menu.controller";
import verifyToken from "../middlewares/auth.middleware";
import verifyUserAccess from "../middlewares/userAccess.middleware";
import { validate } from "../middlewares/validate.middleware";
import { menuSchema } from "../validators/MenuValidator";

router.use(verifyToken)

// Menampilkan menu berdasarkan user_id
router.get("/:user_id", verifyUserAccess, getMenus);

// Menambah menu baru untuk user
router.post("/:user_id", validate(menuSchema), verifyUserAccess, createMenu);

// Memperbarui menu berdasarkan user_id dan menu_id
router.patch("/:user_id/:menu_id", validate(menuSchema), verifyUserAccess, updateMenu);

// Menghapus menu berdasarkan user_id dan menu_id
router.delete("/:user_id/:menu_id", verifyUserAccess, deleteMenu);

export default router;