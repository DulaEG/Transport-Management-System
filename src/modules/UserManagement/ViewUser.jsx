import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, message } from "antd";
import userService from "../../services/userService";

const ViewUser = ({ visible, onClose, user }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await userService.getUserById(user._id);
          setUserData(res);
        } catch (error) {
          message.error("Failed to fetch user details");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserDetails();
  }, [user]);

  return (
    <Modal
      width={1000}
      visible={visible}
      onCancel={onClose}
      title="User Details"
      footer={null}
    >
      {loading ? (
        <Spin />
      ) : userData ? (
        <Descriptions bordered>
          <Descriptions.Item label="Driver ID">
            {userData.driverId}
          </Descriptions.Item>
          <Descriptions.Item label="Driver Name">
            {userData.driverName}
          </Descriptions.Item>
          <Descriptions.Item label="Basic Salary">
            {userData.basicSalary}
          </Descriptions.Item>
          <Descriptions.Item label="Overtime Hours">
            {userData.overtimeHours}
          </Descriptions.Item>
          <Descriptions.Item label="Overtime Rate">
            {userData.overtimeRate}
          </Descriptions.Item>
          <Descriptions.Item label="Present Days">
            {userData.presentDays}
          </Descriptions.Item>
          <Descriptions.Item label="Advance">
            {userData.advance}
          </Descriptions.Item>
          <Descriptions.Item label="Net Pay">
            {userData.netPay}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No user data available</p>
      )}
    </Modal>
  );
};

export default ViewUser;
