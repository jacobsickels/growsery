import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const recipeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        servings: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const recipe = await prisma.recipe.create({
        data: { ...input, userId: ctx.session.user.id },
      });

      return recipe;
    }),
});
