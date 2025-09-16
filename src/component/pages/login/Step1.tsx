"use client";
import UiButton from "@/component/common/CustomButton";
import LabelDatePicker from "@/component/common/LabelDatePicker";
import LabelInput from "@/component/common/LabelInput";
import Step1Form from "@/component/forms/Step1Form";
import Step2Form from "@/component/forms/Step2Form";
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
  Form,
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
        {/* <Step1Form /> */}
        <Step2Form />
      </div>
    </Col>
  );
}
