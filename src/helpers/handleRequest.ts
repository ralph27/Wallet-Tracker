export interface ITx {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: string;
}

export interface TResponse {
  message: string;
  result: ITx[];
  status: string;
}

export default async function handleRequest<TResponse>(
  url: string
): Promise<TResponse> {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data as TResponse);
}
