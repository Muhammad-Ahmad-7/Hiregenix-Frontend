"use client";

import Step1Form from "@/component/forms/Step1Form";
import Step2Form from "@/component/forms/Step2Form";
import Step3Form from "@/component/forms/Step3Form";
import Step4Form from "@/component/forms/Step4Form";
import { Col, Typography } from "antd";
import React, { useState } from "react";

const { Title, Text } = Typography;

export default function StepperForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const next = () => setCurrentStep((prev) => prev + 1);
  const back = () => setCurrentStep((prev) => prev - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Form onNext={next} />;
      case 2:
        return <Step2Form onNext={next} onBack={back} />;

      case 3:
        return <Step3Form onNext={next} onBack={back} />;

      case 4:
        return <Step4Form onNext={next} onBack={back} />;
      default:
        return null;
    }
  };

  return (
    <Col xs={24} md={12} className="p-4 lg:px-32 lg:py-16">
      {/* Step indicator */}
      <Text className="w-full !text-[#1677FF] font-semibold">
        STEP {currentStep} OF 4
      </Text>

      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          {currentStep === 1 && "Personal Information"}
          {currentStep === 2 && "Education Information"}
          {currentStep === 3 && "Expertise Description"}
          {currentStep === 4 && "Permissions Required"}
        </Title>

        {renderStep()}
      </div>
    </Col>
  );
}
