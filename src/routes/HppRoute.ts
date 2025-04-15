import { Router } from "express";
const router = Router()
import { createResep } from "../controllers/HppController";
import verifyToken from "../middlewares/AuthMiddleware";

router.use(verifyToken)

router.post("/:user_id/:menu_id", createResep)

export default router;