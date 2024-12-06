import React, { useEffect, useRef, useState } from 'react';
import './DriverServices.scoped.css';
import axios from "axios";
import Service from './DriverService';
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import DriverSideBar from './DriverSideBar';

const URL = "http://localhost:8080/maintenance";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function DriverServices() {
  const [maintenances, setMaintenances] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => {
      if (data && data.maintenances) {
        setMaintenances(data.maintenances);
      } else {
        console.error('API did not return expected data');
      }
    });
  }, []);

  const ComponentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentRef.current,
    documentTitle: "Service Report",
    onAfterPrint: () => alert("Service Report Successfully Downloaded!"),
  });

  const handleSearch = () => {
    const filteredServices = maintenances.filter((service) =>
      Object.values(service).some((field) =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setMaintenances(filteredServices);
    setNoResults(filteredServices.length === 0);
  };

  return (
    <div>
      <DriverSideBar />
      <div className="Search">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          name="search"
          placeholder="Search Service Details............"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {noResults ? (
        <div>
          <p>No Services Found</p>
        </div>
      ) : (
        <div ref={ComponentRef} className="table-container1">
          <h2>Service Details......</h2>
          <br />
          {maintenances.length > 0 ? (
            <table className="table-container2">
              <thead>

                <tr>

                  <th>Service ID</th>
                  <th>Vehicle Number</th>
                  <th>Service Date</th>
                  <th>Service Type</th>
                  <th>Service Status</th>
                </tr>

              </thead>
              <tbody>
                {maintenances.map((maintenance, i) => (
                  <Service key={i} maintenances={maintenance} />
                ))}
              </tbody>
            </table>
          ) : (
            <h3>No service data available</h3>
          )}
          <div>
            <br />
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverServices;
