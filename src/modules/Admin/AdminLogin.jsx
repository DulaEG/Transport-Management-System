import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const StyledCard = styled(Card)`
  width: 300px;
  max-height: 400vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (
        values.email === "admin@admin.com" &&
        values.password === "password123"
      ) {
        message.success("Login successful");
        localStorage.setItem("admin", true);
        navigate("/admin");
      } else {
        message.error("Invalid credentials");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <CenteredContainer>
      <StyledCard title="Admin Login" bordered={false}>
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </CenteredContainer>
  );
};

export default AdminLogin;
