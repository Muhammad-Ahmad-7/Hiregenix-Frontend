"use client";
import Step1Form from "@/component/forms/Step1Form";
import Step2Form from "@/component/forms/Step2Form";
import { Col, Typography } from "antd";
import React from "react";
const { Title, Text } = Typography;

export default function Step1() {
  return (
    <Col xs={24} md={12} className=" p-4 lg:px-32 lg:py-16">
      {/* Logo Circle */}
      <Text className="w-full !text-[#1677FF] font-semibold">STEP 2 OF 4</Text>

      {/* Text & Buttons */}
      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          Social Information
        </Title>
        {/* <Step1Form /> */}
        <Step2Form />
      </div>
    </Col>
  );
}
