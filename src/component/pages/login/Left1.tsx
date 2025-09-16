import UiButton from "@/component/common/CustomButton";
import { ROUTES } from "@/constants/routes";
import Fire from "@/icons/Fire";
import { Button, Col, Typography } from "antd";
import Link from "next/link";
import React from "react";
const { Text, Title } = Typography;
export default function Left1() {
  return (
    <Col
      xs={24}
      md={12}
      className="!flex !flex-col !justify-center !items-center p-4 lg:p-32"
    >
      {/* Logo Circle */}
      <div className="flex w-full">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border border-gray-200 mb-4">
          <Fire />
        </div>
      </div>

      {/* Text & Buttons */}
      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          Let’s get you what you are looking for
        </Title>

        <Text type="secondary">Select your role for joining our platform</Text>

        <div className="mt-8 gap-2 flex flex-col">
          <UiButton
            href={ROUTES.company}
            block
            size="large"
            className="!rounded-full"
          >
            Join as recruiter
          </UiButton>
          <UiButton
            href={ROUTES.candidate}
            block
            size="large"
            className="!rounded-full"
          >
            Join as candidate
          </UiButton>
        </div>
      </div>
    </Col>
  );
}
