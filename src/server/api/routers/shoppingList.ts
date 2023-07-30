import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const shoppingListRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { selectedRecipeIds: userSelected, actingGroupId } =
      await prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: {
          selectedRecipeIds: true,
          actingGroupId: true,
        },
      });

    let selectedRecipeIds = userSelected;

    if (actingGroupId) {
      const { selectedRecipeIds: groupSelected } =
        await prisma.group.findUniqueOrThrow({
          where: { id: actingGroupId },
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
        recipeId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { selectedRecipeIds: userSelected, actingGroupId } =
        await prisma.user.findUniqueOrThrow({
          where: { id: ctx.session.user.id },
          select: {
            selectedRecipeIds: true,
            actingGroupId: true,
          },
        });

      let selectedRecipeIds = userSelected;

      // If user is acting in a group, assign the selected to the group instead
      if (actingGroupId) {
        const { selectedRecipeIds: groupSelected } =
          await prisma.group.findUniqueOrThrow({
            where: { id: actingGroupId },
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

      if (actingGroupId) {
        return await prisma.group.update({
          where: { id: actingGroupId },
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
