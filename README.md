# MedChain Nexus (formerly MedChain): A Blockchain-Based Pharmaceutical Supply Chain

MedChain Nexus is a decentralized application (DApp) that demonstrates a transparent and secure pharmaceutical supply chain using blockchain technology. It tracks drug batches from the ingredient supplier to the end consumer, ensuring authenticity and integrity at every stage.

> **Note:** The underlying smart contract is still named `MedChain` and some project files may still reference the original name, but the user-facing application and documentation now use the name **MedChain Nexus**.

---

## Table of Contents

- [Project Description](#project-description)
- [Technology Stack](#technology-stack)
- [Dependencies & Setup](#dependencies--setup)
- [Architecture](#architecture)
- [Setting up Local Development](#setting-up-local-development)
  - [Step 1. Installation and Setup](#step-1-installation-and-setup)
  - [Step 2. Create, Compile & Deploy Smart Contract](#step-2-create-compile--deploy-smart-contract)
  - [Step 3. Run the DApp](#step-3-run-the-dapp)
  - [Step 4. Connect MetaMask with Ganache](#step-4-connect-metamask-with-ganache)
- [Using the DApp (MedChain Nexus Workflows)](#using-the-dapp-medchain-nexus-workflows)
  - [1. Register ecosystem roles](#1-register-ecosystem-roles)
  - [2. Create a new drug batch](#2-create-a-new-drug-batch)
  - [3. Move a batch through the supply chain](#3-move-a-batch-through-the-supply-chain)
  - [4. Track a batch](#4-track-a-batch)
  - [5. View logs & contract transactions](#5-view-logs--contract-transactions)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Project Description

MedChain Nexus (formerly MedChain) is a full-stack blockchain application that models a pharmaceutical supply chain end-to-end. It focuses on:

- **Role-Based Access Control:**  
  Only registered participants (source partners, formulation centers, transit hubs, care outlets) can perform specific actions in the supply chain.
- **Immutable Batch Tracking:**  
  Each drug batch is created with a unique on-chain ID and moves through well-defined stages (Pending → Ingredients Sourced → Production → In Transit → At Pharmacy → Dispensed).
- **Transparency & Auditability:**  
  Anyone can query the blockchain to verify where a batch has been and which organization handled it.
- **User-Friendly Interface:**  
  A redesigned frontend (“MedChain Nexus”) with a dashboard, guided workflow, and a dedicated **Logs / Transactions** page for demos and auditing.

### Key Features (Updated for MedChain Nexus)

- Modern **Home/Dashboard** summarizing the four main steps: register roles, create batches, control supply chain, and track.
- **Roles screen** to onboard:
  - Source partners (ingredient suppliers)  
  - Formulation centers (labs)  
  - Transit hubs (wholesalers / logistics)  
  - Care outlets (pharmacies / hospitals)
- **New Batch screen** to mint on-chain drug batches with human-readable names and descriptions.
- **Supply Control screen** to move batches through each stage using the correct role/account.
- **Track screen** to search any batch ID and visualize:
  - Current status  
  - Full journey through all organizations  
  - Live overview table of all batches
- **Logs / Contract Transactions screen**:
  - Shows every Ethereum transaction sent to the `MedChain` contract on Ganache  
  - Labels deployment vs function calls  
  - Shows decoded function names, arguments, sender, and transaction hashes  
  - Useful for debugging and presentation/audit.

---

## Technology Stack

- **Blockchain:** Ethereum (local Ganache network)
- **Smart Contracts:** Solidity (`MedChain.sol`)
- **Frontend:** React.js (MedChain Nexus UI)
- **Development Environment:** Truffle & Ganache
- **Wallet:** MetaMask
- **Web3 Library:** web3.js

---

## Dependencies & Setup

To build and run MedChain Nexus, you will need:

- **Node.js & npm** (LTS recommended)  
- **Git**  
- **Truffle** (installed globally)  
- **Ganache** (GUI or CLI)  
- **MetaMask** browser extension  
- **A code editor** (e.g., VS Code)

See the detailed steps below for installation and configuration.

---

## Architecture

- **Smart Contracts (Solidity):**  
  Implement the core supply-chain logic, role registration, and batch lifecycle in the `MedChain` contract. Optional events or transaction inspection enable detailed logging.

- **Truffle:**  
  Used to compile and migrate contracts to a local Ethereum network.

- **Ganache:**  
  Local Ethereum JSON-RPC node for development and testing. Provides test accounts and mined blocks instantly.

- **Client (React + Web3):**  
  The MedChain Nexus frontend:
  - Connects to MetaMask
  - Reads the contract’s ABI and address from `MedChain.json`
  - Calls functions like `createDrugBatch`, `sourceIngredients`, etc.
  - Renders status tables and transaction logs.

- **MetaMask:**  
  Browser wallet for:
  - Selecting a role account (supplier, lab, etc.)
  - Signing transactions against the Ganache network.

---

## Setting up Local Development

### Step 1. Installation and Setup

1. **IDE:**  
   Any IDE works; Visual Studio Code is a good choice.

2. **Node.js:**  
   Download the latest LTS from <https://nodejs.org/> and verify:

   ```bash
   node -v
   ```

3. **Git:**  
   Download from <https://git-scm.com/downloads> and verify:

   ```bash
   git --version
   ```

4. **Truffle (global):**

   ```bash
   npm install -g truffle
   ```

5. **Ganache:**  
   Install from <https://www.trufflesuite.com/ganache> (GUI or CLI).

6. **MetaMask:**  
   Install the browser extension for Chrome or Firefox.

### Step 2. Create, Compile & Deploy Smart Contract

1. **Clone Project & Open in IDE:**

   ```bash
   git clone https://github.com/patelkevin45/CSE540_blockchain-medical-supply-chain.git
   cd CSE540_blockchain-medical-supply-chain
   # (optional) open in VS Code
   code .
   ```

2. **Install project dependencies (root):**

   ```bash
   npm i
   ```

3. **Start Ganache & capture RPC info:**

   - Open Ganache and create a new Workspace.
   - Note the **RPC Server URL** (e.g., `http://127.0.0.1:7545`) and the **Chain ID/Network ID** (often `1337` or `5777`).

4. **Configure Truffle to use Ganache** — edit `truffle-config.js`:

   ```js
   // truffle-config.js (excerpt)
   module.exports = {
     networks: {
       development: {
         host: "127.0.0.1",  // Replace if your Ganache host differs
         port: 7545,         // Replace with your Ganache RPC port
         network_id: "*",    // Match any network id
       },
     },
     // compilers: { solc: { version: "pragma" } }
   };
   ```

5. **Compile contracts:**

   ```bash
   truffle compile
   ```

6. **Deploy (migrate) contracts to Ganache:**

   ```bash
   truffle migrate
   # Re-deploy after changes:
   # truffle migrate --reset
   ```

### Step 3. Run the DApp

Open another terminal and start the React client:

```bash
cd client
npm i
# If web3 isn't already in the client deps:
npm install --save web3
npm start
```

By default, the app runs at <http://localhost:3000>.

### Step 4. Connect MetaMask with Ganache

1. **Add a custom network in MetaMask:**

   - Open MetaMask → network dropdown → Add network → Add a network manually (or Custom RPC).
   - **Network name:** Ganache Local (any name)
   - **New RPC URL:** Ganache RPC (e.g., `http://127.0.0.1:7545`)
   - **Chain ID / Network ID:** As shown in Ganache (often `1337` or `5777`).

2. **Import accounts (development only):**

   - In Ganache, copy the **Private Key** of an account.
   - In MetaMask, **Import account** → paste the key → **Import**.
   - ⚠️ Never use these private keys outside local development.

3. **Use multiple participants:**

   - Import additional Ganache accounts to represent roles:
     - **Source partner** (ingredient supplier)
     - **Formulation center** (lab)
     - **Transit hub** (wholesaler/logistics)
     - **Care outlet** (pharmacy/hospital)
   - Use these different accounts in MetaMask to perform role-based actions in the DApp.

---

## Using the DApp (MedChain Nexus Workflows)

Once the contract is deployed and the React app is running:

### 1. Register ecosystem roles

Navigate to the **Roles** page.

- Use the owner account (first Ganache account) in MetaMask.
- For each role type:
  - Enter a **wallet address**, **name**, and **location**.
  - Click **Register**.
- Roles:
  - **Source partners** – ingredient suppliers  
  - **Formulation centers** – labs  
  - **Transit hubs** – wholesalers / logistics  
  - **Care outlets** – pharmacies / hospitals

Each registration stores the organization on-chain and allows that address to call specific supply-chain functions.

### 2. Create a new drug batch

Navigate to the **New Batch** page.

- Fill in:
  - **Drug name** – e.g., “Paracetamol 500mg”
  - **Batch description** – e.g., “Blister packs, 1000 units”
- Click **Create batch**.
- The batch appears in the **Existing drug batches** table with a unique `batchId` and initial status `Batch Order Pending`.

This calls `createDrugBatch` in the `MedChain` contract.

### 3. Move a batch through the supply chain

Navigate to the **Supply Control** page.

- Use the **Process a batch** section.
- Enter a valid `batchId`.
- Using the correct MetaMask account for each role, call the functions in order:

1. **Supply ingredients** – `sourceIngredients(batchId)`  
   (Source partner account, status → Ingredients Sourced)
2. **Manufacture** – `produceBatch(batchId)`  
   (Formulation center account, status → Production)
3. **Ship to transit hub** – `shipToWholesaler(batchId)`  
   (Transit hub account, status → In Transit)
4. **Ship to care outlet** – `shipToPharmacy(batchId)`  
   (Care outlet account, status → At Pharmacy)
5. **Dispense to patient** – `dispenseToPatient(batchId)`  
   (Same care outlet account, status → Dispensed)

The **Live batch status** table on this page updates to show each status transition.

### 4. Track a batch

Navigate to the **Track** page.

- Enter a `batchId` in the **Track a drug batch** search bar and click **Track**.
- The **Batch details** card shows:
  - Batch ID
  - Drug name
  - Description
  - Current stage (status)
- The **Flow through network** section shows:
  - Source partner
  - Formulation center
  - Transit hub
  - Care outlet

At the bottom, a **Live batch overview** table lists all batches with their current stages, useful for auditors or dashboard views.

### 5. View logs & contract transactions

Navigate to the **Logs** (or **Contract Transactions**) page.

- The app scans all blocks on the local Ganache chain.
- It filters transactions where `to` equals the `MedChain` contract address.
- For each transaction, it decodes:
  - **Type**: Deployment vs Function call
  - **Function name**: e.g., `createDrugBatch`, `sourceIngredients`, etc.
  - **Arguments**: e.g., `batchID: 1`
  - **From address**
  - **Full transaction hash** (with a shortened display)

A summary section shows:

- Total number of transactions to the contract
- Number of deployments
- Count of calls per function name

This serves as a built-in on-chain audit trail and is ideal for explaining system behavior in presentations.

---

## Project Structure

```text
blockchain-medical-supply-chain/
├─ contracts/          # Solidity contracts (e.g., MedChain.sol)
├─ migrations/         # Truffle migration scripts
├─ test/               # Truffle tests
├─ truffle-config.js   # Network & compiler configuration
├─ package.json        # Root Node/Truffle project
├─ package-lock.json
└─ client/             # React frontend (MedChain Nexus UI)
   ├─ src/
   │  ├─ App.js, App.css
   │  ├─ Home.js, AssignRoles.js, AddMed.js, Supply.js, Track.js, Logs.js
   │  └─ artifacts/MedChain.json  # ABI + deployed address
   └─ package.json
```

---

## Testing

Run Truffle tests for the smart contracts:

```bash
truffle test
```

You can add more tests under `test/` to cover additional contract logic or edge cases in the batch lifecycle.

---

## Troubleshooting

- **MetaMask on wrong network:**  
  Switch to your Ganache network in MetaMask.

- **Migrations failing:**  
  - Ensure Ganache is running.  
  - Confirm `truffle-config.js` host/port match Ganache’s RPC.  

- **ABI/artifacts not found in client:**  
  - Re-run `truffle migrate`.  
  - Verify `client/src/artifacts/MedChain.json` is up to date and contains the correct network ID and contract address.

- **React app cannot connect to contract:**  
  - Check that Ganache is running.  
  - Confirm MetaMask is on the right network.  
  - Check the browser console for Web3 or MetaMask errors.

- **Port already in use (3000):**  
  - Stop other apps using port 3000, or  
  - Run `PORT=3001 npm start` (macOS/Linux) or  
  - `set PORT=3001 && npm start` (Windows CMD).

---

## License

See the [LICENSE](./LICENSE) file for license information.
