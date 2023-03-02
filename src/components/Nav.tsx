import { type MetaMaskInpageProvider } from "@metamask/providers";
import { useState } from "react";
import { api } from "~/utils/api";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function Nav({
  wallet,
  metamaskInstalled,
  connectWallet,
}: {
  wallet: string;
  metamaskInstalled: boolean;
  connectWallet: () => void;
}) {
  return (
    <div className=" navbar justify-between bg-base-100 px-10 py-5">
      <a className="btn-ghost btn text-2xl normal-case text-lightGreen">
        WalletAnalyzor
      </a>
      <label
        htmlFor="my-modal"
        className="btn text-lg hover:text-lightGreen"
        onClick={() => void connectWallet()}
      >
        {wallet
          ? `${wallet.substring(0, 6)}...${wallet.substring(38, 43)}`
          : "Connect Wallet"}
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      {!metamaskInstalled && (
        <div className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Metamask Not Installed!</h3>
            <p className="py-4 ">
              Please head over to the{" "}
              <a
                href="https://metamask.io/download/"
                className="underline hover:text-lightGreen"
                target="_blank"
              >
                Metamask website
              </a>{" "}
              to download it
            </p>
            <div className="modal-action">
              <label htmlFor="my-modal" className="btn hover:text-lightGreen">
                Close
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
