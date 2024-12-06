import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import styled from "styled-components";
import inquiryService from "../../services/inquiryService";

const BackgroundContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/images/bus-bg.jpg");
  background-size: cover;
  background-position: center;
`;

const FeedbackFormContainer = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StyledForm = styled(Form)`
  width: 100%;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 1rem;
`;

const Feedbacks = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const body = {
        ...values,
        bookingUserId: user["_id"],
      };
      await inquiryService.createInquiry(body);
      message.success("Feedback sent successfully");
      form.resetFields(); // Reset the form after successful submission
    } catch (error) {
      console.error(`Error sending feedback ${error}`);
      message.error("Error sending feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      <FeedbackFormContainer>
        <FormTitle>Feedback Form</FormTitle>
        <StyledForm
          form={form} // Pass the form instance to the Form component
          name="feedback"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: user.fullName || "",
            email: user.email || "",
          }}
        >
          <StyledFormItem
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </StyledFormItem>

          <StyledFormItem
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please input the type!" }]}
          >
            <Select>
              <Select.Option value="drivers">Drivers</Select.Option>
              <Select.Option value="vehicles">Vehicles</Select.Option>
              <Select.Option value="facilities">Facilities</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </StyledFormItem>

          <StyledFormItem
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </StyledFormItem>

          <StyledFormItem
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please input the date!" }]}
          >
            <Input type="date" />
          </StyledFormItem>

          <StyledFormItem
            label="Message"
            name="message"
            rules={[
                { required: true, message: "Please input your message!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value.toString().length > 500) {
                    return Promise.reject(new Error("Message must be less than 500 letters"));
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Input.TextArea rows={4} />
          </StyledFormItem>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </StyledForm>
      </FeedbackFormContainer>
    </BackgroundContainer>
  );
};

export default Feedbacks;
