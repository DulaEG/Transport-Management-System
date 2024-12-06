import React from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  message,
} from "antd";
import maintenanceService from "../../services/maintainceService";

const { Option } = Select;

const AddMaintenance = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        serviceDate: values.serviceDate.format("YYYY-MM-DD"), // Format date
      };
      await maintenanceService.createMaintenance(formattedValues); // Call API to create maintenance
      message.success("Maintenance added successfully");
      form.resetFields(); // Reset the form after submission
    } catch (error) {
      message.error("Failed to add maintenance");
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Failed to submit the form");
    console.error("Error:", errorInfo);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="addMaintenanceForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={16}>
        {/* Service ID */}
        <Col span={12}>
          <Form.Item
            label="Service ID"
            name="serviceID"
            rules={[{ required: true, message: "Please input the Service ID" }]}
          >
            <Input placeholder="Enter Service ID" />
          </Form.Item>
        </Col>

        {/* Vehicle Number */}
        <Col span={12}>
          <Form.Item
            label="Vehicle Number"
            name="vehicleNumber"
            rules={[
              { required: true, message: "Please input the Vehicle Number" },
            ]}
          >
            <Input placeholder="Enter Vehicle Number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Service Date */}
        <Col span={12}>
          <Form.Item
            label="Service Date"
            name="serviceDate"
            rules={[
              { required: true, message: "Please select the Service Date" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {/* Service Type */}
        <Col span={12}>
          <Form.Item
            label="Service Type"
            name="serviceType"
            rules={[
              { required: true, message: "Please select the Service Type" },
            ]}
          >
            <Select placeholder="Select Service Type">
              <Option value="Oil Change">Oil Change</Option>
              <Option value="Tire Rotation">Tire Rotation</Option>
              <Option value="Brake Check">Brake Check</Option>
              <Option value="Engine Repair">Engine Repair</Option>
              {/* Add more options as necessary */}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Service Status */}
        <Col span={12}>
          <Form.Item
            label="Service Status"
            name="serviceStatus"
            rules={[
              { required: true, message: "Please select the Service Status" },
            ]}
          >
            <Select placeholder="Select Service Status">
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Submit button */}
      <Row>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Maintenance
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddMaintenance;
