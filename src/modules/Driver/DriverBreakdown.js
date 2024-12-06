import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';

function BreakdownD({ breakdown }) {
  const history = useNavigate(); // Call useNavigate at the top level

  if (!breakdown) {
    return null;
  }

  const { _id, vehicleNumber, date, partReplace, repairCost, employeeID, employeeName } = breakdown;

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:8080/breakdown/${_id}`)
      .then(res => res.data)
      .then(() => history("/"))
      .then(() => history("/BreakdownDr"));
  };

  return (
    <tr>
      <td>{vehicleNumber}</td>
      <td>{new Date(date).toLocaleDateString()}</td>
      <td>{partReplace}</td>
      <td>{repairCost}</td>
      <td>{employeeID}</td>
      <td>{employeeName}</td>
      <td>
        <Link to={`/Breakdown/${_id}`}>  {/* Add the Link component */}
          <button>Update</button>
        </Link>
        <button className='delete' onClick={deleteHandler}>Delete</button>
      </td>
    </tr>
  );
}

export default BreakdownD;
