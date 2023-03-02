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
});
