import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const ingredientsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    // TODO, This might need to be paginated
    return await prisma.ingredient.findMany({
      where: {
        recipe: {
          userId: ctx.session.user.id,
        },
      },
      include: {
        produce: true,
      },
    });
  }),
});
