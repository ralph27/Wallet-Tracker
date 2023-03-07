import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const listRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userWallet: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.list.findMany({
        where: { userWallet: input.userWallet },
      });
    }),
  createList: publicProcedure
    .input(z.object({ name: z.string(), userWallet: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.list.create({
        data: {
          name: input.name,
          userWallet: input.userWallet,
        },
      });
    }),
  deleteList: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.list.delete({
        where: {
          id: input.id,
        },
      });
    }),
  editListName: publicProcedure
    .input(z.object({ id: z.string(), newName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.list.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.newName,
        },
      });
    }),
});
