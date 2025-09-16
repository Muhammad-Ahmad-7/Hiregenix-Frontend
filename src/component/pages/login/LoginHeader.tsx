import { INFO } from "@/constants/info";
import { GlobalOutlined } from "@ant-design/icons";
import { Col, Image, Row, Select, Typography } from "antd";
import React from "react";

const { Title, Text } = Typography;
export default function LoginHeader() {
  return (
    <Row className="h-20 px-6 flex items-center bg-white">
      <Col span={12} className="!flex items-center gap-2">
        <Image width={36} height={36} src={"/logo/logo.png"} alt="Logo" />
        <Text className="font-semibold">HIREGENX</Text>
      </Col>
      <Col span={12} className="!flex !justify-end">
        <Select
          defaultValue="en"
          suffixIcon={<GlobalOutlined />}
          options={[
            { value: "en", label: "English" },
            { value: "ur", label: "Urdu" },
          ]}
        />
      </Col>
    </Row>
  );
}
