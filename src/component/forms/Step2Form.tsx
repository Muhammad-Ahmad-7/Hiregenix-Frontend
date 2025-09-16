"use client";

import React from "react";
import { Form, Button } from "antd";
import LabelInput from "../common/LabelInput";

const Step2Form = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Submitted:", values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-md mx-auto"
    >
      <LabelInput
        label="Email"
        name="email"
        required
        placeholder="Enter email"
      />
      <LabelInput
        label="Password"
        name="password"
        required
        placeholder="Enter password"
        type="password"
      />

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Step2Form;
