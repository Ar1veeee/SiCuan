import { Router } from "express";
const router = Router();
import { createMenu, deleteMenu, Menus, updateMenu } from "../controllers/MenuController";
import verifyToken from "../middlewares/AuthMiddleware";
import verifyUserAccess from "../middlewares/VerifyUserAccess";
import { validate } from "../middlewares/Validate";
import { menuSchema } from "../validators/MenuValidator";

router.use(verifyToken)

router.get("/:user_id", verifyUserAccess, Menus);
router.post("/:user_id", validate(menuSchema), verifyUserAccess, createMenu);
router.patch("/:user_id/:menu_id", validate(menuSchema), verifyUserAccess, updateMenu);
router.delete("/:user_id/:menu_id", verifyUserAccess, deleteMenu);

export default router;