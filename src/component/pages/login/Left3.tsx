import UiButton from "@/component/common/CustomButton";
import EmailIcon from "@/icons/socials/EmailIcon";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Col, Input, Select, Typography } from "antd";
import Link from "next/link";
import React from "react";
const { Title, Text } = Typography;
export default function Left3() {
  return (
    <Col
      xs={24}
      md={12}
      className="!flex !flex-col !justify-center !items-center p-4 lg:p-32"
    >
      {/* Logo Circle */}
      <div className="flex w-full">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 mb-4">
          <EmailIcon />
        </div>
      </div>

      {/* Text & Buttons */}
      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          Sign in with mail
        </Title>

        <Text type="secondary">Lets get started with your job process</Text>
        <div className="mt-8 gap-2 flex flex-col">
          <Input placeholder="Email" className="!rounded-xl" />
          <Input.Password
            className="!rounded-xl"
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <div className="w-full flex justify-end">
            <UiButton type="link">Forget Password</UiButton>
          </div>
        </div>
        <div className="mt-4 gap-2 flex flex-col item-center">
          <UiButton
            type="primary"
            onClick={() => {}}
            block
            size="large"
            className="!rounded-xl"
          >
            Sign In
          </UiButton>
          <div className="flex justify-center mt-2">
            <Text className="!mb-0 inline-block font-normal">
              Don have an account ? <Link href={"/"}>Sign Up</Link>
            </Text>
          </div>
        </div>
      </div>
    </Col>
  );
}
