import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DriverSideBar from './DriverSideBar';

const AddBreakdown = () => {
  const [inputs, setInputs] = useState({
    vehicleNumber: '',
    date: '',
    partReplace: '',
    repairCost: '',
    employeeID: '',
    employeeName: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.vehicleNumber || !inputs.date || !inputs.partReplace || !inputs.repairCost || !inputs.employeeID || !inputs.employeeName) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Post the breakdown and notification data to the backend
      const response = await axios.post("http://localhost:8080/breakdown", inputs);
      
      alert("Breakdown and notification successfully added!");

      // Reset the form after submission
      setInputs({
        vehicleNumber: '',
        date: '',
        partReplace: '',
        repairCost: '',
        employeeID: '',
        employeeName: ''
      });

      // Optionally navigate somewhere else, for example, to the breakdown list
      navigate("/BreakdownDr");

    } catch (err) {
      console.error(err);
      alert("Failed to add breakdown, please try again.");
    }
  };

  return (
    <div>
      <DriverSideBar />
      <div className="table-container1">
        <h2>Add Breakdown</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={inputs.vehicleNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={inputs.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Part Replaced:</label>
            <input
              type="text"
              name="partReplace"
              value={inputs.partReplace}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Repair Cost:</label>
            <input
              type="number"
              name="repairCost"
              value={inputs.repairCost}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Employee ID:</label>
            <input
              type="text"
              name="employeeID"
              value={inputs.employeeID}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Employee Name:</label>
            <input
              type="text"
              name="employeeName"
              value={inputs.employeeName}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Add Breakdown</button>
        </form>
      </div>
    </div>
  );
};

export default AddBreakdown;
