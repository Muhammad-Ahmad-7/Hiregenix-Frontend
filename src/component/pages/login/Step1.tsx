"use client";
import UiButton from "@/component/common/CustomButton";
import LabelInput from "@/component/common/LabelInput";
import PlusIcon from "@/icons/PlusIcon";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import PhoneInput from "antd-phone-input";
import FormItem from "antd/es/form/FormItem";
import Link from "next/link";
import React from "react";
const { Title, Text } = Typography;

export default function Step1() {
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
  return (
    <Col xs={24} md={12} className=" p-4 lg:px-32 lg:py-16">
      {/* Logo Circle */}
      <Text className="w-full !text-[#1677FF] font-semibold">STEP 1 OF 4</Text>

      {/* Text & Buttons */}
      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          Personal Information
        </Title>
        <div className="flex flex-col gap-5">
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
              <div className="flex flex-col gap-2 w-full">
                <Text className="font-normal text-[#000000D9]">
                  Date of Birth <span className="text-red-500">*</span>
                </Text>
                <DatePicker className="w-full" />
              </div>
            </Col>
            <Col span={12}>
              <div className="flex flex-col gap-2 w-full">
                <Text className="font-normal text-[#000000D9]">
                  Gender <span className="text-red-500">*</span>
                </Text>
                <Select
                  className="!w-full"
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={[
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
                  ]}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <div className="flex flex-col gap-2 w-full">
                <Text className="font-normal text-[#000000D9]">
                  Location <span className="text-red-500">*</span>
                </Text>
                <Select
                  className="!w-full"
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={options}
                />{" "}
              </div>
            </Col>
            <Col span={12}>
              <div className="flex flex-col gap-2 w-full">
                <Text className="font-normal text-[#000000D9]">
                  City <span className="text-red-500">*</span>
                </Text>
                <Select
                  className="!w-full"
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={[
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
                  ]}
                />
              </div>
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
      </div>
    </Col>
  );
}
