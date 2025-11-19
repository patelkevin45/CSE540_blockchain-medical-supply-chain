# PharmaTrace: A Blockchain-Based Pharmaceutical Supply Chain

PharmaTrace is a decentralized application (DApp) that demonstrates a transparent and secure pharmaceutical supply chain using blockchain technology. It tracks drug batches from the ingredient supplier to the end consumer, ensuring authenticity and integrity at every stage.

---

## Table of Contents

* [Technology Stack](#technology-stack)
* [Project Overview](#project-overview)
* [Architecture](#architecture)
* [Setting up Local Development](#setting-up-local-development)

  * [Step 1. Installation and Setup](#step-1-installation-and-setup)
  * [Step 2. Create, Compile & Deploy Smart Contract](#step-2-create-compile--deploy-smart-contract)
  * [Step 3. Run the DApp](#step-3-run-the-dapp)
  * [Step 4. Connect MetaMask with Ganache](#step-4-connect-metamask-with-ganache)
* [Project Structure](#project-structure)
* [Testing](#testing)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

## Technology Stack

* **Blockchain**: Ethereum
* **Smart Contracts**: Solidity
* **Frontend**: React.js
* **Development Environment**: Truffle & Ganache
* **Wallet**: MetaMask

## Project Overview

* **Role-Based Access Control**: The contract owner registers participants (Suppliers, Labs, Wholesalers, Pharmacies).
* **Batch Creation**: The owner can order new drug batches.
* **Supply Chain Management**: Registered participants can process and advance batches through the supply chain.
* **Tracking**: Anyone can track the journey of a drug batch to verify its history.

## Architecture

* **Smart Contracts (Solidity):** Core supply-chain logic and events.
* **Truffle:** Compile, migrate, and test contracts.
* **Ganache:** Local Ethereum JSON‑RPC for development.
* **Client (React):** Frontend UI using Web3 to call contract methods.
* **MetaMask:** Browser wallet to sign transactions against Ganache.

---

## Setting up Local Development

### Step 1. Installation and Setup

* **IDE:** Any IDE works; Visual Studio Code is a good choice.
* **Node.js:** Download the latest LTS from [https://nodejs.org/](https://nodejs.org/) and verify:

  ```bash
  node -v
  ```
* **Git:** Download from [https://git-scm.com/downloads](https://git-scm.com/downloads) and verify:

  ```bash
  git --version
  ```
* **Truffle (global):**

  ```bash
  npm install -g truffle
  ```
* **Ganache:** Install from [https://www.trufflesuite.com/ganache](https://www.trufflesuite.com/ganache) (GUI or CLI).
* **MetaMask:** Install the browser extension for Chrome or Firefox.

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

   * Open Ganache and create a new Workspace.
   * Note the **RPC Server URL** (e.g., `http://127.0.0.1:7545`) and the **Chain ID/Network ID** (often `1337` or `5777`).

4. **Configure Truffle to use Ganache** — edit `truffle-config.js`:

   ```js
   // truffle-config.js (excerpt)
   module.exports = {
     networks: {
       development: {
         host: "127.0.0.1",   // Replace if your Ganache host differs
         port: 7545,          // Replace with your Ganache RPC port
         network_id: "*",     // Match any network id
       },
     },
     // compilers: { solc: { version: "pragma" } }
   };
   ```

   The RPC server lets your app deploy contracts, send transactions, and query on‑chain data.

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

Open another terminal and start the client:

```bash
cd client
npm i
# If web3 isn't already in the client deps:
npm install --save web3
npm start
```

By default, the app runs at [http://localhost:3000](http://localhost:3000).

### Step 4. Connect MetaMask with Ganache

1. **Add a custom network in MetaMask:**

   * Open MetaMask → network dropdown → Add network → Add a network manually (or Custom RPC).
   * **Network name:** Ganache Local (any name)
   * **New RPC URL:** Ganache RPC (e.g., `http://127.0.0.1:7545`)
   * **Chain ID / Network ID:** As shown in Ganache (often `1337` or `5777`).
2. **Import accounts (development only):**

   * In Ganache, copy the **Private Key** of an account.
   * In MetaMask, **Import account** → paste the key → **Import**.
   * ⚠️ Never use these private keys outside local development.
3. **Use multiple participants:**

   * Import additional Ganache accounts to represent roles (Supplier, Lab, Wholesaler, Pharmacy) and perform role‑based actions in the app.

---

## Project Structure

```
blockchain-medical-supply-chain/
├─ contracts/
├─ migrations/
├─ test/
├─ truffle-config.js
├─ package.json
├─ package-lock.json
└─ client/
```

## Testing

Run Truffle tests:

```bash
truffle test
```

## Troubleshooting

* **MetaMask on wrong network:** Switch to your Ganache network in MetaMask.
* **Migrations failing:** Ensure Ganache is running and `truffle-config.js` host/port match Ganache’s RPC.
* **ABI/artifacts not found in client:** Re‑migrate and verify the client points to the correct build artifacts.
* **Port already in use (3000):** Stop other apps or run `PORT=3001 npm start` (macOS/Linux) or `set PORT=3001 && npm start` (Windows CMD).

## License

See the [LICENSE](./LICENSE) file for license information.
