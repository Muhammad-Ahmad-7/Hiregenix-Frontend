"use client";

import { Button, Select } from "antd";
import { FireOutlined, GlobalOutlined } from "@ant-design/icons";

export default function Page() {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-16">
        {/* Logo */}
        <div className="flex items-center mb-12">
          <FireOutlined className="text-2xl text-black mr-2" />
          <span className="text-lg font-semibold">RecruiterAI</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">
          Let’s get you what you are looking for
        </h1>
        <p className="text-gray-500 mb-8">
          Select your role for joining our platform
        </p>

        {/* Buttons */}
        <div className="space-y-4 max-w-sm">
          <Button
            block
            className="rounded-full h-12 text-base flex items-center justify-center"
          >
            Join as <span className="text-blue-600 ml-1">recruiter</span>
          </Button>
          <Button
            block
            className="rounded-full h-12 text-base flex items-center justify-center"
          >
            Join as <span className="text-blue-600 ml-1">candidate</span>
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 bg-blue-500 rounded-l-3xl relative">
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <Select
            defaultValue="en"
            suffixIcon={<GlobalOutlined />}
            options={[
              { value: "en", label: "English" },
              { value: "ur", label: "Urdu" },
            ]}
            className="w-28"
          />
        </div>
      </div>
    </div>
  );
}
