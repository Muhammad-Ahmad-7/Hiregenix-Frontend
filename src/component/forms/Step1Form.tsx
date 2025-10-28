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
type Step1FormProps = {
  onNext: () => void;
  initialValues?: { any };
};

export default function Step1Form({ onNext, initialValues }: Step1FormProps) {
  const options = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
    {
      value: "3",
      label: "Communicated",
    },
  ];
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // ✅ Convert Date to UTC ISO string
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? new Date(values.dateOfBirth).toISOString()
        : "",

      contactNumber:
        "+" +
        values.contactNumber.countryCode +
        values.contactNumber.areaCode +
        values.contactNumber.phoneNumber,
    };

    console.log("✅ Step 1 Values (with UTC):", formattedValues);
    onNext(formattedValues);
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      validateTrigger="onSubmit" // only validate when clicking Next
    >
      <div className="flex flex-col ">
        <Col span={24}>
          <LabelInput
            name="fullName"
            label="Full Name"
            placeholder="Enter your Full Name"
            required
          />
        </Col>
        <Row gutter={24}>
          <Col span={12}>
            <LabelDatePicker
              label="Date Of Birth"
              placeholder="D.O.B"
              name="dateOfBirth"
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
            name="contactNumber"
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
        {/* <div className="flex  justify-between w-full">
          <div className="flex flex-col">
            <Text className="font-semibold">Upload profile picture</Text>
            <Text type="secondary">5MB Limit (JPEG, PNG, SVG)</Text>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 mb-4">
            <PlusIcon />
          </div>
        </div> */}
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
