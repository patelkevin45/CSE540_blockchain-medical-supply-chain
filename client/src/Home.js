import React from "react";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();
  const redirect_to_roles = () => {
    history.push("/roles");
  };
  const redirect_to_addmed = () => {
    history.push("/addmed");
  };
  const redirect_to_supply = () => {
    history.push("/supply");
  };
  const redirect_to_track = () => {
    history.push("/track");
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Welcome to MedChain Nexus</h1>
          <p className="page-subtitle">
            A visual, on-chain control panel for your medicine supply lifecycle.
          </p>
        </div>
      </header>

      <section className="card-grid">
        <article className="info-card">
          <h2>1. Register ecosystem roles</h2>
          <p>
            The contract owner onboards <b>source partners</b>,{" "}
            <b>formulation centers</b>, <b>transit hubs</b> and{" "}
            <b>care outlets</b>. This is a one-time setup step for each
            organization.
          </p>
          <div className="card-actions">
            <button onClick={redirect_to_roles} className="btn btn-primary">
              Open “Roles” screen
            </button>
          </div>
        </article>

        <article className="info-card">
          <h2>2. Create drug batches</h2>
          <p>
            Once the network is configured, create on-chain drug batches that
            can be tracked end-to-end by ID.
          </p>
          <div className="card-actions">
            <button
              onClick={redirect_to_addmed}
              className="btn btn-outline-primary"
            >
              Create a new batch
            </button>
          </div>
        </article>
      </section>

      <section className="card-grid">
        <article className="info-card">
          <h2>3. Orchestrate movement</h2>
          <p>
            Participants move batches through sourcing, formulation, transit and
            patient dispensing using a single control surface.
          </p>
          <div className="card-actions">
            <button
              onClick={redirect_to_supply}
              className="btn btn-outline-primary"
            >
              Open supply control
            </button>
          </div>
        </article>

        <article className="info-card">
          <h2>4. Track &amp; verify</h2>
          <p>
            Auditors, partners or patients can independently verify where a
            batch has been and who handled it.
          </p>
          <div className="card-actions">
            <button
              onClick={redirect_to_track}
              className="btn btn-outline-primary"
            >
              Track a batch
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Home;
