import React from "react";
import { Form, Input, Button, message } from "antd";
import styled from "styled-components";
import bookingUserService from "../../services/clientController";
import { Link, useNavigate } from "react-router-dom";

const BackgroundContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url("/images/bus-bg.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 2rem;
  width: 90%;
  max-width: 500px;
`;

const StyledForm = styled(Form)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await bookingUserService.loginUser(values);
      message.success("Login successful!");
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message || "Failed to log in");
    }
  };

  return (
    <BackgroundContainer>
      <GlassContainer>
        <StyledForm form={form} name="login" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Login
            </StyledButton>
          </Form.Item>
        </StyledForm>
        <p>
          Don't have an account? <Link to="/signup">Signup Now</Link>{" "}
        </p>
      </GlassContainer>
    </BackgroundContainer>
  );
};

export default Login;
