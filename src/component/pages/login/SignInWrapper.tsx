import { ROUTES } from "@/constants/routes";
import { Button, Col, Row, Typography } from "antd";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import LoginHeader from "./LoginHeader";
import Fire from "@/icons/Fire";

import sign_in from "../../../../public/main.png";
import Left1 from "./Left1";
const { Title, Text } = Typography;

export default function SignInWrapper({
  children,
  img,
}: {
  children: React.ReactNode;
  img: StaticImageData | string;
}) {
  const childArray = React.Children.toArray(children);
  return (
    <div className="bg-white">
      <div className="px-4 bg-white h-screen max-w-[1500px] mx-auto">
        {/* Header */}

        <LoginHeader />

        {/* Content Section */}
        <Row className="bg-white h-[calc(100vh-5rem)]">
          {/* Left Section */}
          {/* <Left1 /> */}
          {childArray[0]}
          {/* Right Section */}
          <Col
            xs={0}
            md={12}
            className="!flex !justify-center !items-center rounded-4xl"
          >
            <Image
              width={550}
              height={500}
              src={img}
              alt="sign in"
              className="rounded-4xl"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
