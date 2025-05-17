import { Router } from "express";
const router = Router()
import { 
    createResep, 
    deleteMenuResep, 
    getRecipes, 
    updateMenuResep 
} from "../controllers/hpp.controller";
import verifyToken from "../middlewares/auth.middleware";
import verifyUserAccess from "../middlewares/userAccess.middleware";
import { validate } from "../middlewares/validate.middleware";
import { bahanSchema } from "../validators/HppValidator";

router.use(verifyToken)

// Menampilkan bahan berdasarkan menu_id
router.get("/:user_id/:menu_id", verifyUserAccess, getRecipes)

// Menambah bahan baru untuk menu tertentu berdasarkan menu_id
router.post("/:user_id/:menu_id", validate(bahanSchema), verifyUserAccess, createResep)

// Mengubah bahan untuk menu tertentu berdasarkan menu_id
router.put("/:user_id/:menu_id/:bahan_id", verifyUserAccess, updateMenuResep)

// Menghapus bahan dari menu tertentu berdasarkan menu_id
router.delete("/:user_id/:menu_id/:bahan_id", verifyUserAccess, deleteMenuResep)

export default router;