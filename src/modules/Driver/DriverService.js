import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DriverService(props) {
  const {_id, serviceID, vehicleNumber, serviceDate, serviceType, serviceStatus } = props.maintenances;

  const history=useNavigate();

  const deleteHandler =async()=>{
    await axios.delete(`http://localhost:8080/maintenance/${_id}`)
    .then(res=>res.data)
    .then(()=>history("/"))
    .then(()=>history("/ServiceDr"))
  }

  return (
    <tr>
   
      <td>{serviceID}</td>
      <td>{vehicleNumber}</td>
      <td>{new Date(serviceDate).toLocaleDateString()}</td>
      <td>{serviceType}</td>
      <td>{serviceStatus}</td>
      
      <td>
        <Link to={`/ServiceDr/${_id}`}>
          <button>Update</button>
        </Link>
        
      </td>
    </tr>
  );
}

export default DriverService;
