import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Order() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [inputs, setInputs] = useState({
    Driver_ID: "",
    Driver_Name: "",
    Vehicle_NO: "",
    Item_ID: "",
    Item_Name: "",
    Size: "",
    Type: "",
  });

  // Handle changes in input fields
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => {
      // Navigate to Submit page and pass the form data
      navigate('/Submit', { state: inputs });
    });
  };

  // Send the form data to the backend
  const sendRequest = async () => {
    await axios.post("http://localhost:5000/orders", {
      Driver_ID: String(inputs.Driver_ID),
      Driver_Name: String(inputs.Driver_Name),
      Vehicle_NO: String(inputs.Vehicle_NO),
      Item_ID: String(inputs.Item_ID),
      Item_Name: String(inputs.Item_Name),
      Size: String(inputs.Size),
      Type: String(inputs.Type),
    }).then(res => res.data);
  };

  return (
    <div className="container"> {/* Add class for background */}
      <h1><center>Add Orders</center></h1>
      <form onSubmit={handleSubmit}>
        <label>Driver_ID :</label>
        <input type="text" name="Driver_ID" onChange={handleChange} value={inputs.Driver_ID} required />
        <br />
        <label>Driver_Name :</label>
        <input type="text" name="Driver_Name" onChange={handleChange} value={inputs.Driver_Name} required />
        <br />
        <label>Vehicle_NO :</label>
        <input type="text" name="Vehicle_NO" onChange={handleChange} value={inputs.Vehicle_NO} required />
        <br />
        <label>Item_ID :</label>
        <input type="text" name="Item_ID" onChange={handleChange} value={inputs.Item_ID} required />
        <br />
        <label>Item_Name :</label>
        <input type="text" name="Item_Name" onChange={handleChange} value={inputs.Item_Name} required />
        <br />
        <label>Size :</label>
        <input type="text" name="Size" onChange={handleChange} value={inputs.Size} required />
        <br />
        <label>Type :</label>
        <input type="text" name="Type" onChange={handleChange} value={inputs.Type} required />
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Order;
