"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailApi } from "../api/auth.api";
import { storeToken } from "@/utils/token";
import { Spin, Result, Typography } from "antd";

const { Title, Text } = Typography;

export default function Page() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const token = searchParam.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmailApi(token);
        console.log("Response from verify:", res);

        if (res?.status === "Success") {
          storeToken(res.data.accessToken);
          setStatus("success");

          // Redirect after a short delay
          setTimeout(() => {
            router.push("/profile-completion/candidate");
          }, 1500);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <Spin size="large" />
          <Title level={4} className="mt-4 text-gray-700">
            Verifying your email...
          </Title>
          <Text type="secondary">Please wait a moment.</Text>
        </div>
      ) : status === "success" ? (
        <Result
          status="success"
          title="Email Verified Successfully!"
          subTitle="Redirecting to your dashboard..."
        />
      ) : (
        <Result
          status="error"
          title="Verification Failed"
          subTitle="The verification link may be invalid or expired."
        />
      )}
    </div>
  );
}
