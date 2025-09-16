"use client";
import UiButton from "@/component/common/CustomButton";
import LabelInput from "@/component/common/LabelInput";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Col, Flex, Input, Row, Select, Typography } from "antd";
import Link from "next/link";
import React from "react";
const { Title, Text } = Typography;

export default function Step1() {
  return (
    <Col
      xs={24}
      md={12}
      className="!flex !flex-col !justify-center !items-center p-4 lg:p-32"
    >
      {/* Logo Circle */}
      <Text className="w-full !text-[#1677FF] font-semibold">STEP 1 OF 4</Text>

      {/* Text & Buttons */}
      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          Personal Information
        </Title>
        <div className="flex flex-col gap-5">
          <LabelInput
            label="Email Address"
            placeholder="Enter your email"
            required
          />
          <Row gutter={24}>
            <Col span={12}>
              <LabelInput
                label="Email Address"
                placeholder="Enter your email"
                required
              />
            </Col>
            <Col span={12}>
              <LabelInput
                label="Email Address"
                placeholder="Enter your email"
                required
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Search to Select"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={[
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
                ]}
              />
            </Col>
            <Col span={12}>
              <LabelInput
                label="Email Address"
                placeholder="Enter your email"
                required
              />
            </Col>
          </Row>
        </div>
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
          <Flex wrap>
            <UiButton type="primary" size="large">
              Primary
            </UiButton>
          </Flex>
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
