import { type FollowedWallet } from "@prisma/client";
import { type FormEvent, useState, type KeyboardEvent } from "react";
import { api } from "~/utils/api";

export default function WalletCard({
  wallet,
  onSave,
}: {
  wallet: FollowedWallet;
  onSave: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");

  const addLabel = api.wallets.addLabel.useMutation({
    onSuccess: () => onSave(),
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
          <div className="collapse-title text-3xl font-bold">
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
          <div className="pl-4 text-sm font-medium">{wallet.address}</div>
        </div>
      </div>
    </div>
  );
}
