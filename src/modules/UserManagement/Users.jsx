import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
  Row,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import userService from "../../services/userService";
import ViewUser from "./ViewUser";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Pie, Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";

const Drivers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Refs for chart elements
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        message.error("Failed to fetch users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Failed to delete user");
      console.error(error);
    }
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = form.getFieldsValue();
      await userService.updateUser(editingUser._id, values);
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? { ...user, ...values } : user
        )
      );
      message.success("User updated successfully");
      setIsModalVisible(false);
      setEditingUser(null);
    } catch (error) {
      message.error("Failed to update user");
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Driver ID", dataIndex: "driverId", key: "driverId" },
    { title: "Driver Name", dataIndex: "driverName", key: "driverName" },
    { title: "Basic Salary", dataIndex: "basicSalary", key: "basicSalary" },
    {
      title: "Overtime Hours",
      dataIndex: "overtimeHours",
      key: "overtimeHours",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, user) => (
        <div>
          <Button
            onClick={() => {
              setEditingUser(user);
              setViewUserOpen(true);
            }}
            icon={<EyeOutlined />}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(user)}
            style={{ marginRight: 8 }}
          />
          <Button
            onClick={() => handleDelete(user._id)}
            icon={<DeleteOutlined />}
            danger
          />
        </div>
      ),
    },
  ];

  // Data for charts
  const pieData = {
    labels: users.map((user) => user.driverName),
    datasets: [
      {
        label: "Basic Salary",
        data: users.map((user) => user.basicSalary),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const barData = {
    labels: users.map((user) => user.driverName),
    datasets: [
      {
        label: "Overtime Hours",
        data: users.map((user) => parseFloat(user.overtimeHours.replace(/:/g, "."))),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // Function to generate PDF
  const generatePDF = async () => {
    try {
      const doc = new jsPDF({ format: 'a4', orientation: 'landscape' });

      doc.text("User Report", 14, 20);

      // Ensure charts are rendered before capturing them
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000);  // Increased delay to ensure full rendering

      // Convert Pie chart to image with higher resolution
      const pieChartCanvas = pieChartRef.current;
      const pieImage = await html2canvas(pieChartCanvas, { scale: 3 }).then((canvas) =>
        canvas.toDataURL("image/png")
      );
      doc.addImage(pieImage, "PNG", 14, 30, 180, 100);  // Larger size for clarity

      // Convert Bar chart to image
      const barChartCanvas = barChartRef.current;
      const barImage = await html2canvas(barChartCanvas, { scale: 3 }).then((canvas) =>
        canvas.toDataURL("image/png")
      );
      doc.addPage();
      doc.addImage(barImage, "PNG", 14, 30, 180, 100);  // Large size again

      // Table data
      const tableColumn = [
        "Driver ID",
        "Driver Name",
        "Basic Salary",
        "Overtime Hours",
      ];
      const tableRows = [];

      users.forEach((user) => {
        const userData = [
          user.driverId,
          user.driverName,
          user.basicSalary,
          user.overtimeHours,
        ];
        tableRows.push(userData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 150,  // Adjusted start position of table
      });

      doc.save("user_report_with_charts.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate PDF");
    }
  };

  return (
    <div>
      <Row justify={"space-between"}>
        <h1>Salary Details</h1>
        <Input
          placeholder="Search by driver name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: 20, width: "300px" }}
        />
        {/* Generate PDF button */}
        <Button type="primary" icon={<FilePdfOutlined />} onClick={generatePDF}>
          Generate PDF
        </Button>
      </Row>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey={(user) => user._id}
          />

       
        </>
      )}
         {/* Charts */}
         <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
            {/* Pie Chart */}
            <div ref={pieChartRef} style={{ width: "400px", height: "400px" }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>

            {/* Bar Chart */}
            <div ref={barChartRef} style={{ width: "400px", height: "400px" }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Driver ID"
            name="driverId"
            rules={[{ required: true, message: "Please input the Driver ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Driver Name"
            name="driverName"
            rules={[
              { required: true, message: "Please input the Driver Name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Basic Salary"
            name="basicSalary"
            rules={[
              { required: true, message: "Please input the Basic Salary" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Overtime Hours"
            name="overtimeHours"
            rules={[
              { required: true, message: "Please input the Overtime Hours" },
              {
                pattern: /^(\d+):(\d{2})$/,
                message: "Overtime should be in HH:mm format",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <ViewUser
        visible={viewUserOpen}
        onClose={() => setViewUserOpen(false)}
        user={editingUser}
      />
    </div>
  );
};

export default Drivers;