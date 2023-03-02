import { createTRPCRouter } from "~/server/api/trpc";
import { accountsRouter } from "./routers/accounts";
import { listRouter } from "./routers/lists";
import { transactionsRouter } from "./routers/transactions";
import { walletsRouter } from "./routers/wallets";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  accounts: accountsRouter,
  lists: listRouter,
  wallets: walletsRouter,
  transactions: transactionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
