import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import PharmaTraceABI from "./artifacts/PharmaTrace.json"

function AssignRoles() {
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])
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
            const supplychain = new web3.eth.Contract(PharmaTraceABI.abi, networkData.address);
            setSupplyChain(supplychain);
            var i;
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
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }
    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        )

    }
        const handlerChangeAddressRMS = (event) => {
        setRMSaddress(event.target.value);
    }
    const handlerChangePlaceRMS = (event) => {
        setRMSplace(event.target.value);
    }
    const handlerChangeNameRMS = (event) => {
        setRMSname(event.target.value);
    }
    const handlerChangeAddressMAN = (event) => {
        setMANaddress(event.target.value);
    }
    const handlerChangePlaceMAN = (event) => {
        setMANplace(event.target.value);
    }
    const handlerChangeNameMAN = (event) => {
        setMANname(event.target.value);
    }
    const handlerChangeAddressDIS = (event) => {
        setDISaddress(event.target.value);
    }
    const handlerChangePlaceDIS = (event) => {
        setDISplace(event.target.value);
    }
    const handlerChangeNameDIS = (event) => {
        setDISname(event.target.value);
    }
    const handlerChangeAddressRET = (event) => {
        setRETaddress(event.target.value);
    }
    const handlerChangePlaceRET = (event) => {
        setRETplace(event.target.value);
    }
    const handlerChangeNameRET = (event) => {
        setRETname(event.target.value);
    }
    const handlerSubmitRMS = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addIngredientSupplier(RMSaddress, RMSname, RMSplace).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitMAN = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addPharmaceuticalLab(MANaddress, MANname, MANplace).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitDIS = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addWholesaler(DISaddress, DISname, DISplace).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitRET = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addPharmacy(RETaddress, RETname, RETplace).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }



    return (
        <div>
            <div className="account-info"><b>Current Account:</b> {currentaccount}</div>

            {/* Ingredient Suppliers */}
            <h5>Register Ingredient Supplier</h5>
            <form onSubmit={handlerSubmitRMS}>
                <input className="form-control-sm" type="text" onChange={handlerChangeAddressRMS} placeholder="Ethereum Address" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeNameRMS} placeholder="Supplier Name" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePlaceRMS} placeholder="Location" required />
                <button className="btn btn-primary btn-sm" type="submit">Register</button>
            </form>
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
                    {Object.keys(RMS).map(key => (
                        <tr key={key}>
                            <td>{RMS[key].id}</td>
                            <td>{RMS[key].name}</td>
                            <td>{RMS[key].place}</td>
                            <td>{RMS[key].addr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />

            {/* Pharmaceutical Labs */}
            <h5>Register Pharmaceutical Lab</h5>
            <form onSubmit={handlerSubmitMAN}>
                <input className="form-control-sm" type="text" onChange={handlerChangeAddressMAN} placeholder="Ethereum Address" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeNameMAN} placeholder="Lab Name" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePlaceMAN} placeholder="Location" required />
                <button className="btn btn-primary btn-sm" type="submit">Register</button>
            </form>
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
                    {Object.keys(MAN).map(key => (
                        <tr key={key}>
                            <td>{MAN[key].id}</td>
                            <td>{MAN[key].name}</td>
                            <td>{MAN[key].place}</td>
                            <td>{MAN[key].addr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />

            {/* Wholesalers */}
            <h5>Register Wholesaler</h5>
            <form onSubmit={handlerSubmitDIS}>
                <input className="form-control-sm" type="text" onChange={handlerChangeAddressDIS} placeholder="Ethereum Address" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeNameDIS} placeholder="Wholesaler Name" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePlaceDIS} placeholder="Location" required />
                <button className="btn btn-primary btn-sm" type="submit">Register</button>
            </form>
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
                    {Object.keys(DIS).map(key => (
                        <tr key={key}>
                            <td>{DIS[key].id}</td>
                            <td>{DIS[key].name}</td>
                            <td>{DIS[key].place}</td>
                            <td>{DIS[key].addr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />

            {/* Pharmacies */}
            <h5>Register Pharmacy</h5>
            <form onSubmit={handlerSubmitRET}>
                <input className="form-control-sm" type="text" onChange={handlerChangeAddressRET} placeholder="Ethereum Address" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeNameRET} placeholder="Pharmacy Name" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePlaceRET} placeholder="Location" required />
                <button className="btn btn-primary btn-sm" type="submit">Register</button>
            </form>
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
                    {Object.keys(RET).map(key => (
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
    );
}

export default AssignRoles
