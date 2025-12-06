"use client";

import React, { useState } from "react";
import { signUpApi } from "@/app/api/auth.api"; // or signInApi if that’s correct
import UiButton from "@/component/common/CustomButton";
import EmailIcon from "@/icons/socials/EmailIcon";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Col, Input, Typography, message } from "antd";
import Link from "next/link";
import { AxiosError } from "axios";

const { Title, Text } = Typography;

export default function Left3({ role }: { role: "company" | "candidate" }) {
  const [email, setEmail] = useState("abdullahusman5630@gmail.com");
  const [password, setPassword] = useState("A123456@i");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signUpApi({
        email,
        password,
        role,
      });
      console.log(res);
      console.log("Response:", res);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error(error);
      message.error(error?.message || "Sign in failed");
    } finally {
      // setEmail("");
      // setPassword("");
      setLoading(false);
    }
  };

  return (
    <Col
      xs={24}
      md={12}
      className="!flex !flex-col !justify-center !items-center p-4 lg:p-32"
    >
      {/* Logo */}
      <div className="flex w-full">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 mb-4">
          <EmailIcon />
        </div>
      </div>

      {/* Form */}
      <div className="w-full">
        <Title level={1} className="!mb-2">
          Sign up with mail
        </Title>
        <Text type="secondary">
          Let’s get started with{" "}
          {role == "candidate" ? "candidate" : "company's recruiter"}
        </Text>

        <div className="mt-8 gap-2 flex flex-col">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!rounded-xl"
          />
          <Input.Password
            className="!rounded-xl"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <div className="w-full flex justify-end">
            <UiButton type="link">Forgot Password?</UiButton>
          </div>
        </div>

        <div className="mt-4 gap-2 flex flex-col items-center">
          <UiButton
            type="primary"
            onClick={handleSignIn}
            loading={loading}
            block
            size="large"
            className="!rounded-xl"
          >
            Sign Up
          </UiButton>
          <div className="flex justify-center mt-2">
            <Text className="font-normal">
              Already have an account? <Link href="/">Sign In</Link>
            </Text>
          </div>
        </div>
      </div>
    </Col>
  );
}
