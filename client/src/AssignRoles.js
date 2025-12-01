import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/MedChain.json";

function AssignRoles() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();

  const [RMSname, setRMSname] = useState();
  const [MANname, setMANname] = useState();
  const [DISname, setDISname] = useState();
  const [RETname, setRETname] = useState();

  const [RMSplace, setRMSplace] = useState();
  const [MANplace, setMANplace] = useState();
  const [DISplace, setDISplace] = useState();
  const [RETplace, setRETplace] = useState();

  const [RMSaddress, setRMSaddress] = useState();
  const [MANaddress, setMANaddress] = useState();
  const [DISaddress, setDISaddress] = useState();
  const [RETaddress, setRETaddress] = useState();

  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();

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
      const rmsCtr = await supplychain.methods.supplierCtr().call();
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i] = await supplychain.methods.Suppliers(i + 1).call();
      }
      setRMS(rms);

      const manCtr = await supplychain.methods.labCtr().call();
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i] = await supplychain.methods.Labs(i + 1).call();
      }
      setMAN(man);

      const disCtr = await supplychain.methods.wholesalerCtr().call();
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i] = await supplychain.methods.Wholesalers(i + 1).call();
      }
      setDIS(dis);

      const retCtr = await supplychain.methods.pharmacyCtr().call();
      const ret = {};
      for (i = 0; i < retCtr; i++) {
        ret[i] = await supplychain.methods.Pharmacies(i + 1).call();
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

  // Handlers
  const handlerChangeAddressRMS = (event) => setRMSaddress(event.target.value);
  const handlerChangePlaceRMS = (event) => setRMSplace(event.target.value);
  const handlerChangeNameRMS = (event) => setRMSname(event.target.value);

  const handlerChangeAddressMAN = (event) => setMANaddress(event.target.value);
  const handlerChangePlaceMAN = (event) => setMANplace(event.target.value);
  const handlerChangeNameMAN = (event) => setMANname(event.target.value);

  const handlerChangeAddressDIS = (event) => setDISaddress(event.target.value);
  const handlerChangePlaceDIS = (event) => setDISplace(event.target.value);
  const handlerChangeNameDIS = (event) => setDISname(event.target.value);

  const handlerChangeAddressRET = (event) => setRETaddress(event.target.value);
  const handlerChangePlaceRET = (event) => setRETplace(event.target.value);
  const handlerChangeNameRET = (event) => setRETname(event.target.value);

  // Submitters (API calls unchanged)
  const handlerSubmitRMS = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .addIngredientSupplier(RMSaddress, RMSname, RMSplace)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitMAN = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .addPharmaceuticalLab(MANaddress, MANname, MANplace)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitDIS = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .addWholesaler(DISaddress, DISname, DISplace)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };

  const handlerSubmitRET = async (event) => {
    event.preventDefault();
    try {
      const reciept = await SupplyChain.methods
        .addPharmacy(RETaddress, RETname, RETplace)
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
          <h1 className="page-title">Ecosystem roles registry</h1>
          <p className="page-subtitle">
            Onboard every organization that is allowed to touch a medicine batch.
          </p>
        </div>
        <div className="page-header-meta">
          <div className="account-info">
            <b>Current Account:</b>&nbsp;{currentaccount}
          </div>
        </div>
      </header>

      <section className="card-grid">
        {/* Source partners */}
        <article className="section-card">
          <div className="section-header">
            <h2 className="section-title">Source partners</h2>
            <p className="section-description">
              Organizations that provide raw materials for formulation.
            </p>
          </div>

          <form onSubmit={handlerSubmitRMS}>
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeAddressRMS}
              placeholder="Wallet address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeNameRMS}
              placeholder="Source partner name"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangePlaceRMS}
              placeholder="Region / city"
              required
            />
            <button className="btn btn-primary btn-sm" type="submit">
              Register source partner
            </button>
          </form>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(RMS).map((key) => (
                  <tr key={key}>
                    <td>{RMS[key].id}</td>
                    <td>{RMS[key].name}</td>
                    <td>{RMS[key].place}</td>
                    <td>{RMS[key].addr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Formulation centers */}
        <article className="section-card">
          <div className="section-header">
            <h2 className="section-title">Formulation centers</h2>
            <p className="section-description">
              Facilities that manufacture finished medicine batches.
            </p>
          </div>

          <form onSubmit={handlerSubmitMAN}>
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeAddressMAN}
              placeholder="Wallet address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeNameMAN}
              placeholder="Formulation center name"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangePlaceMAN}
              placeholder="Region / city"
              required
            />
            <button className="btn btn-primary btn-sm" type="submit">
              Register formulation center
            </button>
          </form>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(MAN).map((key) => (
                  <tr key={key}>
                    <td>{MAN[key].id}</td>
                    <td>{MAN[key].name}</td>
                    <td>{MAN[key].place}</td>
                    <td>{MAN[key].addr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="card-grid">
        {/* Transit hubs */}
        <article className="section-card">
          <div className="section-header">
            <h2 className="section-title">Transit hubs</h2>
            <p className="section-description">
              Logistics nodes that move batches between formulation and care.
            </p>
          </div>

          <form onSubmit={handlerSubmitDIS}>
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeAddressDIS}
              placeholder="Wallet address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeNameDIS}
              placeholder="Transit hub name"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangePlaceDIS}
              placeholder="Region / city"
              required
            />
            <button className="btn btn-primary btn-sm" type="submit">
              Register transit hub
            </button>
          </form>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(DIS).map((key) => (
                  <tr key={key}>
                    <td>{DIS[key].id}</td>
                    <td>{DIS[key].name}</td>
                    <td>{DIS[key].place}</td>
                    <td>{DIS[key].addr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Care outlets */}
        <article className="section-card">
          <div className="section-header">
            <h2 className="section-title">Care outlets</h2>
            <p className="section-description">
              Patient-facing outlets that dispense medicines.
            </p>
          </div>

          <form onSubmit={handlerSubmitRET}>
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeAddressRET}
              placeholder="Wallet address"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangeNameRET}
              placeholder="Care outlet name"
              required
            />
            <input
              className="form-control-sm"
              type="text"
              onChange={handlerChangePlaceRET}
              placeholder="Region / city"
              required
            />
            <button className="btn btn-primary btn-sm" type="submit">
              Register care outlet
            </button>
          </form>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(RET).map((key) => (
                  <tr key={key}>
                    <td>{RET[key].id}</td>
                    <td>{RET[key].name}</td>
                    <td>{RET[key].place}</td>
                    <td>{RET[key].addr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}

export default AssignRoles;
