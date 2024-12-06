import React from "react";
import './DriverSideBar.scoped.css';
import { Link } from "react-router-dom";

function DriverSideBar() {
  return (

    <div className="sidebar">
        <Link to="/"className="model">
      <h2>Maintenance and Repair Details</h2>
      </Link>
      <ul>
      <Link to="/ServiceDr"className="model">
        <li>Service Details</li>
        </Link>
        <Link to="/RepairDr"className="model">
        <li>Repair Details</li>
        </Link>
        <Link to="/BreakdownDr"className="model">
        <li>Breakdown Details</li>
        </Link>
      </ul>
    </div>
  )
}

export default DriverSideBar
