import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/PharmaTrace.json";

function Track() {
  const history = useHistory();
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
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();
  const [TrackTillSold, showTrackTillSold] = useState(false);
  const [TrackTillRetail, showTrackTillRetail] = useState(false);
  const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
  const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
  const [TrackTillRMS, showTrackTillRMS] = useState(false);
  const [TrackTillOrdered, showTrackTillOrdered] = useState(false);

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
      const rmsCtr = await supplychain.methods.supplierCtr().call();
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i + 1] = await supplychain.methods.Suppliers(i + 1).call();
      }
      setRMS(rms);
      const manCtr = await supplychain.methods.labCtr().call();
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i + 1] = await supplychain.methods.Labs(i + 1).call();
      }
      setMAN(man);
      const disCtr = await supplychain.methods.wholesalerCtr().call();
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i + 1] = await supplychain.methods.Wholesalers(i + 1).call();
      }
      setDIS(dis);
      const retCtr = await supplychain.methods.pharmacyCtr().call();
      const ret = {};
      for (i = 0; i < retCtr; i++) {
        ret[i + 1] = await supplychain.methods.Pharmacies(i + 1).call();
      }
      setRET(ret);
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
  if (TrackTillSold) {
    return (
      <div>
        <article>
          <h5>Batch Details (ID: {MED[ID].batchId})</h5>
          <p><b>Drug Name:</b> {MED[ID].drugName}</p>
          <p><b>Description:</b> {MED[ID].batchDescription}</p>
          <p><b>Current Stage:</b> {MedStage[ID]}</p>
        </article>
        <hr />
        <h5>Ownership Trail</h5>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p><b>Supplied by:</b> {RMS[MED[ID].supplierId].name} ({RMS[MED[ID].supplierId].place})</p>
          <span>&#10132;</span>
          <p><b>Manufactured by:</b> {MAN[MED[ID].labId].name} ({MAN[MED[ID].labId].place})</p>
          <span>&#10132;</span>
          <p><b>Distributed by:</b> {DIS[MED[ID].wholesalerId].name} ({DIS[MED[ID].wholesalerId].place})</p>
          <span>&#10132;</span>
          <p><b>Retailed by:</b> {RET[MED[ID].pharmacyId].name} ({RET[MED[ID].pharmacyId].place})</p>
          <span>&#10132;</span>
          <p><b>Dispensed</b></p>
        </div>
        <button onClick={() => showTrackTillSold(false)} className="btn btn-outline-primary btn-sm">Track Another Batch</button>
      </div>
    );
  }
  if (TrackTillRetail) {
    return (
      <div className="container-xl">
        <article className="col-4">
          <h3>
            <b>
              <u>Drug Batch:</u>
            </b>
          </h3>
          <span>
            <b>Batch ID: </b>
            {MED[ID].batchId}
          </span>
          <br />
          <span>
            <b>Name:</b> {MED[ID].drugName}
          </span>
          <br />
          <span>
            <b>Description: </b>
            {MED[ID].batchDescription}
          </span>
          <br />
          <span>
            <b>Current stage: </b>
            {MedStage[ID]}
          </span>
        </article>
        <hr />
        <br />
        <section className="row">
          <article className="col-3">
            <h4>
              <u>Raw Materials Supplied by:</u>
            </h4>
            <p>
              <b>Supplier ID: </b>
              {RMS[MED[ID].supplierId].id}
            </p>
            <p>
              <b>Name:</b> {RMS[MED[ID].RMSid].name}
            </p>
            <p>
              <b>Place: </b>
              {RMS[MED[ID].RMSid].place}
            </p>
          </article>
          <span>&#10132;</span>
          <article className="col-3">
            <h4>
              <u>Manufactured by:</u>
            </h4>
            <p>
              <b>Manufacturer ID: </b>
              {MAN[MED[ID].labId].id}
            </p>
            <p>
              <b>Name:</b> {MAN[MED[ID].MANid].name}
            </p>
            <p>
              <b>Place: </b>
              {MAN[MED[ID].MANid].place}
            </p>
          </article>
          <span>&#10132;</span>
          <article className="col-3">
            <h4>
              <u>Distributed by:</u>
            </h4>
            <p>
              <b>Distributor ID: </b>
              {DIS[MED[ID].wholesalerId].id}
            </p>
            <p>
              <b>Name:</b> {DIS[MED[ID].DISid].name}
            </p>
            <p>
              <b>Place: </b>
              {DIS[MED[ID].DISid].place}
            </p>
          </article>
          <span>&#10132;</span>
          <article className="col-3">
            <h4>
              <u>Retailed by:</u>
            </h4>
            <p>
              <b>Retailer ID: </b>
              {RET[MED[ID].pharmacyId].id}
            </p>
            <p>
              <b>Name:</b> {RET[MED[ID].RETid].name}
            </p>
            <p>
              <b>Place: </b>
              {RET[MED[ID].RETid].place}
            </p>
          </article>
        </section>
        <button
          onClick={() => {
            showTrackTillRetail(false);
          }}
          className="btn btn-outline-success btn-sm"
        >
          Track Another Item
        </button>
        <span
          onClick={() => {
            history.push("/");
          }}
          className="btn btn-outline-danger btn-sm"
        >
          {" "}
          HOME
        </span>
      </div>
    );
  }
  if (TrackTillDistribution) {
    return (
      <div className="container-xl">
        <article className="col-4">
          <h3>
            <b>
              <u>Drug Batch:</u>
            </b>
          </h3>
          <span>
            <b>Batch ID: </b>
            {MED[ID].batchId}
          </span>
          <br />
          <span>
            <b>Name:</b> {MED[ID].drugName}
          </span>
          <br />
          <span>
            <b>Description: </b>
            {MED[ID].batchDescription}
          </span>
          <br />
          <span>
            <b>Current stage: </b>
            {MedStage[ID]}
          </span>
        </article>
        <hr />
        <br />
        <section className="row">
          <article className="col-3">
            <h4>
              <u>Raw Materials Supplied by:</u>
            </h4>
            <p>
              <b>Supplier ID: </b>
              {RMS[MED[ID].RMSid].id}
            </p>
            <p>
              <b>Name:</b> {RMS[MED[ID].RMSid].name}
            </p>
            <p>
              <b>Place: </b>
              {RMS[MED[ID].RMSid].place}
            </p>
          </article>
          <span>&#10132;</span>
          <article className="col-3">
            <h4>
              <u>Manufactured by:</u>
            </h4>
            <p>
              <b>Manufacturer ID: </b>
              {MAN[MED[ID].MANid].id}
            </p>
            <p>
              <b>Name:</b> {MAN[MED[ID].MANid].name}
            </p>
            <p>
              <b>Place: </b>
              {MAN[MED[ID].MANid].place}
            </p>
          </article>
          <span>&#10132;</span>
          <article className="col-3">
            <h4>
              <u>Distributed by:</u>
            </h4>
            <p>
              <b>Distributor ID: </b>
              {DIS[MED[ID].DISid].id}
            </p>
            <p>
              <b>Name:</b> {DIS[MED[ID].DISid].name}
            </p>
            <p>
              <b>Place: </b>
              {DIS[MED[ID].DISid].place}
            </p>
          </article>
        </section>
        <button
          onClick={() => {
            showTrackTillDistribution(false);
          }}
          className="btn btn-outline-success btn-sm"
        >
          Track Another Item
        </button>
        <span
          onClick={() => {
            history.push("/");
          }}
          className="btn btn-outline-danger btn-sm"
        >
          {" "}
          HOME
        </span>
      </div>
    );
  }
  if (TrackTillManufacture) {
    return (
      <div className="container-xl">
        <article className="col-4">
          <h3>
            <b>
              <u>Drug Batch:</u>
            </b>
          </h3>
          <span>
            <b>Batch ID: </b>
            {MED[ID].batchId}
          </span>
          <br />
          <span>
            <b>Name:</b> {MED[ID].drugName}
          </span>
          <br />
          <span>
            <b>Description: </b>
            {MED[ID].batchDescription}
          </span>
          <br />
          <span>
            <b>Current stage: </b>
            {MedStage[ID]}
          </span>
        </article>
        <hr />
        <br />
        <section className="row">
          <article className="col-3">
            <h4>
              <u>Raw Materials Supplied by:</u>
            </h4>
            <p>
              <b>Supplier ID: </b>
              {RMS[MED[ID].RMSid].id}
            </p>
            <p>
              <b>Name:</b> {RMS[MED[ID].RMSid].name}
            </p>
            <p>
              <b>Place: </b>
              {RMS[MED[ID].RMSid].place}
            </p>
          </article>
          <span>&#10132;</span>
          <article className="col-3">
            <h4>
              <u>Manufactured by:</u>
            </h4>
            <p>
              <b>Manufacturer ID: </b>
              {MAN[MED[ID].MANid].id}
            </p>
            <p>
              <b>Name:</b> {MAN[MED[ID].MANid].name}
            </p>
            <p>
              <b>Place: </b>
              {MAN[MED[ID].MANid].place}
            </p>
          </article>
        </section>
        <button
          onClick={() => {
            showTrackTillManufacture(false);
          }}
          className="btn btn-outline-success btn-sm"
        >
          Track Another Item
        </button>
        <span
          onClick={() => {
            history.push("/");
          }}
          className="btn btn-outline-danger btn-sm"
        >
          {" "}
          HOME
        </span>
      </div>
    );
  }
  if (TrackTillRMS) {
    return (
      <div className="container-xl">
        <article className="col-4">
          <h3>
            <b>
              <u>Drug Batch:</u>
            </b>
          </h3>
          <span>
            <b>Batch ID: </b>
            {MED[ID].id}
          </span>
          <br />
          <span>
            <b>Name:</b> {MED[ID].name}
          </span>
          <br />
          <span>
            <b>Description: </b>
            {MED[ID].description}
          </span>
          <br />
          <span>
            <b>Current stage: </b>
            {MedStage[ID]}
          </span>
        </article>
        <hr />
        <br />
        <section className="row">
          <article className="col-3">
            <h4>
              <u>Raw Materials Supplied by:</u>
            </h4>
            <p>
              <b>Supplier ID: </b>
              {RMS[MED[ID].RMSid].id}
            </p>
            <p>
              <b>Name:</b> {RMS[MED[ID].RMSid].name}
            </p>
            <p>
              <b>Place: </b>
              {RMS[MED[ID].RMSid].place}
            </p>
          </article>
        </section>
        <button
          onClick={() => {
            showTrackTillRMS(false);
          }}
          className="btn btn-outline-success btn-sm"
        >
          Track Another Item
        </button>
        <span
          onClick={() => {
            history.push("/");
          }}
          className="btn btn-outline-danger btn-sm"
        >
          {" "}
          HOME
        </span>
      </div>
    );
  }
  if (TrackTillOrdered) {
    return (
      <div className="container-xl">
        <article className="col-4">
          <h3>
            <b>
              <u>Goods:</u>
            </b>
          </h3>
          <span>
            <b>Goods ID: </b>
            {MED[ID].id}
          </span>
          <br />
          <span>
            <b>Name:</b> {MED[ID].name}
          </span>
          <br />
          <span>
            <b>Description: </b>
            {MED[ID].description}
          </span>
          <br />
          <span>
            <b>Current stage: </b>
            {MedStage[ID]}
          </span>
          <hr />
          <br />
          <h5>Batch Not Yet Processed...</h5>
          <button
            onClick={() => {
              showTrackTillOrdered(false);
            }}
            className="btn btn-outline-success btn-sm"
          >
            Track Another Item
          </button>
          <span
            onClick={() => {
              history.push("/");
            }}
            className="btn btn-outline-danger btn-sm"
          >
            {" "}
            HOME
          </span>
        </article>
        {/* <section className="row">
                    
                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                </section> */}
      </div>
    );
  }
  const handlerChangeID = (event) => {
    setID(event.target.value);
  };
    const handlerSubmit = async (event) => {
    event.preventDefault();
    var ctr = await SupplyChain.methods.batchCtr().call();
    if (!(ID > 0 && ID <= ctr)) alert("Invalid Batch ID!!!");
    else {
      // eslint-disable-next-line
      if (MED[ID].status == 5) showTrackTillSold(true);
      // eslint-disable-next-line
      else if (MED[ID].status == 4) showTrackTillRetail(true);
      // eslint-disable-next-line
      else if (MED[ID].status == 3) showTrackTillDistribution(true);
      // eslint-disable-next-line
      else if (MED[ID].stage == 2) showTrackTillManufacture(true);
      // eslint-disable-next-line
      else if (MED[ID].stage == 1) showTrackTillRMS(true);
      else showTrackTillOrdered(true);
    }
  };

  return (
    <div>
      <div className="account-info"><b>Current Account:</b> {currentaccount}</div>

      <h5>Track a Drug Batch</h5>
      <form onSubmit={handlerSubmit}>
        <input
          className="form-control-sm"
          type="text"
          onChange={handlerChangeID}
          placeholder="Enter Batch ID"
          required
        />
        <button type="submit" className="btn btn-primary btn-sm">Track</button>
      </form>

      <hr />

      <h5>Live Batch Overview</h5>
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
    </div>
  );
}

export default Track;
