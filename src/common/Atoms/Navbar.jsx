import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import { Select } from "antd";

// Styled components for NavBar
const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0c2748; /* Dark blue background */
  padding: 10px 20px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  a {
    color: white;
    margin-right: 20px;
    text-decoration: none;
    font-size: 16px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  padding: 5px 10px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 5px;
  border-radius: 20px;
  font-size: 16px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;

  svg {
    font-size: 24px;
    margin-left: 20px;
  }
`;
const { Option } = Select;
const NavBar = () => {
  const [selectedItem, setSelectedItem] = useState("inventory");
  return (
    <NavBarContainer>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/vehicle-list">Vehicle Profiles</Link>
        <Link to="/bus-timetables">Bus Timetables</Link>
        {localStorage.getItem("currentUser") && (
          <>
            <Link to="/make-booking">Make Booking</Link>
            <Link to="/make-inquiry">Make Feedback</Link>
            <Link to="/my-feedbacks">My Feedbacks</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </>
        )}
        <Select
          onChange={(value) => {
            setSelectedItem(value);
          }}
          value={selectedItem}
        >
          <Option value="inventory">
            <Link to="/user-inventory">Inventory</Link>
          </Option>
          <Option value="employee-profile">
            <Link to="/admin_login">Employee Profile</Link>
          </Option>
          <Option value="payments">
            {" "}
            <Link to="/user-payments">Payments</Link>
          </Option>
          <Option value="maintance">
            {" "}
            <Link to="/maintance">Maintance</Link>
          </Option>
        </Select>
      </NavLinks>

      <SearchContainer>
        <SearchInput type="text" placeholder="Search..." />
        <SearchOutlined style={{ fontSize: "20px", color: "#0c2748" }} />
      </SearchContainer>

      <IconContainer>
        <LogoutOutlined />
      </IconContainer>
    </NavBarContainer>
  );
};

export default NavBar;
