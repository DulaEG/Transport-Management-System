import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
  MailFilled,
  PlusCircleFilled,
  BugFilled,
  BookFilled,
  MoneyCollectFilled,
  BehanceSquareFilled,
  NotificationFilled,
  FileExcelFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import { Route, Routes, Link, Outlet, useNavigate } from "react-router-dom";
import AddUser from "../UserManagement/AddUser";
import OvertimeCalculation from "../UserManagement/OvertimeCalculation/OvertimeCalculation";
import AddMaintenance from "../Maintaince/AddMaintance";
import MaintanceList from "../Maintaince/MaintanceList";
import BookingIncomeManager from "../IncomeExpenseManagemt/BookingIncomeManager";
import DriverIncomeManager from "../IncomeExpenseManagemt/DriverIncomeManager";
import ExpenseManger from "../IncomeExpenseManagemt/ExpenseManger";
import InventoryManager from "../Inventory/InventoryManager";
import VehicleProfileManager from "../Vehicel/VehicleProfileManager";
import VehicleDocumentManger from "../Vehicel/VehicleDocumentManger";
import VehicleNotification from "../Vehicel/VehicleNotification";
import UserInquiries from "../Inquiry/UserInquiries";
import Drivers from "../UserManagement/Users";
import Users from "../Client/Users";
import AdminBookings from "../Bookings/AdminBookings";
import BusRouteManager from "../BusRoutes/BusRoutManager";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const admin = localStorage.getItem("admin");
  useEffect(() => {
    if (!admin) {
      navigate("/admin-login");
    }
  }, [admin]);

  const items = [
    getItem(
      <Link to="/admin/clients">User</Link>,
      "clients-profile",
      <BehanceSquareFilled />
    ),
    getItem("Salary Management", "user-management", <UserOutlined />, [
      getItem(
        <Link to="/admin/users">Salary Details</Link>,
        "users",
        <UsergroupAddOutlined />
      ),
      getItem(
        <Link to="/admin/add-user">Add Driver</Link>,
        "add-user",
        <UserAddOutlined />
      ),
      getItem(
        <Link to="/admin/over-time">Over Time Calculation</Link>,
        "over-time",
        <ClockCircleOutlined />
      ),
    ]),
    getItem("Maintance Mangement", "over-time", <MailFilled />, [
      getItem(
        <Link to="/admin/maintances">Maintenance</Link>,
        "all-maintances",
        <PlusCircleFilled />
      ),
      getItem(
        <Link to="/admin/add-maintances">Add Maintenance</Link>,
        "add-main",
        <PlusCircleFilled />
      ),
    ]),
    getItem("Income/Expense Mangement", "incme-expense", <MailFilled />, [
      getItem(
        <Link to="/admin/booking-income">Booking Income</Link>,
        "booking-income",
        <BookFilled />
      ),
      getItem(
        <Link to="/admin/driver-income">Driver Income</Link>,
        "driver-income",
        <BugFilled />
      ),
      getItem(
        <Link to="/admin/driver-expense">Driver Expense</Link>,
        "driver-expense",
        <MoneyCollectFilled />
      ),
    ]),
    getItem(
      <Link to="/admin/inventory">Inventory</Link>,
      "inventory",
      <MailFilled />
    ),
    getItem(
      <Link to="/admin/vehicle-profile">Vehicle Profile</Link>,
      "vehicle-profile",
      <BehanceSquareFilled />
    ),
    getItem(
      <Link to="/admin/vehicle-document">Vehicle Document</Link>,
      "vehicle-document",
      <FileExcelFilled />
    ),
    getItem(
      <Link to="/admin/vehicle-notification">Vehicle Notification</Link>,
      "vehicle-notification",
      <NotificationFilled />
    ),
    getItem(
      <Link to="/admin/admin-inquiries">Feedbacks</Link>,
      "admin-inquiries",
      <NotificationFilled />
    ),
    getItem(
      <Link to="/admin/bookings">Bookings</Link>,
      "admin-bookings",
      <NotificationFilled />
    ),
    getItem(
      <Link to="/admin/timetable">Timetable</Link>,
      "admin-timetable",
      <NotificationFilled />
    ),
    getItem(
      <p
        onClick={() => {
          localStorage.clear();
          navigate("/admin-login");
        }}
      >
        Logout
      </p>,
      "logout",
      <LogoutOutlined />
    ),
  ];

  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "100vw" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/" element={<h2>Welcome to Admin Dashboard</h2>} />
              <Route path="clients" element={<Users />} />
              <Route path="users" element={<Drivers />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="over-time" element={<OvertimeCalculation />} />
              <Route path="maintances" element={<MaintanceList />} />
              <Route path="add-maintances" element={<AddMaintenance />} />
              <Route path="booking-income" element={<BookingIncomeManager />} />
              <Route path="driver-income" element={<DriverIncomeManager />} />
              <Route path="driver-expense" element={<ExpenseManger />} />
              <Route path="inventory" element={<InventoryManager />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="timetable" element={<BusRouteManager />} />
              <Route
                path="vehicle-profile"
                element={<VehicleProfileManager />}
              />
              <Route
                path="vehicle-document"
                element={<VehicleDocumentManger />}
              />
              <Route
                path="vehicle-notification"
                element={<VehicleNotification />}
              />
              <Route path="admin-inquiries" element={<UserInquiries />} />
            </Routes>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Admin Dashboard ©{new Date().getFullYear()} Created by Your Company
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
