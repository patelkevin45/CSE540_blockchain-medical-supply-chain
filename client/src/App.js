import './App.css';
import AssignRoles from './AssignRoles';
import Home from './Home';
import AddMed from './AddMed';
import Supply from './Supply';
import Track from './Track';
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <NavLink to="/" className="navbar-brand">PharmaTrace</NavLink>
          <div className="nav-links">
            <NavLink to="/roles" className="nav-link" activeClassName="active">Assign Roles</NavLink>
            <NavLink to="/addmed" className="nav-link" activeClassName="active">Order Batch</NavLink>
            <NavLink to="/supply" className="nav-link" activeClassName="active">Control Supply</NavLink>
            <NavLink to="/track" className="nav-link" activeClassName="active">Track Batch</NavLink>
          </div>
        </nav>
        <main className="container">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/roles" component={AssignRoles} />
            <Route path="/addmed" component={AddMed} />
            <Route path="/supply" component={Supply} />
            <Route path="/track" component={Track} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
