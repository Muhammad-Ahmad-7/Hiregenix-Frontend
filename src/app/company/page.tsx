"use client";
import CompanyStep1 from "@/component/pages/company/profileComplition/CompanyStep1";

import SignInWrapper from "@/component/pages/login/SignInWrapper";
import React from "react";

export default function page() {
  return (
    <SignInWrapper>
      <CompanyStep1 />
    </SignInWrapper>
  );
}
