import { Col, Row } from "antd";
import Image, { StaticImageData } from "next/image";
import React from "react";
import LoginHeader from "./LoginHeader";

import company_dashboard from "../../../../public/dashboard-company.svg";
import candidate_dashboard from "../../../../public/dashboard-candidate.svg";

export default function SignInWrapper({
  children,
  img = company_dashboard,
  secondaryImg = candidate_dashboard,
}: {
  children: React.ReactNode;
  img?: StaticImageData | string;
  secondaryImg?: StaticImageData | string;
}) {
  const childArray = React.Children.toArray(children);
  return (
    <div className="auth-page">
      <div className="auth-shell px-4 h-screen max-w-[1500px] mx-auto">
        {/* Header */}

        <LoginHeader />

        {/* Content Section */}
        <Row className="auth-content h-[calc(100vh-5rem)]">
          {/* Left Section */}
          {/* <Left1 /> */}
          {childArray[0]}
          {/* Right Section */}
          <Col
            xs={0}
            md={12}
            className="auth-image-panel !flex !justify-center !items-center rounded-4xl"
          >
            <div className="auth-image-stack">
              <Image
                width={520}
                height={360}
                src={img}
                alt="company dashboard"
                className="auth-image-card auth-image-primary"
              />
              <Image
                width={480}
                height={320}
                src={secondaryImg}
                alt="candidate dashboard"
                className="auth-image-card auth-image-secondary"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
