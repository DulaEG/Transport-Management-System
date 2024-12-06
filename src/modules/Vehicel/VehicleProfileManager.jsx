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
import vehicleProfileService from "../../services/vehicleProfileService";
import { uploadFile } from "../../services/uploadFileService";
import jsPDF from "jspdf";
import "jspdf-autotable";

const VehicleProfileManager = () => {
  const [vehicleProfiles, setVehicleProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all vehicle profiles
  const fetchVehicleProfiles = async () => {
    setLoading(true);
    try {
      const profiles = await vehicleProfileService.getAllVProfiles();
      setVehicleProfiles(profiles);
    } catch (error) {
      message.error("Failed to fetch vehicle profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleProfiles();
  }, []);

  // Show modal for creating or editing vehicle profile
  const showModal = (profile = null) => {
    setEditingProfile(profile);
    if (profile) {
      form.setFieldsValue({
        ...profile,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle form submission for creating/updating vehicle profile
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let imageUrl = "";
      if (values.imageUrl && values.imageUrl.file) {
        imageUrl = await uploadFile(values.imageUrl.file.originFileObj);
      } else {
        imageUrl = editingProfile?.imageUrl;
      }

      const profileData = {
        ...values,
        imageUrl,
      };

      if (editingProfile) {
        await vehicleProfileService.updateVProfile(
          editingProfile._id,
          profileData
        );
        message.success("Vehicle profile updated successfully.");
      } else {
        await vehicleProfileService.createVProfile(profileData);
        message.success("Vehicle profile created successfully.");
      }

      setIsModalVisible(false);
      setEditingProfile(null);
      fetchVehicleProfiles();
    } catch (error) {
      message.error("Error in processing the form.");
    }
  };

  // Delete vehicle profile
  const deleteVehicleProfile = async (id) => {
    try {
      await vehicleProfileService.deleteVProfile(id);
      message.success("Vehicle profile deleted successfully.");
      fetchVehicleProfiles();
    } catch (error) {
      message.error("Failed to delete vehicle profile.");
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Vehicle Profiles", 14, 16);
    doc.autoTable({
      head: [["Type", "Description", "Image URL"]],
      body: vehicleProfiles.map((profile) => [
        profile.type,
        profile.description,
        profile.imageUrl,
      ]),
    });
    doc.save("vehicle_profiles.pdf");
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered vehicle profiles based on search term
  const filteredProfiles = vehicleProfiles.filter((profile) =>
    profile.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
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
            onClick={() => deleteVehicleProfile(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <h1>Vehicle Profile Manager</h1>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Vehicle Profile
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
        placeholder="Search by vehicle type"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 20 }}
        prefix={<SearchOutlined />}
      />

      <Table
        dataSource={filteredProfiles}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading ? { indicator: <LoadingOutlined /> } : false}
      />

      {/* Modal for Creating/Editing Vehicle Profile */}
      <Modal
        title={editingProfile ? "Edit Vehicle Profile" : "Add Vehicle Profile"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingProfile ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Type"
            name="type"
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
              }),
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Image" name="imageUrl">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VehicleProfileManager;
