// src/Track.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/PharmaTrace.json";

function Track() {
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState(null);

  const [MED, setMED] = useState({});
  const [MedStage, setMedStage] = useState({});

  const [RMS, setRMS] = useState({});
  const [MAN, setMAN] = useState({});
  const [DIS, setDIS] = useState({});
  const [RET, setRET] = useState({});

  const [ID, setID] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  // ---------- web3 bootstrapping ----------

  useEffect(() => {
    const init = async () => {
      await loadWeb3();
      await loadBlockchaindata();
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

  const loadBlockchaindata = async () => {
    setloader(true);

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);

    const networkId = await web3.eth.net.getId();
    const networkData = PharmaTraceABI.networks[networkId];

    if (!networkData) {
      window.alert("The smart contract is not deployed to current network");
      setloader(false);
      return;
    }

    const supplychain = new web3.eth.Contract(
      PharmaTraceABI.abi,
      networkData.address
    );
    setSupplyChain(supplychain);

    let i;

    // --- batches + stages ---
    const medCtr = await supplychain.methods.batchCtr().call();
    const med = {};
    const medStage = {};

    for (i = 0; i < medCtr; i++) {
      const idx = i + 1;
      med[idx] = await supplychain.methods.DrugBatches(idx).call();
      medStage[idx] = await supplychain.methods.getBatchStatus(idx).call();
    }
    setMED(med);
    setMedStage(medStage);

    // --- suppliers (source partners) ---
    const rmsCtr = await supplychain.methods.supplierCtr().call();
    const rms = {};
    for (i = 0; i < rmsCtr; i++) {
      const idx = i + 1;
      rms[idx] = await supplychain.methods.Suppliers(idx).call();
    }
    setRMS(rms);

    // --- labs (formulation centers) ---
    const manCtr = await supplychain.methods.labCtr().call();
    const man = {};
    for (i = 0; i < manCtr; i++) {
      const idx = i + 1;
      man[idx] = await supplychain.methods.Labs(idx).call();
    }
    setMAN(man);

    // --- wholesalers (transit hubs) ---
    const disCtr = await supplychain.methods.wholesalerCtr().call();
    const dis = {};
    for (i = 0; i < disCtr; i++) {
      const idx = i + 1;
      dis[idx] = await supplychain.methods.Wholesalers(idx).call();
    }
    setDIS(dis);

    // --- pharmacies (care outlets) ---
    const retCtr = await supplychain.methods.pharmacyCtr().call();
    const ret = {};
    for (i = 0; i < retCtr; i++) {
      const idx = i + 1;
      ret[idx] = await supplychain.methods.Pharmacies(idx).call();
    }
    setRET(ret);

    setloader(false);
  };

  // ---------- loading spinner ----------

  if (loader) {
    return (
      <div>
        <h1 className="wait">Loading...</h1>
      </div>
    );
  }

  // ---------- handlers ----------

  const handleChangeID = (event) => {
    setID(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!SupplyChain) return;

    try {
      setError("");
      const ctr = await SupplyChain.methods.batchCtr().call();
      const numericId = parseInt(ID, 10);

      if (!(numericId > 0 && numericId <= Number(ctr))) {
        setSelectedId(null);
        setError("Invalid batch ID. Please check and try again.");
        return;
      }

      setSelectedId(numericId);
    } catch (err) {
      console.error(err);
      setError("Unable to look up this batch right now.");
    }
  };

  // ---------- derived data for selected batch ----------

  const selectedBatch = selectedId ? MED[selectedId] : null;
  const selectedStage = selectedId ? MedStage[selectedId] : null;

  const sourcePartner =
    selectedBatch && selectedBatch.supplierId
      ? RMS[selectedBatch.supplierId]
      : null;

  const formulationCenter =
    selectedBatch && selectedBatch.labId ? MAN[selectedBatch.labId] : null;

  const transitHub =
    selectedBatch && selectedBatch.wholesalerId
      ? DIS[selectedBatch.wholesalerId]
      : null;

  const careOutlet =
    selectedBatch && selectedBatch.pharmacyId
      ? RET[selectedBatch.pharmacyId]
      : null;

  // ---------- UI ----------

  return (
    <div className="page">
      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Track a drug batch</h1>
          <p className="page-subtitle">
            Look up any batch by ID and see where it has been in the supply
            chain.
          </p>
        </div>
        <div className="page-header-meta">
          <div className="account-info">
            <b>Current Account:</b>&nbsp;{currentaccount}
          </div>
        </div>
      </header>

      {/* Search card */}
      <section className="section-card">
        <h2 className="section-title">Search by batch ID</h2>
        <form onSubmit={handleSubmit} className="track-form">
          <input
            className="form-control-sm"
            type="text"
            onChange={handleChangeID}
            placeholder="Enter batch ID"
            value={ID}
            required
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Track batch
          </button>
        </form>
        {error && (
          <p className="section-hint" style={{ color: "#fca5a5" }}>
            {error}
          </p>
        )}
        {!error && !selectedBatch && (
          <p className="section-hint">
            If the batch has progressed, you'll see a detailed timeline and
            ownership information.
          </p>
        )}
      </section>

      {/* Selected batch details (shown only when ID is valid & selected) */}
      {selectedBatch && (
        <section className="section-card">
          <div className="section-header">
            <h2 className="section-title">Batch details</h2>
            <span className="pill pill-muted">
              Current stage: {selectedStage}
            </span>
          </div>

          <p>
            <b>Batch ID:</b> {selectedBatch.batchId}
          </p>
          <p>
            <b>Drug name:</b> {selectedBatch.drugName}
          </p>
          <p>
            <b>Description:</b> {selectedBatch.batchDescription}
          </p>

          <h3
            className="section-title"
            style={{ marginTop: "1.1rem", marginBottom: "0.45rem" }}
          >
            Flow through network
          </h3>

          <div className="ownership-flow">
            {sourcePartner && (
              <>
                <p>
                  <b>Source partner:</b> {sourcePartner.name} (
                  {sourcePartner.place})
                </p>
                <span className="arrow">&#10132;</span>
              </>
            )}

            {formulationCenter && (
              <>
                <p>
                  <b>Formulation center:</b> {formulationCenter.name} (
                  {formulationCenter.place})
                </p>
                <span className="arrow">&#10132;</span>
              </>
            )}

            {transitHub && (
              <>
                <p>
                  <b>Transit hub:</b> {transitHub.name} ({transitHub.place})
                </p>
                <span className="arrow">&#10132;</span>
              </>
            )}

            {careOutlet && (
              <p>
                <b>Care outlet:</b> {careOutlet.name} ({careOutlet.place})
              </p>
            )}

            {!sourcePartner &&
              !formulationCenter &&
              !transitHub &&
              !careOutlet && (
                <p className="section-hint">
                  This batch has been created but not yet progressed through the
                  network.
                </p>
              )}
          </div>
        </section>
      )}

      {/* Live table overview */}
      <section className="section-card">
        <div className="section-header">
          <h2 className="section-title">Live batch overview</h2>
          <p className="section-description">
            A quick snapshot of all batches and their latest stage.
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
    </div>
  );
}

export default Track;
