import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/MedChain.json";

function AddMed() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedStage, setMedStage] = useState();

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

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = PharmaTraceABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(
        PharmaTraceABI.abi,
        networkData.address
      );
      setSupplyChain(supplychain);
      let i;
      const medCtr = await supplychain.methods.batchCtr().call();
      const med = {};
      const medStage = [];
      for (i = 0; i < medCtr; i++) {
        med[i + 1] = await supplychain.methods.DrugBatches(i + 1).call();
        medStage[i + 1] = await supplychain.methods.getBatchStatus(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };

  if (loader) {
    return (
      <div>
        <h1 className="wait">Loading...</h1>
      </div>
    );
  }

  const handlerChangeNameMED = (event) => {
    setMedName(event.target.value);
  };
  const handlerChangeDesMED = (event) => {
    setMedDes(event.target.value);
  };
  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .createDrugBatch(MedName, MedDes)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred! Check the console for details.");
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Order a new drug batch</h1>
          <p className="page-subtitle">
            Define a batch on-chain so it can be tracked through every stage of the
            supply chain.
          </p>
        </div>
        <div className="page-header-meta">
          <div className="account-info">
            <b>Current Account:</b>&nbsp;{currentaccount}
          </div>
        </div>
      </header>

      <section className="section-card">
        <div className="section-header">
          <h2 className="section-title">Batch details</h2>
          <p className="section-description">
            Provide a human-readable name and description for this batch.
          </p>
        </div>

        <form onSubmit={handlerSubmitMED}>
          <input
            className="form-control-sm"
            type="text"
            onChange={handlerChangeNameMED}
            placeholder="Drug name"
            required
          />
          <input
            className="form-control-sm"
            type="text"
            onChange={handlerChangeDesMED}
            placeholder="Batch description"
            required
          />
          <button className="btn btn-primary btn-sm" type="submit">
            Create batch
          </button>
        </form>
      </section>

      <section className="section-card">
        <div className="section-header">
          <h2 className="section-title">Existing drug batches</h2>
          <span className="pill pill-muted">
            Total: {Object.keys(MED || {}).length}
          </span>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Batch ID</th>
                <th scope="col">Drug name</th>
                <th scope="col">Description</th>
                <th scope="col">Current stage</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(MED).map((key) => (
                <tr key={key}>
                  <td>{MED[key].batchId}</td>
                  <td>{MED[key].drugName}</td>
                  <td>{MED[key].batchDescription}</td>
                  <td>{MedStage[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AddMed;
