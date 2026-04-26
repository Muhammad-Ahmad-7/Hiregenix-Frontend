"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailApi } from "../api/auth.api";
import { storeToken } from "@/utils/token";
import { Spin, Result, Typography } from "antd";
const { Text, Title } = Typography;
export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

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

        console.log("Verification response:", res);

        if (res?.status === "Success" && res.data?.accessToken) {
          storeToken(res.data.accessToken);
          setStatus("success");

          if (res.data.role === "candidate") {
            router.push("/candidate/dashboard");
          } else if (res.data.role === "company"
          ) {
            router.push("/company/dashboard");
          }
        } else {
          setStatus("error");
        }
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
