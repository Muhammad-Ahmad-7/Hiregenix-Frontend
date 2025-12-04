"use client";
import React from "react";
import sign_in from "../../../../public/main.png";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import LoginScreen from "@/component/pages/login/Login";

const Page: React.FC = () => {
  return (
    <SignInWrapper img={sign_in}>
      {/* <Left1 /> */}
      {/* <Left2 /> */}
      {/* <Left3 role="candidate"/> */}
      <LoginScreen />
    </SignInWrapper>
  );
};

export default Page;
