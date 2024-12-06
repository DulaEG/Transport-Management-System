import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Popconfirm } from "antd";
import styled from "styled-components";
import bookingUserService from "../../services/clientController";
import { useNavigate } from "react-router-dom";

const BackgroundContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(240, 240, 240, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileContainer = styled.div`
  background: white;
  padding: 2rem;
  width: 90%;
  flex: 4;
  max-width: 800px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const StyledForm = styled(Form)`
  width: 100%;
`;

const ProfileHeader = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Profile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const userId = JSON.parse(localStorage.getItem("currentUser"))["_id"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await bookingUserService.getUserById(userId);
        setUserData(user.data);
        form.setFieldsValue(user.data);
      } catch (error) {
        message.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [form, userId]);

  const handleUpdate = async (values) => {
    try {
      await bookingUserService.updateUser(userId, values);
      message.success("User updated successfully!");
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      await bookingUserService.deleteUser(userId);
      message.success("User deleted successfully!");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  if (!userData) return null;

  return (
    <BackgroundContainer>
      <ProfileContainer>
        <ProfileHeader>User Profile</ProfileHeader>
        <StyledForm form={form} onFinish={handleUpdate}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="T.P Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your T.P Number!" },
              { pattern: /^\d+$/, message: "T.P Number must be numeric!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input />
          </Form.Item>

          <ButtonGroup>
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="dashed">
                Delete
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Are you sure you want to logout"
              onConfirm={() => {
                localStorage.clear();
                navigate("/");
                window.location.reload();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed">Logout</Button>
            </Popconfirm>

            <Popconfirm
              title="Are you sure you want to edit this user?"
              onConfirm={() => form.submit()} // Trigger form submit here
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Edit</Button>
            </Popconfirm>
          </ButtonGroup>
        </StyledForm>
      </ProfileContainer>
    </BackgroundContainer>
  );
};

export default Profile;
