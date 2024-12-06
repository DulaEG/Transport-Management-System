import React, { useState } from "react";
import { Form, Input, Select, DatePicker, Button, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate(); // Corrected navigator usage

    const addSuccess = () => {
        messageApi.success('Employee added successfully!');
        navigate('/admin_login'); // Navigating to home after successful registration
    };

    const addError = () => {
        messageApi.error('Failed to add employee. Please try again.');
    };

    async function addNewEmployee(values) {
        setIsLoading(true); // Start loading when form is submitted
        try {
            const response = await axios.post('http://localhost:8080/api/employee/register', values);

            if (response.status === 200) {
                addSuccess();
                form.resetFields();
            } else {
                addError();
            }
        } catch (error) {
            console.error(error);
            addError(); // Display error message on API failure
        } finally {
            setIsLoading(false); // Stop loading after API call is done
        }
    }

    return (
        <div className="max-w-lg p-6 mx-auto my-24 bg-white border border-gray-300 rounded-lg shadow-md">
            {contextHolder}
            <h4 className="mb-2 text-2xl font-bold">Sign up!</h4>
            <p className="mb-4">Enter your information to continue</p>

            <Form
                name="signup"
                onFinish={addNewEmployee}
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    name="eid"
                    rules={[
                        { required: true, message: "Please input eid" },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Emloyee ID" />
                </Form.Item>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="firstname"
                            rules={[
                                { required: true, message: "Please input your first name" },
                                { min: 2, message: "First name must be at least 2 characters" },
                                { pattern: /^[A-Za-z]+$/, message: "First name can only contain letters" }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="First Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="lastname"
                            rules={[
                                { required: true, message: "Please input your last name" },
                                { min: 2, message: "Last name must be at least 2 characters" },
                                { pattern: /^[A-Za-z]+$/, message: "Last name can only contain letters" }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Last Name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="dob"
                    rules={[{ required: true, message: "Please select your date of birth" }]}
                >
                    <DatePicker style={{ width: '100%' }} placeholder="Date of Birth" />
                </Form.Item>

                <Form.Item
                    name="address"
                    rules={[{ required: true, message: "Please input your address" }]}
                >
                    <Input prefix={<HomeOutlined />} placeholder="Address" />
                </Form.Item>

                <Form.Item
                    name="gender"
                    rules={[{ required: true, message: "Please select your gender" }]}
                >
                    <Select placeholder="Select Gender">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="contact"
                    rules={[
                        { required: true, message: "Please input your contact number" },
                        { pattern: /^[0-9+-]+$/, message: "Please input a valid phone number" },
                        { min: 9, message: "Contact number is too short" },
                        { max: 15, message: "Contact number is too long" }
                    ]}
                >
                    <Input prefix={<PhoneOutlined />} placeholder="Contact Number" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email" },
                        { type: "email", message: "Please enter a valid email" }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Please input your password" },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: "Please confirm your password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                </Form.Item>

                <Form.Item
                    name="role"
                    rules={[{ required: true, message: "Please select your role" }]}
                >
                    <Select placeholder="Select Role">
                        <Option value="Driver">Driver</Option>
                        <Option value="Admin">Admin</Option>
                        <Option value="Supervisor">Supervisor</Option>
                        <Option value="Mechanic">Mechanic</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-[#0071ff] text-white hover:bg-[#0071ff]"
                        size="large"
                        loading={isLoading} // Display loading spinner
                    >
                        Sign Up
                    </Button>
                    <div className="mt-3 text-center">
                        Already have an Account? <a href="/">Log in!</a>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Signup;
