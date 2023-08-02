import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { pusherServerClient } from "~/server/pusher";

export const recipeRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        groupId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await prisma.recipe.findMany({
        where: {
          userId: ctx.session.user.id,
          groupId: input.groupId,
        },
      });
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const recipe = await prisma.recipe.findUnique({
        where: { id: input.id },
        include: {
          ingredients: {
            include: {
              produce: true,
            },
          },
        },
      });

      return recipe;
    }),
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.string().optional(),
        servings: z.number(),
        groupId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const recipe = await prisma.recipe.upsert({
        where: { id: input.id || "create-id" },
        update: input,
        create: {
          ...input,
          userId: ctx.session.user.id,
          groupId: input.groupId,
        },
      });

      await pusherServerClient.trigger(
        `${input.groupId || ctx.session.user.id}`,
        "updated-recipes",
        {}
      );

      return recipe;
    }),
  updateIngredients: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        ingredients: z.array(
          z.object({
            id: z.string().optional(),
            amount: z.number(),
            unit: z.object({
              label: z.string(),
              value: z.enum([
                "NONE",
                "OUNCE",
                "POUND",
                "TABLE_SPOON",
                "TEA_SPOON",
                "CUP",
                "FLUID_OUNCE",
                "PINT",
                "QUART",
                "GALLON",
              ]), // Should be Unit Enum
            }),
            produceId: z.string().optional(),
            produceName: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const recipe = await prisma.recipe.update({
        where: { id: input.id },
        data: {
          ingredients: {
            upsert: input.ingredients.map((ingredient) => ({
              where: {
                id: ingredient.id || "upsert-ingredient",
              },
              update: {
                amount: ingredient.amount,
                unit: ingredient.unit.value,
                produce: {
                  connectOrCreate: {
                    where: { id: ingredient.produceId || "connected-produce" },
                    create: { name: ingredient.produceName },
                  },
                },
              },
              create: {
                amount: ingredient.amount,
                unit: ingredient.unit.value,
                produce: {
                  connectOrCreate: {
                    where: { id: ingredient.produceId || "connected-produce" },
                    create: { name: ingredient.produceName },
                  },
                },
              },
            })),
          },
        },
      });

      return recipe;
    }),
});
