"use client";
import React from "react";
import sign_in from "../../../../public/main.png";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import Left1 from "@/component/pages/login/Left1";

const Page: React.FC = () => {
  return (
    <SignInWrapper img={sign_in}>
      <Left1 />
      {/* <Left2 /> */}
      {/* <Left3 /> */}
      {/* <LoginScreen /> */}
    </SignInWrapper>
  );
};

export default Page;
