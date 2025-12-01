import "./App.css";
import AssignRoles from "./AssignRoles";
import Home from "./Home";
import AddMed from "./AddMed";
import Supply from "./Supply";
import Track from "./Track";
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Floating capsule navbar */}
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="nav-left">
              <NavLink to="/" className="navbar-brand">
                <span className="brand-mark">MN</span>
                <span className="brand-text">MedChain Nexus</span>
              </NavLink>
              <span className="navbar-tagline">
                Decentralized medicine supply console
              </span>
            </div>

            <div className="nav-links">
              <NavLink
                to="/roles"
                exact
                className="nav-link"
                activeClassName="active"
              >
                Roles
              </NavLink>
              <NavLink
                to="/addmed"
                className="nav-link"
                activeClassName="active"
              >
                New Batch
              </NavLink>
              <NavLink
                to="/supply"
                className="nav-link"
                activeClassName="active"
              >
                Supply Control
              </NavLink>
              <NavLink
                to="/track"
                className="nav-link"
                activeClassName="active"
              >
                Track
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Main layout */}
        <div className="app-layout">
          <aside className="app-sidebar">
            <section className="sidebar-section">
              <h3 className="sidebar-title">Quick flow</h3>
              <ol className="sidebar-list">
                <li>
                  Register <b>source partners</b>, <b>formulation centers</b>,{" "}
                  <b>transit hubs</b> and <b>care outlets</b>.
                </li>
                <li>Issue a new drug batch on-chain.</li>
                <li>Move the batch through each stage.</li>
                <li>Track &amp; verify any batch at any time.</li>
              </ol>
            </section>

            <section className="sidebar-section">
              <h3 className="sidebar-title">Environment</h3>
              <p className="sidebar-kpi">
                Connect a wallet via MetaMask to interact with the contract.
              </p>
            </section>

            <section className="sidebar-section">
              <h3 className="sidebar-title">Tips</h3>
              <ul className="sidebar-list">
                <li>Use “Roles” once to bootstrap your ecosystem.</li>
                <li>“New Batch” creates a trackable batch ID.</li>
                <li>“Supply Control” advances a batch along the route.</li>
                <li>“Track” is read-only and safe for anyone to use.</li>
              </ul>
            </section>
          </aside>

          <main className="app-main">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/roles" component={AssignRoles} />
              <Route path="/addmed" component={AddMed} />
              <Route path="/supply" component={Supply} />
              <Route path="/track" component={Track} />
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
