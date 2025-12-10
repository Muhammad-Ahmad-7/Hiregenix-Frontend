"use client";

import React, { useState } from "react";
import { loginApi } from "@/app/api/auth.api"; // or signInApi if that’s correct
import UiButton from "@/component/common/CustomButton";
import EmailIcon from "@/icons/socials/EmailIcon";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Col, Input, Typography, message } from "antd";
import Link from "next/link";
import { storeToken } from "@/utils/token";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const { Title, Text } = Typography;

export default function LoginScreen() {
  const [email, setEmail] = useState("abdullahusman5630@gmail.com");
  const [password, setPassword] = useState("A123456@i");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleRedirections = ({
    isProfileCompleted,
    role,
  }: {
    isProfileCompleted: boolean;
    role: "candidate" | "company";
  }) => {
    if (isProfileCompleted) {
      router.replace(`${role}/dashboard`);
    } else {
      router.replace(`/profile-completion/${role}`);
    }
  };
  const handleSignIn = async () => {
    try {
      setLoading(true);

      const res = await loginApi({
        email,
        password,
      });
      console.log(res);
      console.log("Response:", res);
      if (res.status == "Success") {
        console.log("first");
        storeToken(res.data.accessToken);
        const role = res.data.user.role;
        const isProfileCompleted = res.data.user.isProfileCompleted;
        if (role == "candidate") {
          handleRedirections({ isProfileCompleted, role });
        } else if (role == "company") {
          handleRedirections({ isProfileCompleted, role });
        }
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error(error);
      message.error(error?.message || "Sign in failed");
    } finally {
      //   setEmail("");
      //   setPassword("");
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
          Sign in with mail
        </Title>
        <Text type="secondary">Let’s get started with your job process</Text>

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
            Sign In
          </UiButton>
          <div className="flex justify-center mt-2">
            <Text className="font-normal">
              Don’t have an account? <Link href="/auth/sign-up">Sign Up</Link>
            </Text>
          </div>
        </div>
      </div>
    </Col>
  );
}
