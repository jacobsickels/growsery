import { recipeRouter } from "~/server/api/routers/recipes";
import { createTRPCRouter } from "~/server/api/trpc";
import { ingredientsRouter } from "./routers/ingredients";
import { produceRouter } from "./routers/produce";
import { shoppingListRouter } from "./routers/shoppingList";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipes: recipeRouter,
  produce: produceRouter,
  ingredients: ingredientsRouter,
  shoppingList: shoppingListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
