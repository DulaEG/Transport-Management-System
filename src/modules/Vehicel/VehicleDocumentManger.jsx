import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Row,
  Space, Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  LoadingOutlined,
  SearchOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import VehicleService from "../../services/vehicleService";
import { uploadFile } from "../../services/uploadFileService"; // Make sure to create this service
import jsPDF from "jspdf";
import "jspdf-autotable";

const VehicleDocumentManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const vehicleData = await VehicleService.getAllVehicles();
      setVehicles(vehicleData);
    } catch (error) {
      message.error("Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Show modal for creating or editing vehicle
  const showModal = (vehicle = null) => {
    setEditingVehicle(vehicle);
    if (vehicle) {
      form.setFieldsValue({ ...vehicle });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle form submission for creating/updating vehicle
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);

      let imageUrl = "";
      if (values.imageUrl && values.imageUrl.fileList.length > 0) {
        // Upload the image and get the URL
        imageUrl = await uploadFile(values.imageUrl.fileList[0].originFileObj);
      } else {
        imageUrl = editingVehicle?.profilePicture || ""; // Retain existing image if not uploaded
      }

      const vehicleData = {
        ...values,
        profilePicture: imageUrl,
      };

      if (editingVehicle) {
        await VehicleService.updateVehicle(editingVehicle._id, vehicleData);
        message.success("Vehicle updated successfully.");
      } else {
        await VehicleService.createVehicle(vehicleData);
        message.success("Vehicle created successfully.");
      }

      setIsModalVisible(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error) {
      message.error("Error processing the form.");
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    try {
      await VehicleService.deleteVehicle(id);
      message.success("Vehicle deleted successfully.");
      fetchVehicles();
    } catch (error) {
      message.error("Failed to delete vehicle.");
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Vehicle Documents", 14, 8);
    doc.autoTable({
      head: [
        [
          "Vehicle No",
          "Description",
          "Time Duration",
          "Vehicle Type",
          "License Expiration",
        ],
      ],
      body: vehicles.map((vehicle) => [
        vehicle.vehicleNo,
        vehicle.description,
        vehicle.timeDuration,
        vehicle.vehicleType,
        new Date(vehicle.licenseExp).toLocaleDateString(),
      ]),
    });
    doc.save("vehicles.pdf");
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered vehicles based on search term
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Vehicle No",
      dataIndex: "vehicleNo",
      key: "vehicleNo",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Time Duration",
      dataIndex: "timeDuration",
      key: "timeDuration",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
    },
    {
      title: "License Expiration",
      dataIndex: "licenseExp",
      key: "licenseExp",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Image",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (image) => (
        <img src={image} alt="Vehicle" style={{ width: 50, height: 50 }} />
      ),
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
            onClick={() => deleteVehicle(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <h1>Vehicle Document Manager</h1>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Vehicle
          </Button>
          <Button
            type="default"
            icon={<FilePdfOutlined />}
            onClick={generatePDF}
          >
            Generate PDF
          </Button>
        </Space>
      </Row>

      <Input
        placeholder="Search by vehicle number"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 20 }}
        prefix={<SearchOutlined />}
      />

      <Table
        dataSource={filteredVehicles}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading ? { indicator: <LoadingOutlined /> } : false}
      />

      {/* Modal for Creating/Editing Vehicle */}
      <Modal
        title={editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingVehicle ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Vehicle No"
            name="vehicleNo"
            rules={[
              {
                required: true,
                message: "Please enter the vehicle number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value.toString().length > 100) {
                    return Promise.reject(new Error("Must be less than 100 letters"));
                  } else {
                    return Promise.resolve();
                  }
                },
              })
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Time Duration"
            name="timeDuration"
            rules={[
              { required: true, message: "Please enter the time duration" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Vehicle Type"
            name="vehicleType"
            rules={[
              { required: true, message: "Please enter the vehicle type" },
            ]}
          >
            <Select>
              <Select.Option value='Bus'>Bus</Select.Option>
              <Select.Option value='Van'>Van</Select.Option>
              <Select.Option value='Lorry'>Lorry</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="License Expiration"
            name="licenseExp"
            rules={[
              {
                required: true,
                message: "Please select the license expiration date",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Profile Picture" name="imageUrl">
            <Upload beforeUpload={() => false} showUploadList={true}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VehicleDocumentManager;
