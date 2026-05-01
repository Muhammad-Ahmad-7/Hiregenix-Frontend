"use client";

import React, { useState } from "react";
import { forgetPassword, resetPassword } from "@/app/api/auth.api";
import UiButton from "@/component/common/CustomButton";
import EmailIcon from "@/icons/socials/EmailIcon";
import { EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined, MailOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { Col, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SignInWrapper from "@/component/pages/login/SignInWrapper";

const { Title, Text } = Typography;

// ─── Step 1: Forgot Password ────────────────────────────────────────────────

function ForgotPasswordStep({ onSuccess }: { onSuccess: () => void }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            const res = await forgetPassword(email.trim());

            if (res && res.status === "Success") {
                localStorage.setItem("reset_email", email.trim());
                toast.success(res.message || "OTP sent to your email!");
                onSuccess();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 mb-6">
                <MailOutlined className="text-blue-500 text-2xl" />
            </div>

            <Title level={1} className="!mb-1">
                Forgot Password?
            </Title>
            <Text type="secondary" className="text-base">
                No worries! Enter your email and we&apos;ll send you a reset OTP.
            </Text>

            <div className="mt-8 flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input
                    prefix={<MailOutlined className="text-gray-400 mr-1" />}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onPressEnter={handleSubmit}
                    size="large"
                    className="!rounded-xl"
                />
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <UiButton
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    block
                    size="large"
                    className="!rounded-xl"
                >
                    Send OTP
                </UiButton>

                <div className="text-center mt-2">
                    <Link
                        href="/auth"
                        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    >
                        <ArrowLeftOutlined className="text-xs" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Step 2: Reset Password ──────────────────────────────────────────────────

function ResetPasswordStep() {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const storedEmail = typeof window !== "undefined"
        ? localStorage.getItem("reset_email") ?? ""
        : "";

    const handleReset = async () => {
        if (!otp.trim()) {
            toast.error("Please enter the OTP");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await resetPassword({
                otp: otp.trim(),
                email: storedEmail,
                newPassword,
            });

            if (res && res.status === "Success") {
                toast.success(res.message || "Password reset successful!");
                localStorage.removeItem("reset_email");
                router.replace("/auth");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 border border-green-100 mb-6">
                <LockOutlined className="text-green-500 text-2xl" />
            </div>

            <Title level={1} className="!mb-1">
                Reset Password
            </Title>
            <Text type="secondary" className="text-base">
                Enter the OTP sent to{" "}
                <span className="font-medium text-gray-700">{storedEmail}</span> and
                choose a new password.
            </Text>

            <div className="mt-8 flex flex-col gap-4">
                {/* OTP */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">OTP Code</label>
                    <Input
                        prefix={<SafetyOutlined className="text-gray-400 mr-1" />}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        size="large"
                        className="!rounded-xl tracking-widest"
                    />
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400 mr-1" />}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        size="large"
                        className="!rounded-xl"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400 mr-1" />}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onPressEnter={handleReset}
                        size="large"
                        className="!rounded-xl"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <UiButton
                    type="primary"
                    onClick={handleReset}
                    loading={loading}
                    block
                    size="large"
                    className="!rounded-xl"
                >
                    Reset Password
                </UiButton>

                <div className="text-center mt-2">
                    <Link
                        href="/auth/sign-in"
                        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    >
                        <ArrowLeftOutlined className="text-xs" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ForgotPasswordScreen() {
    const [step, setStep] = useState<"forgot" | "reset">("forgot");

    return (
        <SignInWrapper>
            <Col
                xs={24}
                md={12}
                className="auth-panel flex flex-col justify-center items-center min-h-screen p-6 lg:p-12 overflow-y-auto"
            >
                {/* Logo */}
                <div className="flex w-full mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200">
                        <EmailIcon />
                    </div>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 w-full max-w-md mb-8">
                    <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all ${step === "forgot"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                            }`}
                    >
                        {step === "reset" ? "✓" : "1"}
                    </div>
                    <div
                        className={`flex-1 h-px transition-all ${step === "reset" ? "bg-green-400" : "bg-gray-200"
                            }`}
                    />
                    <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all ${step === "reset"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-400"
                            }`}
                    >
                        2
                    </div>
                    <div className="ml-2 text-xs text-gray-400">
                        {step === "forgot" ? "Verify email" : "Set new password"}
                    </div>
                </div>

                {/* Active Step */}
                {step === "forgot" ? (
                    <ForgotPasswordStep onSuccess={() => setStep("reset")} />
                ) : (
                    <ResetPasswordStep />
                )}
            </Col>
        </SignInWrapper>
    );
}