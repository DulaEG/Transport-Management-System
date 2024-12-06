import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Input, Space, Select } from "antd";
import { DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import bookingUserService from "../../services/clientController";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment"; // Import moment for date formatting

const { Search } = Input;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [customerCount, setCustomerCount] = useState(0); // State to store the customer count

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchText]);

  const fetchUsers = async () => {
    try {
      const data = await bookingUserService.getAllUsers();
      setUsers(data.data);
      setFilteredUsers(data.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await bookingUserService.deleteUser(id);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    if (month === "all") {
      setFilteredUsers(users); // Show all users if "All" is selected
      setCustomerCount(users.length); // Set customer count for all users
    } else {
      const filteredByMonth = users.filter(
        (user) => moment(user.createdAt).format("MM") === month
      );
      setFilteredUsers(filteredByMonth);
      setCustomerCount(filteredByMonth.length); // Set customer count for the selected month
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Users Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Customer Count: ${filteredUsers.length}`, 14, 32);
    doc.autoTable({
      startY: 40,
      head: [
        [
          "Full Name",
          "Username",
          "Email",
          "Phone Number",
          "Address",
          "Joined Date",
        ],
      ],
      body: filteredUsers.map((user) => [
        user.fullName,
        user.username,
        user.email,
        user.phoneNumber,
        user.address,
        moment(user.createdAt).format("YYYY-MM-DD"), // Format joined date
      ]),
    });
    doc.save(
      selectedMonth === "all"
        ? "users_all_months.pdf"
        : `users_joined_${selectedMonth}.pdf`
    );
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD"), // Format date
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h1>Users</h1>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search users"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Select month"
          onChange={handleMonthChange}
          style={{ width: 120 }}
        >
          <Option value="all">All</Option>
          {moment.months().map((month, index) => (
            <Option key={index + 1} value={String(index + 1).padStart(2, "0")}>
              {month}
            </Option>
          ))}
        </Select>
        <Button
          icon={<FilePdfOutlined />}
          onClick={generatePDF}
          disabled={!selectedMonth}
        >
          Generate PDF
        </Button>
      </Space>

      {/* Display Customer Count */}
      <p>
        Customer Count: <strong>{customerCount}</strong>
      </p>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default Users;
