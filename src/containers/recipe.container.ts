import { createContainer, asFunction } from "awilix";
import {
    createRecipeController,
    getRecipesController,
    getRecipeDetailController,
    updateRecipeController,
    deleteRecipeController,
} from "../controllers/recipe";
import {
    createRecipeService,
    getRecipesService,
    updateRecipeService,
    deleteRecipeService,
    updateTotalHPPService,
} from "../services/RecipeService";

const container = createContainer();

container.register({
    // Services
    createRecipeService: asFunction(() => createRecipeService).scoped(),
    getRecipesService: asFunction(() => getRecipesService).scoped(),
    updateRecipeService: asFunction(() => updateRecipeService).scoped(),
    deleteRecipeService: asFunction(() => deleteRecipeService).scoped(),
    updateTotalHPPService: asFunction(() => updateTotalHPPService).singleton(),

    // Controllers
    createRecipe: asFunction(createRecipeController).scoped(),
    getRecipes: asFunction(getRecipesController).scoped(),
    getRecipeDetail: asFunction(getRecipeDetailController).scoped(),
    updateRecipe: asFunction(updateRecipeController).scoped(),
    deleteRecipe: asFunction(deleteRecipeController).scoped(),
});

export default container;
