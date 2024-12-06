import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DriverRepair(props) {
  const { _id, repairID, repairNumber, repairDate, partReplace, repairCost, repairStatus } = props.repairs;

  const history = useNavigate();

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:8080/repair/${_id}`)
      .then(res => res.data)
      .then(() => history("/"))
      .then(() => history("/Repair"));
  }

  return (
    <tr>
      <td>{repairID}</td>
      <td>{repairNumber}</td>
      <td>{new Date(repairDate).toLocaleDateString()}</td>
      <td>{partReplace}</td>
      <td>{repairCost}</td>
      <td>{repairStatus}</td>
      <td>
        
      </td>
    </tr>
  );
}

export default DriverRepair;
