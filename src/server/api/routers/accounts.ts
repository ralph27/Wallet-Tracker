import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const accountsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ wallet: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          wallet: input.wallet,
        },
      });
    }),
  getAccounts: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getAccount: publicProcedure
    .input(z.object({ wallet: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findFirst({ where: { wallet: input.wallet } });
    }),

  // followAddress: publicProcedure
  //   .input(z.object({ id: z.string(), walletFollowed: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.prisma.user.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: {
  //         walletsFollowed: {
  //           push: input.walletFollowed,
  //         },
  //       },
  //     });
  //   }),
});
