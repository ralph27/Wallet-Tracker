import { type NextPage } from "next";
import Head from "next/head";
import { type KeyboardEvent, useState, type FormEvent } from "react";
import WalletCard from "~/components/WalletCard";
import { api } from "~/utils/api";

const ethereumPattern = /^0x[a-fA-F0-9]{40}$/;

const Home: NextPage<{ wallet: string; connectWallet: () => void }> = ({
  wallet,
  connectWallet,
}) => {
  const [listName, setListName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [listSelected, setListSelected] = useState<string>("");

  const { data: lists, refetch } = api.lists.getAll.useQuery(
    { userWallet: wallet },
    { enabled: wallet.length > 0 }
  );

  const { data: wallets, refetch: getWallets } = api.wallets.getAll.useQuery(
    { listId: listSelected },
    { enabled: listSelected.length > 0 }
  );

  const createList = api.lists.createList.useMutation({
    onSuccess: () => refetch(),
  });

  const addWalletToList = api.wallets.addToList.useMutation({
    onSuccess: () => getWallets(),
  });

  const submit = () => {
    createList.mutate({
      userWallet: wallet,
      name: listName,
    });
    setListName("");
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {wallet ? (
          <div className="mx-5 mt-5 grid grid-cols-4">
            <div className="pl-2">
              {lists && lists?.length > 0 ? (
                <ul className="menu rounded-box w-56 bg-base-100 p-2">
                  {lists.map((list) => (
                    <li
                      key={list.id}
                      onClick={() => setListSelected(list.id)}
                      className="hover:text-lightGreen"
                    >
                      <a
                        className={`${
                          list.id === listSelected
                            ? "active bg-bc bg-opacity-10 text-lightGreen"
                            : ""
                        }`}
                      >
                        {list.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <h1>Create a list to track your favorite wallets</h1>
              )}
              <div className="divider" />
              <input
                type="text"
                value={listName}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  setListName(e.currentTarget.value)
                }
                placeholder="Create List..."
                className="input-bordered input w-full max-w-xs border-lightGreen focus:outline-none"
                onKeyDown={(event: KeyboardEvent) => {
                  if (event.key === "Enter") {
                    submit();
                  }
                }}
              />
            </div>
            <div className="col-span-3 min-h-screen border-l-2 border-l-bc border-opacity-10 pr-5 pl-10">
              {listSelected ? (
                <div className="card mt-5 border border-gray-500 bg-base-100 shadow-xl ">
                  <div className="card-body">
                    <h2 className="card-title">
                      <input
                        type="text"
                        placeholder="Add Address to List"
                        className="input input-lg w-full border-lightGreen font-bold focus:outline-none"
                        value={address}
                        onChange={(e: FormEvent<HTMLInputElement>) =>
                          setAddress(e.currentTarget.value)
                        }
                        onKeyDown={(event: KeyboardEvent) => {
                          if (event.key === "Enter") {
                            addWalletToList.mutate({
                              listId: listSelected,
                              wallet: address,
                            });
                            setAddress("");
                          }
                        }}
                      />
                    </h2>
                  </div>
                </div>
              ) : (
                <h1 className="text-center text-5xl font-bold">
                  Select List...
                </h1>
              )}
              <div>
                {wallets?.map((mappedWallet) => (
                  <div key={mappedWallet.id} className="mt-5">
                    <WalletCard
                      wallet={mappedWallet}
                      onSave={() => void getWallets()}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-40 text-center">
            <h1 className="text-5xl font-bold">
              Connect Wallet to Access Features
            </h1>
            <div className="py-5" />
            <button
              onClick={connectWallet}
              className="btn text-lg hover:text-lightGreen"
            >
              Connect
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;