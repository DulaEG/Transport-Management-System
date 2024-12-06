import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateServices.scoped.css';
import DriverSideBar from './DriverSideBar';

function UpdateServicesD() {
  const [inputs, setInputs] = useState({
    serviceID: '',
    vehicleNumber: '',
    serviceDate: '',
    serviceType: '',
    serviceStatus: '',
  });

  const { id } = useParams(); // Get the ID from route params
  const navigate = useNavigate(); // Use for redirection after successful update

  // Fetch service data when the component mounts
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/maintenance/${id}`);
        if (res.data && res.data.maintenances) {
          setInputs({
            serviceID: res.data.maintenances.serviceID || '',
            vehicleNumber: res.data.maintenances.vehicleNumber || '',
            serviceDate: res.data.maintenances.serviceDate ? res.data.maintenances.serviceDate.split('T')[0] : '',
            serviceType: res.data.maintenances.serviceType || '',
            serviceStatus: res.data.maintenances.serviceStatus || '',
          });
          console.log('Fetched data:', res.data.maintenances);
        }
      } catch (err) {
        console.error('Error fetching service data:', err);
      }
    };

    fetchServiceData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Send PUT request to update service
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    console.log('Submitting form with inputs:', inputs); // Log inputs before submission

    try {
      const response = await axios.put(`http://localhost:8080/maintenance/${id}`, {
        serviceID: inputs.serviceID,
        vehicleNumber: inputs.vehicleNumber,
        serviceDate: new Date(inputs.serviceDate).toISOString(), // Properly format the date
        serviceType: inputs.serviceType,
        serviceStatus: inputs.serviceStatus,
      });

      console.log('Response from server:', response); // Log the response from the server

      // Check if the request was successful
      if (response.status === 200 || response.status === 202) {
        console.log('Update successful, navigating to /Service');
        navigate('/ServiceDr'); // Redirect to Service list page after successful update
      } else {
        console.error("Failed to update service");
        alert('Error: Failed to update service. Please try again.'); // Show error message to the user
      }

    } catch (err) {
      console.error('Error updating service:', err);
      alert('Error: Unable to update service. Check console for details.'); // Alert user of error
    }
  };

  return (
    <div>
      <DriverSideBar />
      <div className="table-container1">
        <h2>Update Services</h2>
        <form onSubmit={handleSubmit}>


        <label>Service Status</label>
<br />
<select
  name="serviceStatus"
  onChange={handleChange}
  value={inputs.serviceStatus}
  required
>
  <option value="">Select Status</option>
  <option value="Completed">Completed</option>
  <option value="Pending">Pending</option>
  <option value="In Process">In Process</option>
</select>
          <br /><br />

          <button type="Submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateServicesD;
