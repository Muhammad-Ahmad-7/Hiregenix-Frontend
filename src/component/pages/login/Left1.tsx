import UiButton from "@/component/common/CustomButton";
import { ROUTES } from "@/constants/routes";
import Fire from "@/icons/Fire";
import { Col, Typography } from "antd";
import React from "react";

const { Text, Title } = Typography;

export default function Left1() {
  return (
    <Col
      xs={24}
      md={12}
      className="auth-panel flex flex-col justify-center items-center min-h-screen p-6 lg:p-12 overflow-y-auto"
    >
      {/* Logo */}
      <div className="flex w-full mb-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg border border-gray-200">
          <Fire />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        <Title level={1} className="!mb-1">
          Let&apos;s get you what you are looking for
        </Title>

        <Text type="secondary">
          Select your role for joining our platform
        </Text>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
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