import React from "react";
import { Form, Input, InputNumber, Button, Row, Col, message } from "antd";
import userService from "../../services/userService";

const AddUser = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Attempt to create the new user
      await userService.createUser(values);
      message.success("User added successfully");
      form.resetFields(); // Reset the form after successful submission
    } catch (error) {
      message.error("Failed to add user");
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Failed to submit the form");
    console.error("Error:", errorInfo);
  };

  // Function to calculate net pay
  const calculateNetPay = (values) => {
    const { basicSalary = 0, overtimeHours = '00:00:00', overtimeRate = 0, advance = 0 } = values;
    const [hours, minutes, seconds] = overtimeHours.split(':').map(Number);
    const totalOvertimeInHours = hours + minutes / 60 + seconds / 3600;
    const overtimePayment = totalOvertimeInHours * overtimeRate;

    const netPay = basicSalary - advance + overtimePayment;
    return isNaN(netPay) ? 0 : netPay;
  };

  // Handle form value changes to calculate net pay
  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.basicSalary || changedValues.overtimeHours || changedValues.overtimeRate || changedValues.advance) {
      const netPay = calculateNetPay(allValues);
      form.setFieldsValue({ netPay });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="addUserForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ netPay: 0 }} // Set default netPay
      onValuesChange={handleValuesChange} // Call this on every value change
    >
      <Row gutter={16}>
        {/* Driver ID */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Driver ID"
            name="driverId"
            rules={[{ required: true, message: "Please input the Driver ID" }]}
          >
            <Input placeholder="Enter Driver ID" />
          </Form.Item>
        </Col>

        {/* Driver Name */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Driver Name"
            name="driverName"
            rules={[
              { required: true, message: "Please input the Driver Name" },
            ]}
          >
            <Input placeholder="Enter Driver Name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Basic Salary */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Basic Salary"
            name="basicSalary"
            rules={[
              { required: true, message: "Please input the Basic Salary" },
              {
                type: "number",
                min: 0,
                message: "Salary must be a positive number",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter Basic Salary"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        {/* Overtime Hours (HH:MM:SS) */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Overtime Hours (HH:MM:SS)"
            name="overtimeHours"
            rules={[
              { required: true, message: "Please input the Overtime Hours" },
              {
                pattern: /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/,
                message: "Please enter time in HH:MM:SS format",
              },
            ]}
          >
            <Input placeholder="Enter Overtime Hours" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Overtime Rate */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Overtime Rate"
            name="overtimeRate"
            rules={[
              { required: true, message: "Please input the Overtime Rate" },
              {
                type: "number",
                min: 0,
                message: "Rate must be a positive number",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter Overtime Rate"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        {/* Present Days */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Present Days"
            name="presentDays"
            rules={[
              { required: true, message: "Please input the Present Days" },
              {
                type: "number",
                min: 0,
                message: "Present days must be a positive number",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter Present Days"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Advance */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Advance"
            name="advance"
            rules={[
              { required: true, message: "Please input the Advance amount" },
              {
                type: "number",
                min: 0,
                message: "Advance must be a positive number",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter Advance Amount"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        {/* Net Pay */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Net Pay"
            name="netPay"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Net pay must be a positive number",
              },
            ]}
          >
            <InputNumber
              placeholder="Net Pay (will be calculated)"
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Submit button */}
      <Row>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add User
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddUser;