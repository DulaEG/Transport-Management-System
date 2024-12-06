import React, { useEffect, useState, useRef } from 'react'; 
import axios from 'axios';
import Details from './user';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const URL = "http://localhost:5000/inventories";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [inventories, setInventories] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchHandler().then((data) => {
      console.log(data); // Log the response data
      setInventories(data.inventories || []); // Default to empty array if undefined
    });
  }, []);

  const componentsRef = useRef();

  const handleOrderClick = () => {
    navigate("/Order"); // Navigate to the Order page
  };

  return (
    <div className="background-image"> {/* Add class for background */}
      <h1><center>Inventory Details</center></h1>
      <div ref={componentsRef}>
        {/* Render the table once */}
        {inventories.length > 0 && (
          <Details inventory={inventories} />
        )}
      </div>
      <div className="center-button"> {/* Wrapper div for centering */}
        <button onClick={handleOrderClick}>Order</button> {/* Link to Order.js */}
      </div>
    </div>
  );
}

export default Users;
