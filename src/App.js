import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function BlockInfo({ info }) {
  if (!info) return null;
  return (
    <div>
      <h2>Block Information:</h2>
      <p>Timestamp: {info.timestamp}</p>
      <p>Miner: {info.miner}</p>
      <p>Gas Limit: {info.gasLimit.toString()}</p>
      <p>Gas Used: {info.gasUsed.toString()}</p>
    </div>
  );
}

function Transactions({ transactions }) {
  if (!transactions || transactions.length === 0) return null;
  return (
    <div>
      <h2>Transactions:</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            {index + 1}. {tx.hash}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TransactionDetails({ details }) {
  if (!details || details.length === 0) return null;
  return (
    <div>
      <h2>Transaction Details:</h2>
      <ul>
        {details.map((detail, index) => (
          <li key={index}>
            {index + 1}. {detail.transactionHash}: {detail.status ? "Success" : "Fail"}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockInfo, setBlockInfo] = useState();
  const [transactions, setTransactions] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);

  useEffect(() => {
    async function fetchBlockData() {
      const currentBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(currentBlockNumber);

      const currentBlockInfo = await alchemy.core.getBlock(currentBlockNumber);
      setBlockInfo(currentBlockInfo);

      const currentBlockTransactions = await alchemy.core.getBlockWithTransactions(
        currentBlockNumber
      );
      setTransactions(currentBlockTransactions.transactions);

      const currentTransactionDetails = await Promise.all(
        currentBlockTransactions.transactions.map((tx) =>
          alchemy.core.getTransactionReceipt(tx.hash)
        )
      );
      setTransactionDetails(currentTransactionDetails);
    }

    fetchBlockData();
  }, []);

  return (
    <div className="App">
      <h1>Block Number: {blockNumber}</h1>
      <BlockInfo info={blockInfo} />
      <Transactions transactions={transactions} />
      <TransactionDetails details={transactionDetails} />
    </div>
  );
}

export default App;
