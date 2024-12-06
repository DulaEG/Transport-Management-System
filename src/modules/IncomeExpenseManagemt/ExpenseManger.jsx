import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
  Row,
  Col,
  Space,
  Select,
  Upload,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  FileSearchOutlined,
  FilePdfOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import driverExpenseService from "../../services/driverExpenseService";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { uploadFile } from "../../services/uploadFileService";

const { Option } = Select;

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [formLoading, setFormLoading] = useState(false); // New state for form loading
  const [form] = Form.useForm();

  // Fetch all expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await driverExpenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      message.error("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Show modal for creating or editing expense
  const showModal = (expense = null) => {
    setEditingExpense(expense);
    if (expense) {
      form.setFieldsValue({
        ...expense,
        paymentDate: moment(expense.paymentDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle form submission for creating/updating expense
  const handleSubmit = async () => {
    setFormLoading(true); // Start loading
    try {
      let downloadUrl = "";
      const values = await form.validateFields();
      if (values.paymentSlip) {
        if (values.paymentSlip.file) {
          downloadUrl = await uploadFile(values.paymentSlip.file.originFileObj);
        } else {
          downloadUrl = editingExpense.paymentSlip;
        }
      } else {
        downloadUrl = editingExpense.paymentSlip;
      }

      const expenseData = {
        ...values,
        paymentSlip: downloadUrl,
        paymentDate: values.paymentDate.format("YYYY-MM-DD"),
      };

      if (editingExpense) {
        await driverExpenseService.updateExpense(
          editingExpense._id,
          expenseData
        );
        message.success("Expense updated successfully.");
      } else {
        await driverExpenseService.createExpense(expenseData);
        message.success("Expense created successfully.");
      }

      setIsModalVisible(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      message.error("Error in processing the form.");
    } finally {
      setFormLoading(false); // Stop loading
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await driverExpenseService.deleteExpense(id);
      message.success("Expense deleted successfully.");
      fetchExpenses();
    } catch (error) {
      message.error("Failed to delete expense.");
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Driver Expense Report", 14, 15);

    const tableColumn = [
      "Expense ID",
      "Driver Email",
      "Payment Date",
      "Payment Time",
      "Amount",
      "Description",
      "Status",
    ];
    const tableRows = expenses.map((expense) => [
      expense.expensesId,
      expense.driverEmail,
      moment(expense.paymentDate).format("YYYY-MM-DD"),
      expense.paymentTime,
      expense.paymentAmount,
      expense.paymentDescription,
      expense.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("driver_expense_report.pdf");
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle sort
  const handleSort = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  // Filter data based on search text
  const filteredData = expenses.filter(
    (expense) =>
      expense.expensesId?.toLowerCase().includes(searchText.toLowerCase()) ||
      expense.driverEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      expense.paymentDescription
        .toLowerCase()
        .includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Expense ID",
      dataIndex: "expensesId",
      key: "expensesId",
      sorter: (a, b) => (a.expensesId || "").localeCompare(b.expensesId || ""),
      sortOrder: sortedInfo.columnKey === "expensesId" && sortedInfo.order,
    },
    {
      title: "Driver Email",
      dataIndex: "driverEmail",
      key: "driverEmail",
      sorter: (a, b) => a.driverEmail.localeCompare(b.driverEmail),
      sortOrder: sortedInfo.columnKey === "driverEmail" && sortedInfo.order,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      sorter: (a, b) =>
        moment(a.paymentDate).unix() - moment(b.paymentDate).unix(),
      sortOrder: sortedInfo.columnKey === "paymentDate" && sortedInfo.order,
    },
    {
      title: "Payment Time",
      dataIndex: "paymentTime",
      key: "paymentTime",
    },
    {
      title: "Amount",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      sorter: (a, b) => a.paymentAmount - b.paymentAmount,
      sortOrder: sortedInfo.columnKey === "paymentAmount" && sortedInfo.order,
    },
    {
      title: "Description",
      dataIndex: "paymentDescription",
      key: "paymentDescription",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteExpense(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <h1>Driver Expense Manager</h1>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Expense
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={generatePDF}>
            Generate PDF
          </Button>
        </Space>
      </Row>

      <Row style={{ marginBottom: 20 }}>
        <Input
          placeholder="Search by Expense ID, Driver Email, or Description"
          prefix={<FileSearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </Row>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading ? { indicator: <LoadingOutlined /> } : false}
        onChange={handleSort}
      />

      {/* Modal for Creating/Editing Expense */}
      <Modal
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingExpense ? "Update" : "Create"}
        cancelText="Cancel"
        confirmLoading={formLoading} // Show loading during form submission
      >
        <Spin spinning={formLoading}>
          {" "}
          {/* Spinner while form is loading */}
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Expense ID" name="expensesId">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Driver Email"
                  name="driverEmail"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the Driver Email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Payment Date"
                  name="paymentDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select the Payment Date",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Payment Time"
                  name="paymentTime"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the Payment Time",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Payment Amount"
                  name="paymentAmount"
                  rules={[
                    { required: true, message: "Please enter the Amount" },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[
                    { required: true, message: "Please select the Status" },
                  ]}
                >
                  <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Description"
              name="paymentDescription"
              rules={[
                { required: true, message: "Please enter the Description" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Payment Slip"
              name="paymentSlip"
              rules={[
                { required: true, message: "Please upload the Payment Slip" },
              ]}
            >
              <Upload>
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Rejection Reason" name="rejectionReason">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default ExpenseManager;
