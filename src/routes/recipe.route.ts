// Import configurations
import { Router } from "express";
import container from "../containers/recipe.container";
const router = Router();

// Import middlewares
import verifyToken from "../middlewares/auth.middleware";
import {
  validateBahanId,
  validateRecipeId,
  verifyAndAttachRecipeItem,
} from "../middlewares/recipe.middleware";
import {
  validateMenuId,
  verifyAndAttachMenu,
} from "../middlewares/menu.middleware";
import { validate } from "../middlewares/validate.middleware";

// Import validation
import { bahanSchema, updateBahanSchema } from "../validators/hpp.validator";

const getRecipes = container.resolve("getRecipes");
const getRecipeDetail = container.resolve("getRecipeDetail");
const createRecipe = container.resolve("createRecipe");
const updateRecipe = container.resolve("updateRecipe");
const deleteRecipe = container.resolve("deleteRecipe");

router.use(verifyToken);
router.get("/:menu_id", validateMenuId, verifyAndAttachMenu, getRecipes);

router.get(
  "/:menu_id/:recipe_id",
  validateMenuId,
  validateRecipeId,
  verifyAndAttachMenu,
  verifyAndAttachRecipeItem,
  getRecipeDetail
);

router.post(
  "/:menu_id",
  validate(bahanSchema),
  validateMenuId,
  verifyAndAttachMenu,
  createRecipe
);

router.put(
  "/:menu_id/:recipe_id",
  validate(updateBahanSchema),
  validateMenuId,
  validateRecipeId,
  verifyAndAttachMenu,
  updateRecipe
);

router.delete(
  "/:menu_id/:recipe_id",
  validateMenuId,
  validateRecipeId,
  verifyAndAttachMenu,
  deleteRecipe
);

export default router;
