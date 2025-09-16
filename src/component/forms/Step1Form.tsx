import { Col, Form, Row, Typography } from "antd";
import React from "react";
import UiButton from "../common/CustomButton";
import LabelInput from "../common/LabelInput";
import LabelDatePicker from "../common/LabelDatePicker";
import FormItem from "antd/es/form/FormItem";
import PhoneInput from "antd-phone-input";
import PlusIcon from "@/icons/PlusIcon";
import LabelSelect from "../common/LabelSelect";
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
    <Form form={form} onFinish={onFinish}>
      <div className="flex flex-col ">
        <Col span={24}>
          <LabelInput
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            required
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
              label="Location"
              placeholder="Location"
              name="location"
              options={options}
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
        <div className="flex flex-col gap-2 w-full">
          <Text className="font-normal text-[#000000D9]">
            Contact Number <span className="text-red-500">*</span>
          </Text>
          <FormItem name="phone">
            <PhoneInput enableSearch />
          </FormItem>
        </div>
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
