import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const produceRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.produce.findMany({
      where: {
        ingredient: {
          some: {
            recipe: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
    });
  }),
});
