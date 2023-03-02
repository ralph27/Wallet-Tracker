import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Nav from "~/components/Nav";
import { useState } from "react";
import { type MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const [wallet, setWallet] = useState<string>("");
  const [metamaskInstalled, setMetamaskInstalled] = useState(true);

  const createUser = api.accounts.create.useMutation();

  const { data: existingWallets } = api.accounts.getAccounts.useQuery();

  const connectWallet = async () => {
    if (window.ethereum) {
      setMetamaskInstalled(true);
      const accounts: string[] = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts[0]) {
        setWallet(accounts[0]);

        if (
          existingWallets?.filter((user) => user.wallet === accounts[0])
            .length === 0
        )
          createUser.mutate({ wallet: accounts[0] });
      }
    } else {
      setMetamaskInstalled(false);
    }
  };

  return (
    <div>
      <Nav
        wallet={wallet}
        metamaskInstalled={metamaskInstalled}
        connectWallet={() => void connectWallet()}
      />
      <Component {...pageProps} wallet={wallet} connectWallet={connectWallet} />
    </div>
  );
};

export default api.withTRPC(MyApp);
