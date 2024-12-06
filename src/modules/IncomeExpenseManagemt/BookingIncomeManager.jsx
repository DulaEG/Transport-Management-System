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
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  FileSearchOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import bookingIncomeService from "../../services/bookingIncomeService";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BookingIncomeManager = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [form] = Form.useForm();

  // Fetch all incomes
  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const data = await bookingIncomeService.getAllIncomes();
      setIncomes(data);
    } catch (error) {
      message.error("Failed to fetch incomes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Show modal for creating or editing income
  const showModal = (income = null) => {
    setEditingIncome(income);
    if (income) {
      form.setFieldsValue({
        ...income,
        incomeDate: moment(income.incomeDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle form submission for creating/updating income
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const incomeData = {
        ...values,
        incomeDate: values.incomeDate.format("YYYY-MM-DD"),
      };

      if (editingIncome) {
        await bookingIncomeService.updateIncome(editingIncome._id, incomeData);
        message.success("Income updated successfully.");
      } else {
        await bookingIncomeService.createIncome(incomeData);
        message.success("Income created successfully.");
      }

      setIsModalVisible(false);
      setEditingIncome(null);
      fetchIncomes();
    } catch (error) {
      message.error("Error in processing the form.");
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    try {
      await bookingIncomeService.deleteIncome(id);
      message.success("Income deleted successfully.");
      fetchIncomes();
    } catch (error) {
      message.error("Failed to delete income.");
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Income Report", 14, 15);

    const tableColumn = ["Income ID", "Income Date", "Amount", "Description"];
    const tableRows = incomes.map((income) => [
      income.incomeId,
      moment(income.incomeDate).format("YYYY-MM-DD"),
      income.incomeAmount,
      income.incomeDescription,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("booking_income_report.pdf");
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
  const filteredData = incomes.filter(
    (income) =>
      income.incomeId.toLowerCase().includes(searchText.toLowerCase()) ||
      income.incomeDescription.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Income ID",
      dataIndex: "incomeId",
      key: "incomeId",
      sorter: (a, b) => a.incomeId.localeCompare(b.incomeId),
      sortOrder: sortedInfo.columnKey === "incomeId" && sortedInfo.order,
    },
    {
      title: "Income Date",
      dataIndex: "incomeDate",
      key: "incomeDate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      sorter: (a, b) =>
        moment(a.incomeDate).unix() - moment(b.incomeDate).unix(),
      sortOrder: sortedInfo.columnKey === "incomeDate" && sortedInfo.order,
    },
    {
      title: "Amount",
      dataIndex: "incomeAmount",
      key: "incomeAmount",
      sorter: (a, b) => a.incomeAmount - b.incomeAmount,
      sortOrder: sortedInfo.columnKey === "incomeAmount" && sortedInfo.order,
    },
    {
      title: "Description",
      dataIndex: "incomeDescription",
      key: "incomeDescription",
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
            onClick={() => deleteIncome(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <h1>Booking Income Manager</h1>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Income
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={generatePDF}>
            Generate PDF
          </Button>
        </Space>
      </Row>

      <Row style={{ marginBottom: 20 }}>
        <Input
          placeholder="Search by Income ID or Description"
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

      {/* Modal for Creating/Editing Income */}
      <Modal
        title={editingIncome ? "Edit Income" : "Add Income"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingIncome ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Income ID"
            name="incomeId"
            rules={[{ required: true, message: "Please enter the Income ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Income Date"
            name="incomeDate"
            rules={[
              { required: true, message: "Please select the Income Date" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Income Amount"
            name="incomeAmount"
            rules={[{ required: true, message: "Please enter the Amount" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="incomeDescription"
            rules={[
              { required: true, message: "Please enter the Description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingIncomeManager;
