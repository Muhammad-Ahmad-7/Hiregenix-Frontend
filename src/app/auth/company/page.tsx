"use client";
import React from "react";
import sign_in from "../../../../public/main.png";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import Left1 from "@/component/pages/login/Left1";
import Left2 from "@/component/pages/login/Left2";
import Left3 from "@/component/pages/login/Left3";

const Page: React.FC = () => {
  return (
    <SignInWrapper img={sign_in}>
      {/* <Left1 /> */}
      {/* <Left2 /> */}
      <Left3 />
    </SignInWrapper>
  );
};

export default Page;
