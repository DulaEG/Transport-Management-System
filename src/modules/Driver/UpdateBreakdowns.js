import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DriverSideBar from './DriverSideBar';
import "./UpdateBreakdowns.scoped.css"

const UpdateBreakdown = () => {
  const { id } = useParams(); // Get the breakdown ID from URL parameters
  const [inputs, setInputs] = useState({
    vehicleNumber: '',
    date: '',
    partReplace: '',
    repairCost: '',
    employeeID: '',
    employeeName: ''
  }); // Initialize state with default empty values
  const navigate = useNavigate();

  // Fetch breakdown data when the component mounts
  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/breakdown/${id}`);
        if (response.data && response.data.breakdown) {
          setInputs(response.data.breakdown); // Set the response data in state
        }
      } catch (error) {
        console.error('Error fetching breakdown data:', error);
        alert('Failed to fetch breakdown details.');
      }
    };
    fetchBreakdown();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/breakdown/${id}`, inputs);
      alert('Breakdown updated successfully');
      navigate("/BreakdownDr"); // Redirect to Breakdown list or page after successful update
    } catch (error) {
      console.error('Error updating breakdown:', error);
      alert('Failed to update breakdown. Please try again.');
    }
  };

  return (
    <div>
      <DriverSideBar />
      <div className="form-container">
        <h2>Update Breakdown</h2>
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
          <button type="submit">Update Breakdown</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBreakdown;
