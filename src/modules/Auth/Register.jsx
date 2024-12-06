import React from "react";
import { Form, Input, Button, message } from "antd";
import styled from "styled-components";
import bookingUserService from "../../services/clientController";
import { useNavigate } from "react-router-dom";

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

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await bookingUserService.createUser(values);
      message.success("User registered successfully!");
      form.resetFields();
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      message.error(error.message || "Failed to register user");
    }
  };

  return (
    <BackgroundContainer>
      <GlassContainer>
        <StyledForm form={form} name="register" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="User Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="E-mail" />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your T.P Number!" },
              { pattern: /^\d+$/, message: "T.P Number must be numeric!" },
            ]}
          >
            <Input placeholder="T.P Number" />
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Submit
            </StyledButton>
          </Form.Item>
        </StyledForm>
      </GlassContainer>
    </BackgroundContainer>
  );
};

export default Register;
