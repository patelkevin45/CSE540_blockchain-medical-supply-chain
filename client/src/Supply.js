import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/PharmaTrace.json";

function Supply() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
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
      var i;
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
      var reciept = await SupplyChain.methods
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
      var reciept = await SupplyChain.methods
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
      var reciept = await SupplyChain.methods
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
      var reciept = await SupplyChain.methods
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
      var reciept = await SupplyChain.methods
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
    <div>
      <div className="account-info"><b>Current Account:</b> {currentaccount}</div>

      <h5>Live Batch Status</h5>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Batch ID</th>
            <th scope="col">Drug Name</th>
            <th scope="col">Description</th>
            <th scope="col">Current Stage</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(MED).map(key => (
            <tr key={key}>
              <td>{MED[key].batchId}</td>
              <td>{MED[key].drugName}</td>
              <td>{MED[key].batchDescription}</td>
              <td>{MedStage[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h5>Process Batch</h5>
      <p>Enter a Batch ID and select the action to move it to the next stage.</p>

      <form onSubmit={e => e.preventDefault()} className="d-flex flex-column gap-3">
        <input
          className="form-control-sm"
          type="text"
          onChange={handlerChangeID}
          placeholder="Enter Batch ID"
          required
        />
        <div>
          <button onClick={handlerSubmitRMSsupply} className="btn btn-outline-primary btn-sm">Supply Ingredients</button>
          <button onClick={handlerSubmitManufacturing} className="btn btn-outline-primary btn-sm">Manufacture</button>
          <button onClick={handlerSubmitDistribute} className="btn btn-outline-primary btn-sm">Distribute</button>
          <button onClick={handlerSubmitRetail} className="btn btn-outline-primary btn-sm">Retail</button>
          <button onClick={handlerSubmitSold} className="btn btn-outline-danger btn-sm">Dispense</button>
        </div>
      </form>
    </div>
  );
}

export default Supply;
