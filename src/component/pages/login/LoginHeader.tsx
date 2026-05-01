"use client";
import { INFO } from "@/constants/info";
import { Col, Image, Row, Typography } from "antd";
import React from "react";

const { Text } = Typography;
export default function LoginHeader() {
  return (
    <Row className="auth-header h-20 px-6 flex items-center">
      <Col span={12} className="!flex items-center gap-2">
        <Image width={36} height={36} src={"/logo/logo.png"} alt="Logo" />
        <Text className="font-semibold">{INFO.CompanyName}</Text>
      </Col>
      <Col span={12} className="!flex !justify-end">
        <></>
        {/* <Select
          defaultValue="en"
          suffixIcon={<GlobalOutlined />}
          options={[
            { value: "en", label: "English" },
            { value: "ur", label: "Urdu" },
          ]}
        /> */}
      </Col>
    </Row>
  );
}
