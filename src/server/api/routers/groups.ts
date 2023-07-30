import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const groupsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.group.findMany({
      where: {
        users: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Could also set user acting group to newly created group
      return await prisma.group.create({
        data: {
          name: input.name,
          users: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  setActingGroup: protectedProcedure
    .input(
      z.object({
        groupId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          actingGroupId: input.groupId || null,
        },
      });
    }),
});
