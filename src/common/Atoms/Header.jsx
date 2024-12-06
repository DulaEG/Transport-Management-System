import React from "react";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const logoUrl = "buslogo.jpeg";

// Styled components for header
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0; /* Adjust background color to match */
  padding: 10px 20px;
  border-bottom: 1px solid #dcdcdc;
`;

const Logo = styled.img`
  height: 50px; /* Adjust to match logo size */
`;

const Title = styled.h1`
  font-size: 24px;
  color: black; /* Adjust font color */
  text-align: center;
  flex: 1;
  margin: 0;
`;

const UserIcon = styled(UserOutlined)`
  font-size: 24px;
  color: black;
`;

const Header = () => {
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <Logo src={logoUrl} alt="Logo" />
      <Title>INDIKA MOTORS & TRANSPORT (PVT) LTD</Title>
      <UserIcon
        onClick={() => {
          if (localStorage.getItem("currentUser")) {
            navigate("/profile");
          } else {
            navigate("/login");
          }
        }}
      />
    </HeaderContainer>
  );
};

export default Header;
