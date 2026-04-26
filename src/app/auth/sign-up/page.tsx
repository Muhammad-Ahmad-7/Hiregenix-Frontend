"use client";
import React, { Suspense } from "react";
import sign_in from "../../../../public/main.png";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import Left3 from "@/component/pages/login/Left3";
import { useSearchParams } from "next/navigation";

// 1. Create a sub-component for the search logic
const SignUpContent = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as "company" | "candidate";

  return <Left3 role={role} />;
};

// 2. The main page just handles the layout and Suspense
const Page: React.FC = () => {
  return (
    <SignInWrapper img={sign_in}>
      <Suspense fallback={<div className="p-10">Loading profile configuration...</div>}>
        <SignUpContent />
      </Suspense>
    </SignInWrapper>
  );
};

export default Page;