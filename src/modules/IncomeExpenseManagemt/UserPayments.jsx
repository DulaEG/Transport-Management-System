import React, { useState } from "react";
import {
  Tabs,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import bookingIncomeService from "../../services/bookingIncomeService";
import driverIncomeService from "../../services/driverIncomeService";
import driverExpenseService from "../../services/driverExpenseService";
import { uploadFile } from "../../services/uploadFileService";

const { TabPane } = Tabs;
const { Option } = Select;

const UserPayments = () => {
  const [bookingIncomeForm] = Form.useForm();
  const [driverIncomeForm] = Form.useForm();
  const [driverExpenseForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState("1");

  const onTabChange = (key) => {
    setActiveTab(key);
  };

  const handleBookingIncomeSubmit = async (values) => {
    try {
      const incomeData = {
        ...values,
        incomeDate: values.incomeDate.format("YYYY-MM-DD"),
      };
      await bookingIncomeService.createIncome(incomeData);
      message.success("Booking Income created successfully.");
      bookingIncomeForm.resetFields();
    } catch (error) {
      message.error("Failed to create Booking Income.");
    }
  };

  const handleDriverIncomeSubmit = async (values) => {
    try {
      let downloadUrl = "";
      if (values.incomeSlipImage && values.incomeSlipImage.file) {
        downloadUrl = await uploadFile(
          values.incomeSlipImage.file.originFileObj
        );
      }

      const incomeData = {
        ...values,
        incomeSlipImage: downloadUrl,
        incomeDate: values.incomeDate.format("YYYY-MM-DD"),
      };
      await driverIncomeService.createIncome(incomeData);
      message.success("Driver Income created successfully.");
      driverIncomeForm.resetFields();
    } catch (error) {
      message.error("Failed to create Driver Income.");
    }
  };

  const handleDriverExpenseSubmit = async (values) => {
    try {
      let downloadUrl = "";
      if (values.paymentSlip && values.paymentSlip.file) {
        downloadUrl = await uploadFile(values.paymentSlip.file.originFileObj);
      }

      const expenseData = {
        ...values,
        paymentSlip: downloadUrl,
        paymentDate: values.paymentDate.format("YYYY-MM-DD"),
      };
      await driverExpenseService.createExpense(expenseData);
      message.success("Driver Expense created successfully.");
      driverExpenseForm.resetFields();
    } catch (error) {
      message.error("Failed to create Driver Expense.");
    }
  };

  return (
    <div style={{ background: "white", padding: 32 }}>
      <h1>User Payments</h1>
      <Tabs activeKey={activeTab} onChange={onTabChange}>
        <TabPane tab="Booking Income" key="1">
          <Form
            form={bookingIncomeForm}
            onFinish={handleBookingIncomeSubmit}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="incomeId"
                  label="Income ID"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incomeDate"
                  label="Income Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="incomeAmount"
                  label="Income Amount"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incomeDescription"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Booking Income
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Driver Income" key="2">
          <Form
            form={driverIncomeForm}
            onFinish={handleDriverIncomeSubmit}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="incomeId"
                  label="Income ID"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="driverEmail"
                  label="Driver Email"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="incomeDate"
                  label="Income Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="incomeTime"
                  label="Income Time"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="incomeAmount"
                  label="Income Amount"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="incomeDescription"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incomeSlipImage"
                  label="Income Slip Image"
                  rules={[{ required: true }]}
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="rejectionReason" label="Rejection Reason">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Driver Income
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Driver Expenses" key="3">
          <Form
            form={driverExpenseForm}
            onFinish={handleDriverExpenseSubmit}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="expensesId" label="Expense ID">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="driverEmail"
                  label="Driver Email"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="paymentDate"
                  label="Payment Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="paymentTime"
                  label="Payment Time"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="paymentAmount"
                  label="Payment Amount"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="paymentDescription"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="paymentSlip"
                  label="Payment Slip"
                  rules={[{ required: true }]}
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="rejectionReason" label="Rejection Reason">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Driver Expense
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserPayments;
