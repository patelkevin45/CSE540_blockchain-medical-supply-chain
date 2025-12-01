// src/Logs.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/MedChain.json";

function Logs() {
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setLoader] = useState(true);
  const [txs, setTxs] = useState([]);
  const [stats, setStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const init = async () => {
      await loadWeb3();
      await loadContractTransactions();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadContractTransactions = async () => {
    setLoader(true);
    setErrorMsg("");
    setStats(null);

    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setCurrentaccount(accounts[0] || "");

      const networkId = await web3.eth.net.getId();
      const networkData = PharmaTraceABI.networks[networkId];

      if (!networkData) {
        setErrorMsg("Smart contract not deployed to this network.");
        setLoader(false);
        return;
      }

      const contractAddress = networkData.address.toLowerCase();

      // Build map: function selector -> ABI item
      const selectorToAbi = {};
      PharmaTraceABI.abi.forEach((item) => {
        if (item.type === "function") {
          const signature = web3.eth.abi.encodeFunctionSignature(item);
          const selector = signature.slice(0, 10); // 0x + 8 chars
          selectorToAbi[selector] = item;
        }
      });

      const latestBlock = await web3.eth.getBlockNumber();
      const collected = [];

      // stats
      let totalTx = 0;
      let deploymentCount = 0;
      const functionCounts = {}; // { createDrugBatch: 3, sourceIngredients: 2, ... }

      // Scan every block from 0 to latest
      for (let i = 0; i <= latestBlock; i++) {
        const block = await web3.eth.getBlock(i, true); // include full tx objects
        if (!block || !block.transactions) continue;

        // Use for..of because we might await inside (for receipts)
        for (const tx of block.transactions) {
          // Case 1: deployment tx (to === null, contractAddress in receipt)
          if (!tx.to) {
            const receipt = await web3.eth.getTransactionReceipt(tx.hash);
            if (
              receipt &&
              receipt.contractAddress &&
              receipt.contractAddress.toLowerCase() === contractAddress
            ) {
              totalTx++;
              deploymentCount++;

              collected.push({
                txType: "Deployment",
                blockNumber: tx.blockNumber,
                hash: tx.hash,
                from: tx.from,
                to: receipt.contractAddress,
                functionName: "constructor / deployment",
                selector: "",
                argSummary: "",
              });
            }
            continue;
          }

          // Case 2: normal call to the contract
          if (tx.to && tx.to.toLowerCase() === contractAddress) {
            totalTx++;

            const selector = tx.input ? tx.input.slice(0, 10) : "";
            const abiItem = selectorToAbi[selector];
            const functionName = abiItem ? abiItem.name : "Unknown";
            let argSummary = "";

            if (
              abiItem &&
              abiItem.inputs &&
              abiItem.inputs.length > 0 &&
              tx.input &&
              tx.input.length > 10
            ) {
              try {
                const data = "0x" + tx.input.slice(10);
                const decoded = web3.eth.abi.decodeParameters(
                  abiItem.inputs,
                  data
                );
                const parts = abiItem.inputs.map((inp, idx) => {
                  const name =
                    inp.name && inp.name.length > 0 ? inp.name : `arg${idx}`;
                  const value = decoded[idx];
                  return `${name}: ${value}`;
                });
                argSummary = parts.join(", ");
              } catch (e) {
                console.warn("Failed to decode tx args", e);
              }
            }

            // count per function
            if (functionName) {
              if (!functionCounts[functionName]) {
                functionCounts[functionName] = 0;
              }
              functionCounts[functionName]++;
            }

            collected.push({
              txType: "Function call",
              blockNumber: tx.blockNumber,
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              functionName,
              selector,
              argSummary,
            });
          }
        }
      }

      // Sort by block number
      collected.sort((a, b) => a.blockNumber - b.blockNumber);
      setTxs(collected);

      // Build stats object
      setStats({
        totalTx,
        deploymentCount,
        functionCounts,
      });

      if (totalTx === 0) {
        setErrorMsg(
          "No transactions to this contract found yet. Try creating batches / processing supply chain, then refresh this view."
        );
      }
    } catch (err) {
      console.error("Error loading contract transactions:", err);
      setErrorMsg("Error loading transactions. Check the console for details.");
      setTxs([]);
    }

    setLoader(false);
  };

  if (loader) {
    return (
      <div>
        <h1 className="wait">Loading contract transactions...</h1>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Contract transactions</h1>
          <p className="page-subtitle">
            Full history of Ethereum transactions sent to the MedChain Nexus
            smart contract on the local Ganache network.
          </p>
        </div>
        <div className="page-header-meta">
          <div className="account-info">
            <b>Current Account:</b>&nbsp;{currentaccount}
          </div>
        </div>
      </header>

      {/* SUMMARY */}
      <section className="section-card">
        <div className="section-header">
          <h2 className="section-title">Summary</h2>
          <p className="section-description">
            Overview of how many times this contract was deployed and how often
            each function has been called.
          </p>
        </div>

        {errorMsg && (
          <p className="section-hint" style={{ color: "#fca5a5" }}>
            {errorMsg}
          </p>
        )}

        {stats && stats.totalTx > 0 && (
          <div className="logs-summary">
            <p>
              <b>Total transactions to this contract:</b> {stats.totalTx}
            </p>
            <p>
              <b>Deployments:</b> {stats.deploymentCount}
            </p>

            {stats.functionCounts &&
              Object.keys(stats.functionCounts).length > 0 && (
                <>
                  <p>
                    <b>Function calls by name:</b>
                  </p>
                  <ul style={{ marginLeft: "1.2rem", marginBottom: 0 }}>
                    {Object.entries(stats.functionCounts).map(
                      ([fname, count]) => (
                        <li key={fname}>
                          <code>{fname}</code> – {count} time
                          {count > 1 ? "s" : ""}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
          </div>
        )}

        {(!stats || stats.totalTx === 0) && !errorMsg && (
          <p className="section-hint">
            No transactions found yet. Use the app (Roles, New Batch, Supply
            Control), then refresh this page.
          </p>
        )}
      </section>

      {/* DETAILED TRANSACTION TABLE */}
      <section className="section-card">
        <div className="section-header">
          <h2 className="section-title">Transaction history</h2>
          <p className="section-description">
            Includes contract deployment and every state-changing call, such as
            role registration, batch creation, and each supply chain step.
          </p>
        </div>

        {txs.length === 0 && !errorMsg && (
          <p className="section-hint">
            No transactions to display. Perform some actions in the dApp and
            refresh.
          </p>
        )}

        {txs.length > 0 && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Type</th>
                  <th>Function</th>
                  <th>Args</th>
                  <th>From</th>
                  <th>Tx hash</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx, idx) => (
                  <tr key={idx}>
                    <td>{tx.blockNumber}</td>
                    <td>{tx.txType}</td>
                    <td>{tx.functionName}</td>
                    <td style={{ fontSize: "0.8rem" }}>
                      {tx.argSummary || (
                        <span style={{ color: "#9ca3af" }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: "0.8rem" }}>{tx.from}</td>
                    <td style={{ fontSize: "0.8rem" }}>
                      <div>
                        {tx.hash.slice(0, 10)}…
                        {tx.hash.slice(-6)}
                      </div>
                      <div style={{ opacity: 0.7 }}>{tx.hash}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Logs;
