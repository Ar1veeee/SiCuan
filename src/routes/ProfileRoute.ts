import { Router } from "express";
const router = Router()
import { updatePassword, userProfile } from "../controllers/ProfileController";
import verifyToken from "../middlewares/AuthMiddleware";
import verifyUserAccess from "../middlewares/VerifyUserAccess";
import { validate } from "../middlewares/Validate";
import { updatePasswordSchema } from "../validators/UserValidator";

router.use(verifyToken)

// Menampilkan profile berdasarkan user_id 
router.get("/:user_id/", verifyUserAccess, userProfile)

// Memperbarui password berdasarkan user_id
router.patch("/:user_id/", validate(updatePasswordSchema), verifyUserAccess, updatePassword)

export default router;