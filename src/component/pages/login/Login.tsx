"use client";

import React, { useState } from "react";
import { googleAuth, loginApi } from "@/app/api/auth.api"; // or signInApi if that’s correct
import UiButton from "@/component/common/CustomButton";
import EmailIcon from "@/icons/socials/EmailIcon";
import { EyeInvisibleOutlined, EyeTwoTone, GoogleCircleFilled } from "@ant-design/icons";
import { Button, Col, Input, Typography } from "antd";
import Link from "next/link";
import { storeToken } from "@/utils/token";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

const { Title, Text } = Typography;

export default function LoginScreen({ role }: { role: "company" | "candidate" }) {
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

      if (res && res.data && res.status == "Success") {
        console.log("first");
        storeToken(res.data.accessToken);
        const role = res.data.user.role;
        const isProfileCompleted = res.data.user.isProfileCompleted;
        toast.success(res.message || "Sign in successful!");
        setEmail("");
        setPassword("");
        if (role == "candidate") {
          handleRedirections({ isProfileCompleted, role });
        } else if (role == "company") {
          handleRedirections({ isProfileCompleted, role });
        }
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error(error);
      toast.error(error?.message || "Sign in failed");
    } finally {
      //   setEmail("");
      //   setPassword("");
      setLoading(false);
    }
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseGoogle = async (authResult: any) => {
    console.log("Auth Result", authResult)
    try {
      if (authResult['code']) {
        const res = await googleAuth(authResult.code, role); // or "company" based on your logic
        if (!res || res.status !== "Success") {
          toast.error('Something went wrong')
          return
        }
        if (!res.data) {
          toast.error('Invalid Google auth response')
          return
        }
        const { accessToken, user, new: _new } = res.data

        if (_new) {
          // handleSubscribe(user.email)
          await new Promise(resolve => setTimeout(resolve, 2000));
        }


        localStorage.setItem("token", accessToken)
        toast.success(`Welcome ${_new ? '' : "back"} ${user.role}!`)

        // router.push(`/dashboard/${user.role == "user" ? "user" : "admin"}`)
        if (user.role === "candidate") {
          router.push(`/candidate/dashboard`)
        } else {
          router.push(`/company/dashboard`)
        }
      } else {
        throw new Error('Invalid Google auth response')
      }
    } catch (e) {
      console.error('Error during Google Login:', e)
      toast.error('Google login failed')
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code',
  })

  return (
    <Col
      xs={24}
      md={12}
      className="flex flex-col justify-center items-center min-h-screen p-6 lg:p-12 overflow-y-auto"
    >
      {/* Logo */}
      <div className="flex w-full mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200">
          <EmailIcon />
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md">
        <Title level={1} className="!mb-1">
          Sign in with email
        </Title>
        <Text type="secondary">
          Let&apos;s get started with your job process
        </Text>

        {/* Inputs */}
        <div className="mt-6 flex flex-col gap-3">
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

          <div className="flex justify-end">
            <UiButton type="link" className="!p-0">
              Forgot Password?
            </UiButton>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-3 w-full">
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

          {/* Divider */}
          <div className="flex items-center w-full">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Google Button */}
          <Button
            icon={<GoogleCircleFilled />}
            onClick={() => googleLogin()}
            block
            size="large"
            type="default"
            className="!rounded-xl flex items-center justify-center border-gray-300 hover:!border-gray-400"
          >
            Continue with Google
          </Button>

          {/* Footer */}
          <div className="text-center mt-1">
            <Text>
              Don&apos;t have an account?{" "}
              <Link href={`/auth/sign-up?role=${role}`}>Sign Up</Link>
            </Text>
          </div>
        </div>
      </div>
    </Col>
  );
}
