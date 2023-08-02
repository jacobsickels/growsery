import { type Ingredient, type Produce } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const shoppingListRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        actingGroupId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { selectedRecipeIds: userSelected } =
        await prisma.user.findUniqueOrThrow({
          where: { id: ctx.session.user.id },
          select: {
            selectedRecipeIds: true,
          },
        });

      let selectedRecipeIds = userSelected;

      if (input.actingGroupId) {
        const { selectedRecipeIds: groupSelected } =
          await prisma.group.findUniqueOrThrow({
            where: { id: input.actingGroupId },
            select: {
              selectedRecipeIds: true,
            },
          });

        selectedRecipeIds = groupSelected;
      }

      const recipes = await prisma.recipe.findMany({
        where: {
          id: {
            in: selectedRecipeIds,
          },
        },
        select: {
          ingredients: {
            select: {
              id: true,
              unit: true,
              amount: true,
              produce: true,
            },
          },
        },
      });

      const ingredients = recipes.reduce(
        (acc, recipe) => acc.concat(recipe.ingredients),
        [] as Partial<Ingredient & { produce: Produce }>[]
      );

      return Object.values(
        ingredients.reduce((group, ingredient) => {
          const { produce } = ingredient;
          group[produce!.id] = group[produce!.id] ?? [];
          (group[produce!.id] || []).push(ingredient);
          return group;
        }, {} as Record<string, Partial<Ingredient & { produce: Produce }>[]>)
      );
    }),
  getSelectedRecipeIds: protectedProcedure
    .input(
      z.object({
        actingGroupId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { selectedRecipeIds: userSelected } =
        await prisma.user.findUniqueOrThrow({
          where: { id: ctx.session.user.id },
          select: {
            selectedRecipeIds: true,
          },
        });

      let selectedRecipeIds = userSelected;

      if (input.actingGroupId) {
        const { selectedRecipeIds: groupSelected } =
          await prisma.group.findUniqueOrThrow({
            where: { id: input.actingGroupId },
            select: {
              selectedRecipeIds: true,
            },
          });

        selectedRecipeIds = groupSelected;
      }

      return selectedRecipeIds;
    }),
  update: protectedProcedure
    .input(
      z.object({
        adding: z.boolean(),
        recipeId: z.string(),
        actingGroupId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { selectedRecipeIds: userSelected } =
        await prisma.user.findUniqueOrThrow({
          where: { id: ctx.session.user.id },
          select: {
            selectedRecipeIds: true,
          },
        });

      let selectedRecipeIds = userSelected;

      // If user is acting in a group, assign the selected to the group instead
      if (input.actingGroupId) {
        const { selectedRecipeIds: groupSelected } =
          await prisma.group.findUniqueOrThrow({
            where: { id: input.actingGroupId },
            select: {
              selectedRecipeIds: true,
            },
          });

        selectedRecipeIds = groupSelected;
      }

      let mutatedSelectedIds: string[] = [];

      if (input.adding) {
        mutatedSelectedIds = [
          ...selectedRecipeIds,
          ...(input.recipeId ? [input.recipeId] : []),
        ];
      } else {
        mutatedSelectedIds = selectedRecipeIds.filter(
          (id) => id !== input.recipeId
        );
      }

      if (input.actingGroupId) {
        return await prisma.group.update({
          where: { id: input.actingGroupId },
          data: {
            selectedRecipeIds: {
              set: mutatedSelectedIds,
            },
          },
        });
      }

      return await prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          selectedRecipeIds: {
            set: mutatedSelectedIds,
          },
        },
      });
    }),
});
