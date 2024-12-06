import React, { useState, useEffect } from "react";
import { Card, Typography, Space, Spin } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  VerticalRightOutlined,
} from "@ant-design/icons";
import busRouteService from "../../services/busRouteService";
import moment from "moment";

const { Title, Text } = Typography;

const UserBusRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await busRouteService.getAllRoutes();
      setRoutes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return moment(time, "HH:mm").format("h:mm A");
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "90%", alignItems: "center", padding: 12 }}
    >
      {routes.map((route) => (
        <Card key={route._id} style={{ width: "80vw" }}>
          <Space align="center">
            <VerticalRightOutlined
              style={{ fontSize: "24px", color: "#1890ff" }}
            />
            <Title level={4} style={{ margin: 0 }}>
              {`${route.from} to ${route.to} ${route.routeNumber}`}
            </Title>
          </Space>
          <Text type="secondary">{`${route.type} - ${route.frequency}`}</Text>
          <Space direction="vertical" style={{ marginTop: "16px" }}>
            {route.stops.map((stop, index) => (
              <Space key={index} align="center">
                <EnvironmentOutlined />
                <Text strong>{stop.name}</Text>
                <ClockCircleOutlined />
                <Text>{formatTime(stop.arrivalTime)}</Text>
                {index < route.stops.length - 1 && (
                  <Text type="secondary">{">"}</Text>
                )}
              </Space>
            ))}
          </Space>
        </Card>
      ))}
    </Space>
  );
};

export default UserBusRoutes;
