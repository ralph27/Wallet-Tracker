import { type FollowedWallet } from "@prisma/client";
import dayjs from "dayjs";
import { type FormEvent, useState, type KeyboardEvent } from "react";
import { api } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function WalletCard({
  wallet,
  onSave,
}: {
  wallet: FollowedWallet;
  onSave: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const addLabel = api.wallets.addLabel.useMutation({
    onSuccess: () => onSave(),
  });

  const { data: txs } = api.transactions.getERC20Tx.useQuery({
    address: wallet.address,
    page,
  });

  return (
    <div className="card mt-5 border border-gray-500 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="collapse-title text-5xl font-bold">
            <div className="text-xs font-medium">{wallet.address}</div>
            <div className="py-1" />

            {wallet.label ? (
              <h1>{wallet.label}</h1>
            ) : (
              <input
                type="text"
                placeholder="Add label..."
                value={label}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  setLabel(e.currentTarget.value)
                }
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    addLabel.mutate({ id: wallet.id, label });
                  }
                }}
                className="input focus:outline-lightGreen"
              />
            )}
          </div>
          <div className="collapse-content">
            {txs &&
              txs?.map((tx, i) => (
                <div
                  className="card mb-5 flex-row justify-between bg-bc bg-opacity-10 p-3"
                  key={i}
                >
                  <h1 className="text-lg">
                    {tx.from.toLowerCase() === wallet.address.toLowerCase()
                      ? "Sent"
                      : "Received"}{" "}
                    <span
                      className={`${
                        tx.from.toLowerCase() === wallet.address.toLowerCase()
                          ? "text-red-500"
                          : "text-lightGreen"
                      } font-bold`}
                    >
                      {Number(
                        Number(
                          Number(tx.value) /
                            Math.pow(10, Number(tx.tokenDecimal))
                        ).toFixed(2)
                      ).toLocaleString("en-US")}
                    </span>{" "}
                    {tx.tokenName} ({tx.tokenSymbol}){" "}
                    {tx.from.toLowerCase() === wallet.address.toLowerCase()
                      ? "to"
                      : "from"}{" "}
                    {tx.to}
                  </h1>
                  <h1>{dayjs.unix(Number(tx.timeStamp)).fromNow()}</h1>
                </div>
              ))}
          </div>
        </div>
        {isExpanded && (
          <div className="card-actions flex items-center justify-end align-middle">
            <button
              className="btn-sm btn border-none bg-bc bg-opacity-10 text-lightGreen"
              onClick={() => setPage((prev) => prev - 1)}
            >
              -
            </button>
            <h1>Page: {page}</h1>
            <button
              className="btn-sm btn border-none bg-bc bg-opacity-10 text-lightGreen"
              onClick={() => setPage((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
