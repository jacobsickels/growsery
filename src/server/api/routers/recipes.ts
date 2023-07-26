import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const recipeRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.recipe.findMany({
      where: { userId: ctx.session.user.id },
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const recipe = await prisma.recipe.upsert({
        where: { id: input.id },
        update: input,
        create: { ...input, userId: ctx.session.user.id },
      });

      return recipe;
    }),
});
