import React, { useEffect, useRef, useState } from 'react';
import './DriverRepairs.scoped.css';
import axios from "axios";
import Repair from './DriverRepair';
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import DriverSideBar from './DriverSideBar';

const URL = "http://localhost:8080/repair";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function DriverRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => {
      if (data && data.repairs) {
        setRepairs(data.repairs);
      } else {
        console.error('API did not return expected data');
      }
    });
  }, []);



  const handleSearch = () => {
    const filteredRepairs = repairs.filter((repair) =>
      Object.values(repair).some((field) =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setRepairs(filteredRepairs);
    setNoResults(filteredRepairs.length === 0);
  };

  return (
    <div>
      <DriverSideBar />
      <div className="Search">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          name="search"
          placeholder="Search Repair Details............"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {noResults ? (
        <div>
          <p>No Repairs Found</p>
        </div>
      ) : (
        <div className="table-container1">
          <h2>Repair Details......</h2>
          <br />
          {repairs.length > 0 ? (
            <table className="table-container2">
              <thead>
                <tr>
                  <th>Repair ID</th>
                  <th>Vehicle Number</th>
                  <th>Repair Date</th>
                  <th>Part Replaced</th>
                  <th>Repair Cost</th>
                  <th>Repair Status</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair, i) => (
                  <Repair key={i} repairs={repair} />
                ))}
              </tbody>
            </table>
          ) : (
            <h3>No repair data available</h3>
          )}
          <div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverRepairs;
