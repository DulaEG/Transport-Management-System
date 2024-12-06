import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Row,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import maintenanceService from "../../services/maintainceService";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Option } = Select;

const MaintenanceList = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all maintenances on component mount
  useEffect(() => {
    const fetchMaintenances = async () => {
      setLoading(true);
      try {
        const data = await maintenanceService.getAllMaintenances();
        setMaintenances(data);
        setFilteredMaintenances(data);
      } catch (error) {
        message.error("Failed to fetch maintenances");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = maintenances.filter((maintenance) =>
      maintenance.vehicleNumber.toLowerCase().includes(value)
    );
    setFilteredMaintenances(filteredData);
  };

  // Show edit modal with pre-filled form
  const showEditModal = (maintenance) => {
    setEditingMaintenance(maintenance);
    form.setFieldsValue({
      ...maintenance,
      serviceDate: moment(maintenance.serviceDate), // Parse date to moment
    });
    setIsModalVisible(true);
  };

  // Handle form submission for updating maintenance
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedMaintenance = {
        ...values,
        serviceDate: values.serviceDate.format("YYYY-MM-DD"), // Format date
      };

      await maintenanceService.updateMaintenance(
        editingMaintenance._id,
        updatedMaintenance
      );
      setMaintenances(
        maintenances.map((m) =>
          m._id === editingMaintenance._id ? { ...m, ...updatedMaintenance } : m
        )
      );
      message.success("Maintenance updated successfully");
      setIsModalVisible(false);
      setEditingMaintenance(null);
    } catch (error) {
      message.error("Failed to update maintenance");
    }
  };

  // Fetch maintenances again after deletion
  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const data = await maintenanceService.getAllMaintenances();
      setMaintenances(data);
      setFilteredMaintenances(data);
    } catch (error) {
      message.error("Failed to fetch maintenances");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (record) => {
    await maintenanceService.deleteMaintenance(record._id);
    await fetchMaintenances();
  };

  // Generate PDF using jsPDF and jsPDF-Autotable
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Maintenance List", 20, 10);

    const tableColumn = [
      "Service ID",
      "Vehicle Number",
      "Service Date",
      "Service Type",
      "Service Status",
    ];
    const tableRows = [];

    filteredMaintenances.forEach((maintenance) => {
      const maintenanceData = [
        maintenance.serviceID,
        maintenance.vehicleNumber,
        moment(maintenance.serviceDate).format("YYYY-MM-DD"),
        maintenance.serviceType,
        maintenance.serviceStatus,
      ];
      tableRows.push(maintenanceData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("maintenance_list.pdf");
  };

  // Table columns
  const columns = [
    {
      title: "Service ID",
      dataIndex: "serviceID",
      key: "serviceID",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Service Date",
      dataIndex: "serviceDate",
      key: "serviceDate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
    },
    {
      title: "Service Status",
      dataIndex: "serviceStatus",
      key: "serviceStatus",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteRecord(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <h1>Maintenance List</h1>
        <Input
          placeholder="Search by Vehicle Number"
          value={searchTerm}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<FilePdfOutlined />}
          onClick={generatePDF}
          style={{ marginLeft: "10px" }}
        >
          Export to PDF
        </Button>
      </Row>

      <Table
        dataSource={filteredMaintenances}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading}
      />

      {/* Modal for Editing Maintenance */}
      <Modal
        title="Edit Maintenance"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Service ID"
            name="serviceID"
            rules={[{ required: true, message: "Please enter the Service ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Vehicle Number"
            name="vehicleNumber"
            rules={[
              { required: true, message: "Please enter the Vehicle Number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Service Date"
            name="serviceDate"
            rules={[
              { required: true, message: "Please select the Service Date" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Service Type"
            name="serviceType"
            rules={[
              { required: true, message: "Please select the Service Type" },
            ]}
          >
            <Select>
              <Option value="Oil Change">Oil Change</Option>
              <Option value="Tire Rotation">Tire Rotation</Option>
              <Option value="Brake Check">Brake Check</Option>
              <Option value="Engine Repair">Engine Repair</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Service Status"
            name="serviceStatus"
            rules={[
              { required: true, message: "Please select the Service Status" },
            ]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceList;
