import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">Job Tracker</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Tracker</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/analyze">Resume Analyzer</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
