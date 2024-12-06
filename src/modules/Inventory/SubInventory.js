import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SubInventory() {
  const [orders, setOrders] = useState([]); // State to store the list of orders

  // Fetch all orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders'); // Adjust URL based on your backend setup
      setOrders(response.data.orders); // Assumes response contains orders array
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // Function to handle deleting an order
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${id}`); // DELETE request to backend
      setOrders(orders.filter(order => order._id !== id)); // Update state after deletion
    } catch (err) {
      console.error("Error deleting order", err);
    }
  };

  return (
    <div>
      <h1><center>Submitted Orders</center></h1>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Vehicle No</th>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Size</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.Driver_ID}</td>
                <td>{order.Driver_Name}</td>
                <td>{order.Vehicle_NO}</td>
                <td>{order.Item_ID}</td>
                <td>{order.Item_Name}</td>
                <td>{order.Size}</td>
                <td>{order.Type}</td>
                <td>
                  <button onClick={() => deleteOrder(order._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default SubInventory;
