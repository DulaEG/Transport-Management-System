import React, { useState } from "react";
import {
  Form,
  InputNumber,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Input,
  Row,
  Col,
  message,
} from "antd";
import styled from "styled-components";
import { createTripBooking } from "../../services/bookingService";

const { Option } = Select;

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  background-color: rgba(240, 240, 240, 0.5);
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const BookingPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [busNumbers, setBusNumbers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);

  const handleFirstStepSubmit = (values) => {
    // Simulate fetching bus numbers based on venue and number of seats
    const fetchedBusNumbers = ["BX101", "BX102", "BX103", "BX104"]; // Example data
    setBusNumbers(fetchedBusNumbers);
    form.setFieldsValue({
      date: values.date,
      time: values.time,
      venue: values.venue,
      numberOfSeats: values.numberOfSeats,
    });
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      values.totalAmount = totalAmount;
      await createTripBooking(values);
      message.success("Booking placed successfully");
      setLoading(false);
      form.resetFields();
      setBusNumbers([]);
      setTotalAmount(null);
    } catch (error) {
      setLoading(false);
      console.error("Failed to create booking:", error);
      message.error("Booking placimg failed, Try again");
    }
  };

  const calculateTotalAmount = (totalKm, totalDays) => {
    const amount = totalDays * totalKm * 120;
    setTotalAmount(amount);
    form.setFieldsValue({ totalAmount: amount });
  };

  return (
    <Container>
      <Form form={form} layout="vertical" onFinish={handleFinalSubmit}>
        <Row>
          <Col span={11}>
            <StyledFormItem
              name="date"
              rules={[{ required: true, message: "Please select a date!" }]}
              label="Select Date"
            >
              <DatePicker />
            </StyledFormItem>
          </Col>
          <Col span={2} />
          <Col span={11}>
            <StyledFormItem
              name="time"
              rules={[{ required: true, message: "Please select time!" }]}
              label="Select Time"
            >
              <TimePicker format="HH:mm" />
            </StyledFormItem>
          </Col>
        </Row>
        <StyledFormItem
          name="venue"
          rules={[{ required: true, message: "Please input the venue!" },
            ({ getFieldValue }) => ({
            validator(_, value) {
              if (/^\d+$/.test(value)) {
                return Promise.reject(new Error("Invalid venue"));
              } else {
                return Promise.resolve();
              }
            },
          }),]}
          label="Venue"
        >
          <Input min={1} />
        </StyledFormItem>
        <Row>
          <Col>
            <StyledFormItem
              name="numberOfSeats"
              rules={[
                {
                  required: true,
                  message: "Please input the number of seats!",
                },
              ]}
              label="Number of Seats"
            >
              <InputNumber min={1} />
            </StyledFormItem>
          </Col>
          <Col>
            <Button
              style={{ marginTop: 32 }}
              type="primary"
              onClick={() => handleFirstStepSubmit(form.getFieldsValue())}
            >
              Next
            </Button>
          </Col>
        </Row>

        {busNumbers.length > 0 && (
          <>
            <StyledFormItem
              name="busNumber"
              rules={[{ required: true, message: "Please select a bus!" }]}
              label="Select Bus"
            >
              <Select placeholder="Select a bus">
                {busNumbers.map((bus) => (
                  <Option key={bus} value={bus}>
                    {bus}
                  </Option>
                ))}
              </Select>
            </StyledFormItem>

            <Row>
              <Col span={6}>
                <StyledFormItem
                  name="totalDistance"
                  rules={[
                    {
                      required: true,
                      message: "Please input the total distance!",
                    },
                  ]}
                  label="Total Distance (km)"
                >
                  <InputNumber min={1} />
                </StyledFormItem>
              </Col>{" "}
              <Col span={2} />
              <Col span={6}>
                <StyledFormItem
                  name="totalDays"
                  rules={[
                    { required: true, message: "Please input the total days!" },
                  ]}
                  label="Total Days"
                >
                  <InputNumber
                    min={1}
                    onChange={(value) => {
                      const { totalDistance } = form.getFieldsValue();
                      if (value && totalDistance) {
                        calculateTotalAmount(totalDistance, value);
                      }
                    }}
                  />
                </StyledFormItem>
              </Col>
              <Col span={2} />
              <Col span={6}>
                <StyledFormItem name="totalAmount" label="Total Amount">
                  <InputNumber min={1} value={totalAmount} disabled />
                </StyledFormItem>
              </Col>
            </Row>

            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Place Booking
            </Button>
          </>
        )}
      </Form>
    </Container>
  );
};

export default BookingPage;
