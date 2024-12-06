import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./modules/Admin/AdminDashboard";
import Home from "./common/Home/Home";
import AdminLogin from "./modules/Admin/AdminLogin";

// Imported from App.jsx
import DashBoard from "./modules/components/DashBoard";
import Employee from "./modules/components/Employee";
import Duty from "./modules/components/Duty";
import { NavBar, SideBar as ImportedSideMenu } from "./modules/components";
import Login from "./modules/pages/Auth/Login";
import SignUp from "./modules/pages/Auth/Signup";
import AttendanceHistory from "./modules/components/AttendanceHistory";
import AttendanceChart from "./modules/components/AttendanceChart";

import Users from './modules/OrderInventory/users';
import Order from './modules/OrderInventory/Order';
import Submit from './modules/OrderInventory/Submit';
import SubInventory from './modules/Inventory/SubInventory';

function MainLayout() {
  return (
    <div className="w-screen h-screen overflow-x-hidden App">
      <div className="flex flex-1 justify-start items-start bg-[#f5faff]">
        <div className="fixed">
          <ImportedSideMenu />
        </div>
        <div className="flex-1 h-full overflow-x-hidden overflow-y-auto ml-[270px] w-[calc(100%-271px)]">
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="dashboard" element={<DashBoard />} />
              <Route path="employee2" element={<Employee />} />
              <Route path="duty2" element={<Duty />} />
              <Route path="attendance2" element={<AttendanceHistory />} />
              <Route path="attendance-chart2" element={<AttendanceChart />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes from App.js */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/*" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Routes from App.jsx */}
        <Route path="/admin_login" element={<Login />} />
        <Route path="/admin_signup" element={<SignUp />} />

        {/* MainLayout route with a distinct base path */}
        <Route path="/dashboard/*" element={<MainLayout />} />

        {/* OrderInventory routes */}
        <Route path="/Users" element={<Users />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/Submit" element={<Submit />} />
        <Route path="/SubInventory" element={<SubInventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
