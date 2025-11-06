# README.md — PharmaTrace (Final)

## PharmaTrace – Blockchain-Based Pharmaceutical Supply Chain

**PharmaTrace** is a modular Solidity smart‑contract system that brings **traceability, authenticity, and accountability** to the pharmaceutical supply chain. Each stage—from raw material sourcing to patient dispensing—is recorded on‑chain for auditability and counterfeit prevention.

---

### Table of Contents

* [Architecture](#architecture)
* [Workflow](#workflow)
* [Folder Structure](#folder-structure)
* [Contract Components](#contract-components)
* [Getting Started](#getting-started)
* [Compilation & Testing](#compilation--testing)
* [Deployment](#deployment)
* [Design Rationale](#design-rationale)
* [Security Notes](#security-notes)
* [Roadmap](#roadmap)
* [Contributors](#contributors)
* [License](#license)

---

## Architecture

PharmaTrace follows a **modular architecture** that separates concerns across ownership/permissions, data storage, lifecycle logic, events, utilities, and an integration façade.

* `AccessControl.sol` — ownership & permissions
* `BatchStorage.sol` — on‑chain data model for entities & batches
* `StatusEvents.sol` — events for lifecycle transitions & registrations
* `HelperUtils.sol` — reusable validations & lookups
* `BatchLifecycle.sol` — state machine for a batch’s journey
* `PharmaTrace.sol` — top‑level integrator that wires the modules

## Workflow

1. **Ingredient Supplier** registers & supplies raw materials.
2. **Pharmaceutical Lab** manufactures a batch.
3. **Wholesaler** transports the batch to pharmacies.
4. **Pharmacy** verifies and dispenses to patients.

## Folder Structure

```
PharmaTrace-Draft/
│
├── contracts/
│   ├── AccessControl.sol         # Kevin Patel
│   ├── BatchLifecycle.sol        # Kevin Patel
│   ├── PharmaTrace.sol           # Kevin Patel (integration)
│   ├── StatusEvents.sol          # Hardeep Patel
│   ├── BatchStorage.sol          # Akhil Jethwa
│   ├── HelperUtils.sol           # Krish Vasoya
│   └── Migrations.sol            # Kevin Patel
│
├── README.md
└── LICENSE
```

## Components — Responsibilities & Key APIs (No code)

This section describes each component’s purpose and main interactions without including code.

### AccessControl.sol — Kevin Patel

**Purpose:** Centralized ownership and participant role management.
**Key data:** Contract owner; mapping of addresses to roles (Supplier, Lab, Wholesaler, Pharmacy, None).
**Key APIs (described):**

* **transferOwnership(newOwner):** Change the contract owner.
* **setRole(account, role):** Assign or update a participant’s role.
* **getRole(account) → Role:** Read the current role for an address.

### BatchStorage.sol — Akhil Jethwa

**Purpose:** On‑chain data model for entities and drug batches.
**Key data:** Entity registry (id, address, role, status, infoURI); batch records (id, SKU, current holder, status, metadata URI).
**Key APIs (described):**

* **createBatch(sku, supplier, lab, metadataURI) → batchId:** Persist a new batch.
* **getBatch(id) → Batch:** Retrieve full batch record.
* **getEntityId(account) → entityId:** Lookup an entity by address.

### StatusEvents.sol — Hardeep Patel

**Purpose:** Shared event definitions to support transparency and real‑time indexing.
**Emits:**

* **EntityRegistered:** When a participant is added/updated.
* **BatchCreated:** When a new batch is created.
* **BatchStatusChanged:** On each lifecycle transition.
* **Dispensed:** When a batch is dispensed to a patient.

### HelperUtils.sol — Krish Vasoya

**Purpose:** Internal validation and lookup helpers reused by lifecycle logic.
**Examples (described):**

* Check that an entity is registered before acting.
* Guard against zero/invalid addresses and malformed input.

### BatchLifecycle.sol — Kevin Patel

**Purpose:** State machine that governs a batch’s journey through the supply chain.
**Lifecycle:** Created → IngredientsVerified → Manufactured → InTransit → AtPharmacy → Dispensed.
**Key APIs (described):**

* **createBatch(...):** Initialize a batch and emit creation events.
* **verifyIngredients(id):** Confirm raw material verification.
* **manufacture(id):** Mark batch as produced by the lab.
* **markInTransit(id, to):** Handover to next holder (e.g., wholesaler).
* **receiveAtPharmacy(id, pharmacy):** Confirm arrival at pharmacy.
* **dispense(id, patient):** Final dispense; emits dispensing event.

### PharmaTrace.sol — Kevin Patel

**Purpose:** Integrator façade that wires AccessControl, BatchStorage, HelperUtils, and StatusEvents; provides convenient entry points.
**Key APIs (described):**

* **setRole(account, role):** Administer participant roles (delegates to AccessControl).
* **newBatch(sku, supplier, lab, uri) → batchId:** Create batches via the unified interface.

### Migrations.sol — Kevin Patel

**Purpose:** Owner‑restricted progress marker for migration workflows.
**Behavior (described):** Tracks `last_completed_migration`, and restricts updating this value to the owner only.

## Getting Started

### Prerequisites

* Node.js ≥ 18
* One of: **Hardhat** or **Truffle**
* **Ganache** (or anvil/Hardhat network) for local testing
* MetaMask (optional, for testnets)

### Install

```bash
# Clone the repository
git clone https://github.com/<your-team-username>/PharmaTrace-Draft.git
cd PharmaTrace-Draft

# Install dependencies (add your own package.json as needed)
npm install
```

## Compilation & Testing

Using **Hardhat**:

```bash
npx hardhat compile
npx hardhat test
```

Using **Truffle**:

```bash
truffle compile
truffle test
```

## Deployment

### Option A — Remix (quickest)

1. Open **Remix IDE**.
2. Upload all files from `contracts/`.
3. Select **PharmaTrace.sol** as the deployable.
4. Deploy to JavaScript VM (London) or an Ethereum test network.

### Option C — Hardhat (example)

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

*(Provide your own deploy script and network config.)*

## Design Rationale

* **Modularity**: clean separation of data, logic, events, and integration.
* **Enum‑based statuses**: readable and auditable lifecycle.
* **Events‑first**: supports dashboards and real‑time UX.
* **Efficient storage**: structs + mappings for scalable on‑chain records.
* **Extensibility**: ready for NFTs/IoT tags, oracles, and more roles.

## Security Notes

* Restrict critical mutations behind `onlyOwner`/roles.
* Validate actors and state transitions defensively.
* Carefully scope external calls; prefer checks‑effects‑interactions.
* Consider pausable/emergency stops for production.

## Roadmap

* Role granularity & multi‑sig ownership.
* Off‑chain data anchors (e.g., IPFS) for batch certificates.
* Oracle hooks for IoT telemetry.
* Front‑end dashboard with event subscriptions.

## Contributors

| Member        | GitHub        | Contribution                                                     |
| ------------- | ------------- | ---------------------------------------------------------------- |
| Kevin Patel   | @patelkevin45 | Access Control, Batch Lifecycle, Integration, **Migrations.sol** |
| Hardeep Patel | @HardeepPatel | Status Events Module                                             |
| Akhil Jethwa  | @Akhil-77     | Batch Storage Module                                             |
| Krish Vasoya  | @KrishVasoya  | Helper Utilities Module                                          |

## License

This project is licensed under the **MIT License**. See `LICENSE` for details.

---

# Canvas_Submission.md — Summary (Final)

## Title

**PharmaTrace — Blockchain‑Based Pharmaceutical Supply Chain**

## Team & Roles

* **Kevin Patel** — Access Control, Batch Lifecycle, Integration
* **Hardeep Patel** — Status Events
* **Akhil Jethwa** — Batch Storage
* **Krish Vasoya** — Helper Utilities

## Abstract (≈120 words)

PharmaTrace is a Solidity smart‑contract system that traces pharmaceutical products end‑to‑end across suppliers, labs, wholesalers, and pharmacies. By modeling batches as on‑chain state machines, the platform enforces authenticated state transitions, emits auditable events, and preserves an immutable record of custody. The architecture is intentionally modular: permissions in `AccessControl`, data in `BatchStorage`, lifecycle logic in `BatchLifecycle`, event definitions in `StatusEvents`, utilities in `HelperUtils`, and an integrator façade in `PharmaTrace`. This separation enables parallel development, targeted testing, and safer iteration. The result is a transparent, tamper‑evident ledger that reduces counterfeit risk and improves recall responsiveness, while remaining flexible enough to extend with oracles, IoT signals, and off‑chain document anchors.

## Problem & Motivation

Counterfeit and mishandled drugs threaten patient safety. Stakeholders lack a shared, verifiable source of truth for batch provenance and custody. PharmaTrace addresses this by encoding process rules and accountability directly in smart contracts.

## System Design

* **State Machine**: `Created → IngredientsVerified → Manufactured → InTransit → AtPharmacy → Dispensed`.
* **Key Contracts**: AccessControl, BatchStorage, StatusEvents, HelperUtils, BatchLifecycle, PharmaTrace (integrator).
* **Events**: Entity registration, batch transitions, dispensing.
* **Data Model**: Structs/mappings for entities & batches with unique IDs and counters.

## How to Run

* **Local**: Ganache/Hardhat network → `npx hardhat compile && npx hardhat test` or `truffle compile && truffle test`.
* **Deploy**: Remix (PharmaTrace.sol), or `truffle migrate --network development`.

## Evaluation (Draft)

* Verified state transitions fire expected events.
* Access‑controlled functions revert on unauthorized callers.
* Storage mappings correctly persist per‑batch histories.

## Limitations & Future Work

* Add granular roles and multi‑sig owner.
* Off‑chain docs (IPFS) and oracle feeds for IoT telemetry.
* Front‑end dashboard with real‑time event stream.

## Repository

[https://github.com/patelkevin45/CSE540_blockchain-medical-supply-chain.git](https://github.com/patelkevin45/CSE540_blockchain-medical-supply-chain.git)

## Statement of Originality

We affirm this submission is our own work. Third‑party resources are cited in code comments or documentation where applicable.

---

# LICENSE (MIT)

```
MIT License

Copyright (c) 2025 <Your Team>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
