import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  message,
  Popconfirm,
  Button,
  Input,
  Row,
  Col,
} from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import inquiryService from "../../services/inquiryService";
import InquiryCharts from "./InquiryCharts";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

const UserInquiries = () => {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const allInquiries = await inquiryService.getAllInquiries();
      const userInquiries = allInquiries.data.filter(
        (inquiry) => inquiry.bookingUserId?._id === user?._id
      );
      setInquiries(userInquiries);
    } catch (error) {
      console.error(`Error fetching inquiries: ${error}`);
      message.error("Error fetching inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [user._id]);

  const handleStatusChange = async (value, id) => {
    try {
      await inquiryService.updateInquiry(id, { status: value });
      message.success("Status updated successfully");
      fetchInquiries();
    } catch (error) {
      message.error("Error updating status");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Type", "Date", "Email", "Message", "Status"]],
      body: inquiries.map((inquiry) => [
        inquiry.type,
        new Date(inquiry.date).toLocaleDateString(),
        inquiry.email,
        inquiry.message,
        inquiry.status,
      ]),
    });
    doc.save("inquiries.pdf");
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchEmailChange = (e) => {
    setSearchEmail(e.target.value);
  };

  // Filter by message, email, or type
  const filteredData = inquiries.filter(
    (inquiry) =>
      inquiry.message.toLowerCase().includes(searchText.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
      inquiry.type.toLowerCase().includes(searchText.toLowerCase())
  );

  const inquiryTypes = [
    ...new Set(inquiries.map((inquiry) => inquiry.type)), // Extract unique inquiry types
  ];

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: inquiryTypes.map((type) => ({ text: type, value: type })), // Add filter options
      onFilter: (value, record) => record.type.includes(value),
      sorter: (a, b) => a.type.localeCompare(b.type),
      sortOrder: sortedInfo.columnKey === "type" && sortedInfo.order,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortOrder: sortedInfo.columnKey === "date" && sortedInfo.order,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div>
          <Button
            type={status === "resolved" ? "primary" : "default"}
            icon={<LikeOutlined />}
            onClick={() => handleStatusChange("resolved", record._id)}
            style={{ marginRight: "8px" }}
          />
          <Button
            type={status === "pending" ? "primary" : "default"}
            icon={<DislikeOutlined />}
            onClick={() => handleStatusChange("pending", record._id)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this inquiry?"
          onConfirm={async () => {
            try {
              await inquiryService.deleteInquiry(record._id);
              message.success("Inquiry deleted successfully");
              fetchInquiries();
            } catch (error) {
              message.error("Error deleting inquiry");
            }
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="dashed">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f2f5" }}>
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <h2>User Feedbacks</h2>
        </Col>
        <Col>
          <Button type="primary" onClick={generatePDF}>
            Generate PDF
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
        <Col>
          <Input
            placeholder="Search by email"
            value={searchEmail}
            onChange={handleSearchEmailChange}
            style={{ width: 300 }}
          />
        </Col>
      </Row>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          onChange={(pagination, filters, sorter) => setSortedInfo(sorter)}
        />
      )}
      <InquiryCharts inquiries={inquiries} />
    </div>
  );
};

export default UserInquiries;
