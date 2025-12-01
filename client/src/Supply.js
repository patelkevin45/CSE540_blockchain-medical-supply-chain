import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/MedChain.json";

function Supply() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
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
        med[i] = await supplychain.methods.DrugBatches(i + 1).call();
        medStage[i] = await supplychain.methods.getBatchStatus(i + 1).call();
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

  const handlerChangeID = (event) => {
    setID(event.target.value);
  };

  const handlerSubmitRMSsupply = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .sourceIngredients(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitManufacturing = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .produceBatch(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitDistribute = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .shipToWholesaler(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitRetail = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .shipToPharmacy(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitSold = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .dispenseToPatient(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Supply chain control</h1>
          <p className="page-subtitle">
            Advance batches through sourcing, formulation, transit and care.
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
          <h2 className="section-title">Live batch status</h2>
          <p className="section-description">
            Overview of all batches currently registered on the smart contract.
          </p>
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

      <section className="section-card">
        <div className="section-header">
          <h2 className="section-title">Process a batch</h2>
          <p className="section-description">
            Enter a batch ID and choose which action to apply next.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="process-form">
          <input
            className="form-control-sm"
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter batch ID"
            required
          />

          <div className="button-row">
            <button
              onClick={handlerSubmitRMSsupply}
              className="btn btn-outline-primary btn-sm"
            >
              Supply ingredients
            </button>
            <button
              onClick={handlerSubmitManufacturing}
              className="btn btn-outline-primary btn-sm"
            >
              Manufacture
            </button>
            <button
              onClick={handlerSubmitDistribute}
              className="btn btn-outline-primary btn-sm"
            >
              Ship to transit hub
            </button>
            <button
              onClick={handlerSubmitRetail}
              className="btn btn-outline-primary btn-sm"
            >
              Ship to care outlet
            </button>
            <button
              onClick={handlerSubmitSold}
              className="btn btn-outline-danger btn-sm"
            >
              Dispense to patient
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Supply;
