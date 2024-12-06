import React, { useEffect, useState } from "react";
import { List, Card, Typography, Spin, Statistic } from "antd";
import vehicleService from "../../services/vehicleService";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import duration from "dayjs/plugin/duration";

dayjs.extend(isBetween);
dayjs.extend(duration);

const { Title, Paragraph } = Typography;

const VehicleNotification = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAllVehicles();
        const today = dayjs();
        const oneWeekLater = today.add(1, "week");

        // Filter vehicles with licenses expiring within the next week
        const expiringSoon = data.filter((vehicle) => {
          const expiryDate = dayjs(vehicle.licenseExp);
          return expiryDate.isBetween(today, oneWeekLater, null, "[]");
        });

        setVehicles(expiringSoon);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: 32 }}>
      <Title level={3}>License Expiration Vehicle Notification</Title>
      <List
        itemLayout="horizontal"
        dataSource={vehicles}
        renderItem={(vehicle) => {
          return (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <Title level={4}>{vehicle.vehicleNo}</Title>
                <Paragraph>{vehicle.description}</Paragraph>
                <Paragraph>Type: {vehicle.vehicleType}</Paragraph>
                <Paragraph>License Expiry:</Paragraph>
                <Statistic.Countdown
                  title="Expires in"
                  value={new Date(vehicle.licenseExp).getTime()}
                  format="D [days] H [hours] m [minutes] s [seconds]"
                />
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default VehicleNotification;
