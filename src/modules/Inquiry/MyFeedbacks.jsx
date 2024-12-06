import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  message,
  Popconfirm,
  Button,
  Input,
  Modal,
  Form,
  Select,
} from "antd";
import styled from "styled-components";
import inquiryService from "../../services/inquiryService";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
const BackgroundContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  background-image: url("/images/bus-bg.jpg");
  align-items: center;
  background-size: cover;
  background-position: center;
`;

const FeedbackTableContainer = styled.div`
  background: white;
  padding: 2rem;
  width: 90%;
  max-width: 1800px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const MyFeedbacks = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  const handleDelete = async (id) => {
    try {
      await inquiryService.deleteInquiry(id);
      await fetchFeedbacks();
    } catch (error) {
      message.error("Error deleting the feedback");
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const allFeedbacks = await inquiryService.getAllInquiries();
      const userFeedbacks = allFeedbacks.data.filter(
        (feedback) => feedback.bookingUserId?._id === user?._id
      );
      setFeedbacks(userFeedbacks);
    } catch (error) {
      console.error(`Error fetching feedbacks: ${error}`);
      message.error("Error fetching feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [user._id]);

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    form.setFieldsValue(feedback);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = form.getFieldsValue();
      await inquiryService.updateInquiry(editingFeedback._id, values);
      message.success("Feedback updated successfully");
      setIsModalVisible(false);
      fetchFeedbacks();
    } catch (error) {
      message.error("Error updating feedback");
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Reaction",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "resolved" ? (
          <LikeOutlined style={{ color: "green", fontSize: "18px" }} />
        ) : (
          <DislikeOutlined style={{ color: "red", fontSize: "18px" }} />
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            style={{ marginRight: 12 }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this feedback?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="dashed">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <BackgroundContainer>
      <FeedbackTableContainer>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={feedbacks}
            pagination={{ pageSize: 10 }}
          />
        )}

        {/* Modal for Editing Feedback */}
        <Modal
          title="Edit Feedback"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: "Please input the type!" }]}
            >
              <Select>
                <Select.Option value="drivers">Drivers</Select.Option>
                <Select.Option value="vehicles">Vehicles</Select.Option>
                <Select.Option value="facilities">Facilities</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Please input the message!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please input the status!" }]}
            >
              <Input />
            </Form.Item>

            {/* Popconfirm before submitting */}
            <Popconfirm
              title="Are you sure you want to save these changes?"
              onConfirm={handleUpdate}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Submit</Button>
            </Popconfirm>
          </Form>
        </Modal>
      </FeedbackTableContainer>
    </BackgroundContainer>
  );
};

export default MyFeedbacks;
