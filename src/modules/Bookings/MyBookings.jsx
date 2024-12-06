import React, { useEffect, useState } from "react";
import {
  getAllTripBookings,
  deleteTripBooking,
  updateTripBooking,
} from "../../services/bookingService";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  message,
  Popconfirm,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from "moment";

// Styled component for wrapping the page
const MyBookingsWrapper = styled.div`
  padding: 20px;
`;

// Styled component for the form layout
const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

// MyBookings Component
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // State for dynamically calculated totalAmount
  const userId = () => {
    if (localStorage.getItem("currentUser")) {
      return JSON.parse(localStorage.getItem("currentUser"))["_id"];
    }

    return "asdasdadadadasd";
  }; // Example User ID
  const [form] = Form.useForm();
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAllTripBookings();

      // Filter bookings by userId
      const userBookings = data.filter(
        (booking) => booking.userId === userId()
      );
      setBookings(userBookings);
    } catch (error) {
      message.error("Failed to fetch bookings.");
    }
    setLoading(false);
  };
  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getAllTripBookings();

        // Filter bookings by userId
        const userBookings = data.filter(
          (booking) => booking.userId === userId()
        );
        setBookings(userBookings);
      } catch (error) {
        message.error("Failed to fetch bookings.");
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  // Delete booking
  const handleDelete = async (id) => {
    try {
      await deleteTripBooking(id);
      await fetchBookings();
      message.success("Booking deleted successfully.");
    } catch (error) {
      message.error("Failed to delete booking.");
    }
  };

  // Open update modal
  const handleUpdate = (booking) => {
    setSelectedBooking(booking);
    setTotalAmount(booking.totalAmount); // Set initial totalAmount
    setModalVisible(true);
    form.setFieldsValue({
      ...booking,
      date: moment(booking.date),
      time: moment(booking.time, "HH:mm"),
    });
  };

  // Update booking
  const handleUpdateSubmit = async (values) => {
    try {
      await updateTripBooking(selectedBooking._id, {
        ...values,
        totalAmount,
        date: values.date.toISOString(),
        time: values.time,
      });
      await fetchBookings();
      message.success("Booking updated successfully.");
      setModalVisible(false);
    } catch (error) {
      message.error("Failed to update booking.");
    }
  };

  // Handle form changes to calculate the total amount
  const handleFormChange = (changedValues, allValues) => {
    const { totalDistance, totalDays } = allValues;
    if (totalDistance && totalDays) {
      const calculatedAmount = totalDistance * totalDays * 10; // Example: charge $10 per day per km
      setTotalAmount(calculatedAmount);
    }
  };

  return (
    <MyBookingsWrapper>
      <h2>My Bookings</h2>
      <Table
        dataSource={bookings}
        loading={loading}
        rowKey="_id"
        columns={[
          {
            title: "Date",
            dataIndex: "date",
            render: (date) => moment(date).format("MMM YYYY DD"),
          },
          {
            title: "Time",
            dataIndex: "time",
            render: (time) => moment(time).format("hh:mm"),
          },
          {
            title: "Venue",
            dataIndex: "venue",
          },
          {
            title: "Seats",
            dataIndex: "numberOfSeats",
          },
          {
            title: "Bus Number",
            dataIndex: "busNumber",
          },
          {
            title: "Total Amount",
            dataIndex: "totalAmount",
          },
          {
            title: "Actions",
            render: (text, record) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleUpdate(record)}
                />
                <Popconfirm
                  title="Are you sure you want to delete this booking?"
                  onConfirm={() => handleDelete(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      {/* Update Booking Modal */}
      <Modal
        open={modalVisible}
        title="Update Booking"
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Update"
        cancelText="Cancel"
      >
        <StyledForm
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange} // Trigger calculation when values change
          onFinish={handleUpdateSubmit}
        >
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker disabled format="MMM YYYY DD" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select a time!" }]}
          >
            <TimePicker disabled format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="venue"
            label="Venue"
            rules={[{ required: true, message: "Please enter the venue!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="numberOfSeats"
            label="Number of Seats"
            rules={[
              { required: true, message: "Please enter the number of seats!" },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="totalDistance"
            label="Total Distance (Km)"
            rules={[
              { required: true, message: "Please enter total distance!" },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="totalDays"
            label="Total Days"
            rules={[
              { required: true, message: "Please enter the total days!" },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="Total Amount">
            <InputNumber value={totalAmount} disabled />
          </Form.Item>
        </StyledForm>
      </Modal>
    </MyBookingsWrapper>
  );
};

export default MyBookings;
