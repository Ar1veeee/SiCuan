// Import configurations
import { Router } from "express";
import container from "../config/container.config";
const router = Router();

// Import middlewares
import verifyToken from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

// Import validation
import { passwordConfirmationSchema } from "../validators/auth.validator";

const userProfile = container.resolve("userProfile");
const updatePassword = container.resolve("updatePassword");

router.use(verifyToken);
router.get(
    "/", 
    userProfile
);

router.patch(
    "/password",
    validate(passwordConfirmationSchema),
    updatePassword
);

export default router;