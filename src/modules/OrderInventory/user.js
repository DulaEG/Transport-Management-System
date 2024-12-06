import React, { useState } from 'react';
function User(props) {
  const { inventory } = props;

  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search input

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter(item => 
    item.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-container">
      
      {/* Search bar to filter the items */}
      <div className="search-container">
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input"
            placeholder="Search by Item Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <span className="search-icon">&#128269;</span> {/* Search Icon */}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item_ID</th>
            <th>Item_Name</th>
            <th>Size</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through the filtered inventory array and create table rows for each entry */}
          {filteredInventory.map((item, index) => (
            <tr key={index}>
              <td>{item.Item_ID}</td>
              <td>{item.Item_Name}</td>
              <td>{item.Size || 'N/A'}</td> {/* Default to 'N/A' if size is missing */}
              <td>{item.Type || 'N/A'}</td> {/* Default to 'N/A' if type is missing */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default User;
