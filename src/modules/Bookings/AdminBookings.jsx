import React, { useEffect, useState } from "react";
import {
  getAllTripBookings,
  updateTripBooking,
  deleteTripBooking,
} from "../../services/bookingService";
import { Table, Button, Input, Space, Popconfirm, message } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    getAllTripBookings().then((res) => {
      setBookings(res);
      setFilteredBookings(res);
    });
  }, []);

  const handleSearch = (value) => {
    const filteredData = bookings.filter((booking) =>
      Object.keys(booking).some((key) =>
        String(booking[key]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredBookings(filteredData);
  };

  const handleUpdatePaidStatus = (bookingId, currentStatus) => {
    const newStatus = !currentStatus;
    updateTripBooking(bookingId, { paidStatus: newStatus })
      .then(() => {
        message.success("Payment status updated successfully!");
        const updateBookings = (bookingsList) =>
          bookingsList.map((booking) =>
            booking._id === bookingId
              ? { ...booking, paidStatus: newStatus }
              : booking
          );
        setBookings(updateBookings);
        setFilteredBookings(updateBookings);
      })
      .catch(() => {
        message.error("Failed to update payment status.");
      });
  };

  const handleDelete = (bookingId) => {
    deleteTripBooking(bookingId)
      .then(() => {
        message.success("Booking deleted successfully!");
        const removeBooking = (bookingsList) =>
          bookingsList.filter((booking) => booking._id !== bookingId);
        setBookings(removeBooking);
        setFilteredBookings(removeBooking);
      })
      .catch(() => {
        message.error("Failed to delete booking.");
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Date",
      "Time",
      "Venue",
      "Number of Seats",
      "Bus Number",
      "Total Distance",
      "Total Days",
      "Total Amount",
    ];
    const tableRows = filteredBookings.map((booking) => [
      moment(booking.date).format("MMM YYYY DD"),
      moment(booking.time).format("HH:mm"),
      booking.venue,
      booking.numberOfSeats,
      booking.busNumber,
      booking.totalDistance,
      booking.totalDays,
      `$${booking.totalAmount}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("bookings_report.pdf");
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (date) => moment(date).format("MMM YYYY DD"),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => moment(a.time).unix() - moment(b.time).unix(),
      render: (time) => moment(time).format("HH:mm"),
    },
    {
      title: "Venue",
      dataIndex: "venue",
      key: "venue",
      sorter: (a, b) => a.venue.localeCompare(b.venue),
    },
    {
      title: "Seats",
      dataIndex: "numberOfSeats",
      key: "numberOfSeats",
      sorter: (a, b) => a.numberOfSeats - b.numberOfSeats,
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "busNumber",
      sorter: (a, b) => a.busNumber.localeCompare(b.busNumber),
    },
    {
      title: "Total Distance (Km)",
      dataIndex: "totalDistance",
      key: "totalDistance",
      sorter: (a, b) => a.totalDistance - b.totalDistance,
    },
    {
      title: "Total Days",
      dataIndex: "totalDays",
      key: "totalDays",
      sorter: (a, b) => a.totalDays - b.totalDays,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (totalAmount) => `$${totalAmount}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paidStatus",
      key: "paidStatus",
      render: (paidStatus, record) => (
        <Popconfirm
          title="Do you want to update the payment status?"
          onConfirm={() => handleUpdatePaidStatus(record._id, paidStatus)}
          okText="Yes"
          cancelText="No"
          style={{ width: 100 }}
        >
          <Button
            style={{ width: 19 }}
            disabled={paidStatus}
            type={paidStatus ? "primary" : "default"}
          >
            {paidStatus ? "Paid" : "Unpaid"}
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this booking?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Search bookings"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button type="primary" onClick={generatePDF}>
          Generate PDF
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredBookings}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AdminBookings;
