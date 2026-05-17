"use client";
import React from "react";
import company_dashboard from "../../../../public/dashboard-company.svg";
import candidate_dashboard from "../../../../public/dashboard-candidate.svg";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import LoginScreen from "@/component/pages/login/Login";

const Page: React.FC = () => {
  return (
    <SignInWrapper img={company_dashboard} secondaryImg={candidate_dashboard}>
      {/* <Left1 /> */}
      {/* <Left2 /> */}
      {/* <Left3 role="company" /> */}
      <LoginScreen role="company" />
    </SignInWrapper>
  );
};

export default Page;
