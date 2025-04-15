import { Router } from "express";
const router = Router()
import { createResep, Recipes } from "../controllers/HppController";
import verifyToken from "../middlewares/AuthMiddleware";
import verifyUserAccess from "../middlewares/VerifyUserAccess";

router.use(verifyToken)

router.get("/:user_id/:menu_id", verifyUserAccess, Recipes)
router.post("/:user_id/:menu_id", verifyUserAccess, createResep)

export default router;