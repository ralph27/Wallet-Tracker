import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const walletsRouter = createTRPCRouter({
  addToList: publicProcedure
    .input(z.object({ listId: z.string(), wallet: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.followedWallet.create({
        data: {
          address: input.wallet,
          listId: input.listId,
        },
      });
    }),
  getAll: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.followedWallet.findMany({
        where: { listId: input.listId },
      });
    }),

  addLabel: publicProcedure
    .input(z.object({ label: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.followedWallet.update({
        where: {
          id: input.id,
        },
        data: {
          label: input.label,
        },
      });
    }),
});
