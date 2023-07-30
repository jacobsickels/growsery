import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const shoppingListRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { selectedRecipeIds } = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        selectedRecipeIds: true,
      },
    });

    return selectedRecipeIds;
  }),
  update: protectedProcedure
    .input(
      z.object({
        adding: z.boolean(),
        recipeId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { selectedRecipeIds } = await prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: {
          selectedRecipeIds: true,
        },
      });

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
