import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/PharmaTrace.json";

function AddMed() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
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
      var i;
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
      var reciept = await SupplyChain.methods
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
    <div>
        <div className="account-info"><b>Current Account:</b> {currentaccount}</div>
        
        <h5>Order a New Drug Batch</h5>
        <form onSubmit={handlerSubmitMED}>
            <input
                className="form-control-sm"
                type="text"
                onChange={handlerChangeNameMED}
                placeholder="Drug Name"
                required
            />
            <input
                className="form-control-sm"
                type="text"
                onChange={handlerChangeDesMED}
                placeholder="Batch Description"
                required
            />
            <button
                className="btn btn-primary btn-sm"
                type="submit"
            >
                Order Batch
            </button>
        </form>

        <hr />

        <h5>Existing Drug Batches</h5>
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
                {Object.keys(MED).map(function (key) {
                    return (
                        <tr key={key}>
                            <td>{MED[key].batchId}</td>
                            <td>{MED[key].drugName}</td>
                            <td>{MED[key].batchDescription}</td>
                            <td>{MedStage[key]}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);
}

export default AddMed;
