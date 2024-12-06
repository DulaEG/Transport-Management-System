import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, TimePicker, message } from "antd";
import busRouteService from "../../services/busRouteService";
import moment from "moment";

const BusRouteManager = () => {
  const [routes, setRoutes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRouteId, setEditingRouteId] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await busRouteService.getAllRoutes();
      setRoutes(response.data);
    } catch (error) {
      message.error("Failed to fetch routes");
    }
  };

  const showModal = (route = null) => {
    if (route) {
      setEditingRouteId(route._id);
      form.setFieldsValue({
        routeNumber: route.routeNumber,
        from: route.from,
        to: route.to,
        type: route.type,
        frequency: route.frequency,
        stops: route.stops.map((stop) => ({
          name: stop.name,
          arrivalTime: moment(stop.arrivalTime, "HH:mm"),
        })),
      });
    } else {
      setEditingRouteId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRouteId) {
        await busRouteService.updateRoute(editingRouteId, values);
        message.success("Route updated successfully");
      } else {
        await busRouteService.createRoute(values);
        message.success("Route created successfully");
      }
      setIsModalVisible(false);
      fetchRoutes();
    } catch (error) {
      message.error("Failed to save route");
    }
  };

  const handleDelete = async (id) => {
    try {
      await busRouteService.deleteRoute(id);
      message.success("Route deleted successfully");
      fetchRoutes();
    } catch (error) {
      message.error("Failed to delete route");
    }
  };

  const columns = [
    { title: "Route Number", dataIndex: "routeNumber", key: "routeNumber" },
    { title: "From", dataIndex: "from", key: "from" },
    { title: "To", dataIndex: "to", key: "to" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Frequency", dataIndex: "frequency", key: "frequency" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add New Route
      </Button>
      <Table columns={columns} dataSource={routes} rowKey="_id" />
      <Modal
        width={800}
        title={editingRouteId ? "Edit Route" : "Add New Route"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="routeNumber"
            label="Route Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="from" label="From" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="to" label="To" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="frequency"
            label="Frequency"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.List name="stops">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: "flex", marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Missing stop name" }]}
                    >
                      <Input placeholder="Stop name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "arrivalTime"]}
                      rules={[
                        { required: true, message: "Missing arrival time" },
                      ]}
                    >
                      <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Button onClick={() => remove(name)} danger>
                      Delete
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Stop
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default BusRouteManager;
