// Nav.js
import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  return (
    <nav className="sidebar">
      <h2>Salary Management System</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add">Add New User</Link>
        </li>
        <li>
          <Link to="/some-other-page">Overtime Calculation</Link>
        </li>{" "}
        {/* New Link */}
      </ul>
    </nav>
  );
};

export default Nav;
