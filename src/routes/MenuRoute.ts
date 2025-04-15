import { Router } from "express";
const router = Router();
import { createMenu, deleteMenu, Menus, updateMenu } from "../controllers/MenuController";
import verifyToken from "../middlewares/AuthMiddleware";

router.use(verifyToken)

router.get("/:user_id", Menus);
router.post("/:user_id", createMenu);
router.patch("/:user_id/:menu_id", updateMenu);
router.delete("/:user_id/:menu_id", deleteMenu);

export default router;