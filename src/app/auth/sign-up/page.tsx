"use client";
import React from "react";
import { Button, Space, Typography, Select } from "antd";
import {
  GoogleOutlined,
  LinkedinOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const Page = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign in form */}
      <div className="w-1/2 bg-white flex flex-col justify-center px-16">
        <div className="max-w-md">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">R</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">
                RecruiterAI
              </span>
            </div>

            <div className="absolute top-6 right-6">
              <Select
                defaultValue="en"
                size="small"
                suffixIcon={<GlobalOutlined />}
                style={{ width: 100 }}
              >
                <Option value="en">English</Option>
                <Option value="es">Español</Option>
                <Option value="fr">Français</Option>
              </Select>
            </div>
          </div>

          {/* Sign in content */}
          <div>
            <Title level={1} style={{ marginBottom: "0.5rem" }}>
              Sign IN
            </Title>
            <Text className="text-gray-500 text-base mb-8 block">
              Lets get started with your job process
            </Text>

            {/* Sign in buttons */}
            <Space direction="vertical" size="middle" className="w-full">
              <Button
                size="large"
                className="w-full h-12 flex items-center justify-center border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                icon={<GoogleOutlined className="text-red-500" />}
              >
                <span className="ml-2 text-gray-700 font-medium">Google</span>
              </Button>

              <Button
                size="large"
                className="w-full h-12 flex items-center justify-center border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                icon={<LinkedinOutlined className="text-blue-600" />}
              >
                <span className="ml-2 text-gray-700 font-medium">LinkedIn</span>
              </Button>

              <Button
                size="large"
                className="w-full h-12 flex items-center justify-center border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                icon={<MailOutlined className="text-gray-600" />}
              >
                <span className="ml-2 text-gray-700 font-medium">Email</span>
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Right side - Blue gradient */}
      <div className="w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        {/* You can add additional content here if needed */}
      </div>
    </div>
  );
};

export default Page;
