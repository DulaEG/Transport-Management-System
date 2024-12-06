import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';

function Submit() {
  const location = useLocation();
  const orderDetails = location.state; // Access the passed order details

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Order Details", 20, 10);
    doc.text(`Driver ID: ${orderDetails.Driver_ID}`, 20, 30);
    doc.text(`Driver Name: ${orderDetails.Driver_Name}`, 20, 40);
    doc.text(`Vehicle No: ${orderDetails.Vehicle_NO}`, 20, 50);
    doc.text(`Item ID: ${orderDetails.Item_ID}`, 20, 60);
    doc.text(`Item Name: ${orderDetails.Item_Name}`, 20, 70);
    doc.text(`Size: ${orderDetails.Size}`, 20, 80);
    doc.text(`Type: ${orderDetails.Type}`, 20, 90);
    doc.save("order-details.pdf");
  };

  return (
    <div className="submit-container"> {/* Add class for background */}
      <h1>Order Submitted Successfully!</h1>
      <p>Your order details are as follows:</p>
      <div className="order-details">
        <p><strong>Driver ID :</strong> {orderDetails.Driver_ID}</p>
        <br></br>
        <p><strong>Driver Name :</strong> {orderDetails.Driver_Name}</p>
        <br></br>
        <p><strong>Vehicle No :</strong> {orderDetails.Vehicle_NO}</p>
        <br></br>
        <p><strong>Item ID :</strong> {orderDetails.Item_ID}</p>
        <br></br>
        <p><strong>Item Name :</strong> {orderDetails.Item_Name}</p>
        <br></br>
        <p><strong>Size :</strong> {orderDetails.Size}</p>
        <br></br>
        <p><strong>Type :</strong> {orderDetails.Type}</p>
        <br></br>
      </div>
      <button className="download-btn" onClick={generatePDF}>Download Report</button>
    </div>
  );
}

export default Submit;
