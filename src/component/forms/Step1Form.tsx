import { Col, Form, Row, Typography } from "antd";
import React from "react";
import PlusIcon from "@/icons/PlusIcon";
import {
  LabelDatePicker,
  LabelInput,
  LabelPhoneNumber,
  LabelSelect,
} from "../common";
import UiButton from "../common/CustomButton";
const { Text } = Typography;
export default function Step1Form() {
  const options = [
    {
      value: "1",
      label: "Not Identified",
    },
    {
      value: "2",
      label: "Closed",
    },
    {
      value: "3",
      label: "Communicated",
    },
    {
      value: "4",
      label: "Identified",
    },
    {
      value: "5",
      label: "Resolved",
    },
    {
      value: "6",
      label: "Cancelled",
    },
  ];
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form Values:", values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      validateTrigger="onSubmit" // only validate when clicking Next
    >
      <div className="flex flex-col ">
        <Col span={24}>
          <LabelInput
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            required
            // type="email"
            rules={[
              { type: "email", message: "Please enter a valid email address" },
            ]}
          />
        </Col>
        <Row gutter={24}>
          <Col span={12}>
            <LabelDatePicker
              label="Date Of Birth"
              placeholder="D.O.B"
              name="dob"
              required
            />
          </Col>
          <Col span={12}>
            <LabelSelect
              label="Gender"
              placeholder="Gender"
              name="gender"
              required
              options={options}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <LabelSelect
              name="country"
              label="Country"
              placeholder="Country"
              required
              options={[
                { label: "USA", value: "us" },
                { label: "UK", value: "uk" },
              ]}
              itemProps={{
                tooltip: "Pick your country",
                validateTrigger: "onBlur",
              }}
            />
          </Col>
          <Col span={12}>
            <LabelSelect
              label="City"
              placeholder="City"
              name="city"
              options={options}
            />
          </Col>
        </Row>
        <Col span={24}>
          <LabelPhoneNumber
            label="Contact Number"
            name="phone"
            required
            // rules={[
            //   { required: true, message: "Contact number is required" },
            //   {
            //     pattern: /^[0-9]{10,15}$/,
            //     message: "Please enter a valid phone number",
            //   },
            // ]}
          />
          {/* <Text className="font-normal text-[#000000D9]">
            Contact Number <span className="text-red-500">*</span>
          </Text>
          <FormItem name="phone">
            <PhoneInput enableSearch />
          </FormItem> */}
        </Col>
        <div className="flex  justify-between w-full">
          <div className="flex flex-col">
            <Text className="font-semibold">Upload profile picture</Text>
            <Text type="secondary">5MB Limit (JPEG, PNG, SVG)</Text>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 mb-4">
            <PlusIcon />
          </div>
        </div>
      </div>
      <div className="mt-4 gap-2 flex flex-col item-center">
        <Col span={6}>
          <UiButton
            htmlType="submit"
            type="primary"
            onClick={() => {}}
            block
            size="large"
            className="!rounded-xl"
          >
            Next
          </UiButton>
        </Col>
      </div>
    </Form>
  );
}
