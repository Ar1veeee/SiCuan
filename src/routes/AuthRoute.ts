import { Router } from "express"
const router = Router()
import { register, login } from "../controllers/AuthController"
import { validate } from "../middlewares/Validate"
import { loginSchema, registerSchema } from "../validators/UserValidator"

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)

export default router