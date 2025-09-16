"use client";
import Left2 from "@/component/pages/login/Left2";
import Left3 from "@/component/pages/login/Left3";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import Step1 from "@/component/pages/login/Step1";
import React from "react";

export default function page() {
  return (
    <SignInWrapper>
      {/* <Left2 /> */}
      {/* <Left3 /> */}
      <Step1 />
    </SignInWrapper>
  );
}
