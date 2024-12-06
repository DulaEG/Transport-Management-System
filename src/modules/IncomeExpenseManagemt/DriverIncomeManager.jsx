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
  Select,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  FileSearchOutlined,
  FilePdfOutlined,
  UploadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import driverIncomeService from "../../services/driverIncomeService";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { uploadFile } from "../../services/uploadFileService";
import userService from "../../services/userService";

const { Option } = Select;

const DriverIncomeManager = () => {
  const [incomes, setIncomes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApprovalFormVisible, setIsApprovalFormVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});

  const [formApprovalCurrent, setFormApprovalCurrent] = useState("approved");

  const [form] = Form.useForm();
  const [approvalForm] = Form.useForm();

  // Fetch all incomes
  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const drivers = await userService.getAllUsers();
      const data = await driverIncomeService.getAllIncomes();
      console.log(drivers);
      setDrivers(drivers);
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

  const showApprovalForm = (income) => {
    setEditingIncome(income);
    setIsApprovalFormVisible(true);
  }

  const handleApprovalSubmit = async () => {
    try {
      const values = await approvalForm.validateFields();
      let status = values.status;
      let rejectionReason = values.rejectionReason;

      console.log(status);

      if (status === "approved") {
        status = "approved";
        rejectionReason = "";
      } else {
        status = "rejected";
      }

      const incomeData = {
        status: status,
        rejectionReason: rejectionReason,
      };

      await driverIncomeService.updateIncomeStatus(editingIncome._id, incomeData);
      message.success("Income updated successfully.");
      setIsApprovalFormVisible(false);
      setEditingIncome(null);
      fetchIncomes();
    } catch (error) {
      message.error("Error in processing the form.");
    }
  }

  // Handle form submission for creating/updating income
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let downloadUrl = "";
      if (values.incomeSlipImage) {
        if (values.incomeSlipImage.file) {
          downloadUrl = await uploadFile(
            values.incomeSlipImage.file.originFileObj
          );
        }
      } else {
        downloadUrl = editingIncome.incomeSlipImage;
      }

      const incomeData = {
        ...values,
        incomeSlipImage: downloadUrl,
        incomeDate: values.incomeDate.format("YYYY-MM-DD"),
      };

      if (editingIncome) {
        await driverIncomeService.updateIncome(editingIncome._id, incomeData);
        message.success("Income updated successfully.");
      } else {
        await driverIncomeService.createIncome(incomeData);
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
      await driverIncomeService.deleteIncome(id);
      message.success("Income deleted successfully.");
      fetchIncomes();
    } catch (error) {
      message.error("Failed to delete income.");
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Driver Income Report", 14, 15);

    const tableColumn = [
      "Income ID",
      "Driver Email",
      "Income Date",
      "Income Time",
      "Amount",
      "Description",
      "Status",
    ];
    const tableRows = incomes.map((income) => [
      income.incomeId,
      income.driverEmail,
      moment(income.incomeDate).format("YYYY-MM-DD"),
      income.incomeTime,
      income.incomeAmount,
      income.incomeDescription,
      income.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("driver_income_report.pdf");
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
      income.driverEmail.toLowerCase().includes(searchText.toLowerCase()) ||
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
      title: "Driver Email",
      dataIndex: "driverEmail",
      key: "driverEmail",
      sorter: (a, b) => a.driverEmail.localeCompare(b.driverEmail),
      sortOrder: sortedInfo.columnKey === "driverEmail" && sortedInfo.order,
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
      title: "Income Time",
      dataIndex: "incomeTime",
      key: "incomeTime",
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
          <Button icon={<SwapOutlined />} onClick={() => showApprovalForm(record)} />
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
        <h1>Driver Income Manager</h1>
        <Space>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Income
          </Button> */}
          <Button icon={<FilePdfOutlined />} onClick={generatePDF}>
            Generate PDF
          </Button>
        </Space>
      </Row>

      <Row style={{ marginBottom: 20 }}>
        <Input
          placeholder="Search by Income ID, Driver Email, or Description"
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
        open={isModalVisible}
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
            label="Driver Email"
            name="driverEmail"
            rules={[
              { required: true, message: "Please enter the Driver Email" },
            ]}
          >
            <Select>
              {drivers.map((driver) => {
                  return (<Option key={driver._id} value={driver.email}>
                    {driver.email}
                  </Option>)
              })}
            </Select>
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
            label="Income Time"
            name="incomeTime"
            rules={[
              { required: true, message: "Please enter the Income Time" },
            ]}
          >
            <Input />
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

          <Form.Item label="Income Slip Image" name="incomeSlipImage">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          {/* <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the Status" }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Rejection Reason" name="rejectionReason">
            <Input.TextArea />
          </Form.Item> */}
        </Form>
      </Modal>

      {/* Modal for Approval Form */}
      <Modal
        title="Approval Form"
        open={isApprovalFormVisible}
        onOk={handleApprovalSubmit}
        onCancel={() => setIsApprovalFormVisible(false)}
        cancelText="Cancel"
        okText="Submit">
        <Form form={approvalForm} layout="vertical">
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the Status" }]}
          >

            <Select defaultActiveFirstOption={formApprovalCurrent} onChange={(value) => setFormApprovalCurrent(value)}>
              <Option value="approved">Approve</Option>
              <Option value="rejected">Reject</Option>
            </Select>
          </Form.Item>

          {
            formApprovalCurrent === "rejected" &&
            <Form.Item label="Rejection Reason" name="rejectionReason">
              <Input.TextArea />
            </Form.Item>
          }
        </Form>
      </Modal>
    </div>
  );
};

export default DriverIncomeManager;
