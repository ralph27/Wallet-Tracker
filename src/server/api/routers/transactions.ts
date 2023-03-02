import { z } from "zod";
import handleRequest, {
  type ITx,
  type TResponse,
} from "~/helpers/handleRequest";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const transactionsRouter = createTRPCRouter({
  getERC20Tx: publicProcedure
    .input(z.object({ address: z.string(), page: z.number() }))
    .query(async ({ input }) => {
      const res: TResponse = await handleRequest(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${
          input.address
        }&page=${input.page}&offset=15&sort=desc&apikey=${
          process.env.NEXT_PUBLIC_ETHERSCAN_KEY || ""
        }`
      );
      const data: ITx[] = res.result;
      return data;
    }),
});
