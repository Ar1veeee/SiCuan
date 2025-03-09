import { Router } from "express"
const router = Router()
import { register, login } from "../controllers/AuthController"

router.post("/register", register)
router.post("/login", login)

export default router