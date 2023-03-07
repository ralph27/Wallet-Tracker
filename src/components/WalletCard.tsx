import { type FollowedWallet } from "@prisma/client";
import dayjs from "dayjs";
import { type FormEvent, useState, type KeyboardEvent } from "react";
import { api } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import { BsThreeDots } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
dayjs.extend(relativeTime);

export default function WalletCard({
  wallet,
  onSave,
}: {
  wallet: FollowedWallet;
  onSave: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string>("");

  const addLabel = api.wallets.addLabel.useMutation({
    onSuccess: () => onSave(),
  });

  const { data: txs, refetch } = api.transactions.getERC20Tx.useQuery({
    address: wallet.address,
    page,
    filter,
  });

  const removeWallet = api.wallets.removeWallet.useMutation({
    onSuccess: () => onSave(),
  });

  const onFilter = async (e: string, symbol: string) => {
    setFilter(e);
    if (filterTags?.length === 0) {
      setFilterTags(symbol);
    } else {
      setFilterTags("");
    }
    await refetch();
  };

  return (
    <div className="card mt-5 border border-gray-500 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
        >
          <div className="collapse-title text-5xl font-bold">
            <div className="relative flex  w-fit  items-center text-xs font-medium">
              <p className="grow-0">{wallet.address}</p>

              <BsThreeDots
                className="ml-4 cursor-pointer"
                size={25}
                onClick={() => setShowModal((prev) => !prev)}
              />

              {showModal && (
                <ul className=" menu rounded-box absolute -right-3/4 -bottom-10 z-50 w-52 bg-base-100 p-2 shadow">
                  <li
                    onClick={() =>
                      removeWallet.mutate({
                        walletId: wallet.id,
                      })
                    }
                    className="text-lg text-bc hover:text-lightGreen"
                  >
                    <a>Delete</a>
                  </li>
                </ul>
              )}
            </div>

            <div className="py-1" />

            <div onClick={() => setIsExpanded((prev) => !prev)}>
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
          </div>
          <div className="collapse-content">
            <div>
              {filterTags.length > 0 && (
                <div className="kbd relative left-full -translate-x-full items-center gap-x-3">
                  <p>{filterTags}</p>
                  <AiFillCloseCircle onClick={() => void onFilter("", "")} />
                </div>
              )}
            </div>
            <div className="py-2" />
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
                    <a
                      className="cursor-pointer underline"
                      onClick={() =>
                        void onFilter(tx.contractAddress, tx.tokenSymbol)
                      }
                    >
                      {tx.tokenName} ({tx.tokenSymbol})
                    </a>{" "}
                    {tx.from.toLowerCase() === wallet.address.toLowerCase()
                      ? `to ${tx.to}}`
                      : `from ${tx.from}`}
                  </h1>
                  <h1>{dayjs.unix(Number(tx.timeStamp)).fromNow()}</h1>
                </div>
              ))}
          </div>
        </div>
        {isExpanded && (
          <div className="card-actions flex items-center justify-end align-middle">
            <button
              className="kbd"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              -
            </button>
            <h1>Page: {page}</h1>
            <button className="kbd" onClick={() => setPage((prev) => prev + 1)}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
