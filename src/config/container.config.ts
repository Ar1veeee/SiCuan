import { createContainer } from "awilix";
import authContainer from "../containers/auth.container";
import profileContainer from "../containers/profile.container";
import menuContainer from "../containers/menu.container";
import recipeContainer from "../containers/recipe.container";
import stockContainer from "../containers/stock.container";
import salesContainer from "../containers/sales.container";

const container = createContainer();

container.register({
  ...authContainer.registrations,
  ...profileContainer.registrations,
  ...menuContainer.registrations,
  ...recipeContainer.registrations,
  ...stockContainer.registrations,
  ...salesContainer.registrations,
});

export default container;
