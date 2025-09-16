import UiButton from "@/component/common/CustomButton";
import { ROUTES } from "@/constants/routes";
import EmailIcon from "@/icons/socials/EmailIcon";
import GoogleIcon from "@/icons/socials/GoogleIcon";
import LinkdinIcon from "@/icons/socials/LinkdinIcon";
import { Col, Typography } from "antd";
import React from "react";
const { Text, Title } = Typography;
export default function Left2() {
  return (
    <Col
      xs={24}
      md={12}
      className="!flex !flex-col !justify-center !items-center p-4 lg:p-32"
    >
      {/* Text & Buttons */}
      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          Sign in
        </Title>

        <Text type="secondary">Lets get started with your job process</Text>

        <div className="mt-8 gap-2 flex flex-col">
          <UiButton
            icon={<GoogleIcon />}
            href={ROUTES.company}
            block
            size="large"
            className="!rounded-full !font-semibold"
          >
            Google
          </UiButton>
          <UiButton
            icon={<LinkdinIcon />}
            href={ROUTES.candidate}
            block
            size="large"
            className="!rounded-full !font-semibold"
          >
            Linkdin
          </UiButton>
          <UiButton
            icon={<EmailIcon />}
            href={ROUTES.candidate}
            block
            size="large"
            className="!rounded-full !font-semibold"
          >
            Email
          </UiButton>
        </div>
      </div>
    </Col>
  );
}
