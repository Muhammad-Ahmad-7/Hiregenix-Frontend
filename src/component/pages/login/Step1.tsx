"use client";

import { completeProfileApi } from "@/app/api/candidate/profile.api";
import Step1Form from "@/component/forms/Step1Form";
import Step2Form from "@/component/forms/Step2Form";
import Step3Form from "@/component/forms/Step3Form";
import Step4Form from "@/component/forms/Step4Form";
import { Col, Typography, Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

interface Profile {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  contactNumber: string;
  profilePictureUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: string[];
  bio: string;
  tagline: string;
}

export default function StepperForm() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    city: "",
    contactNumber: "",
    profilePictureUrl: "https://example.com/uploads/profile123.jpg",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    skills: [],
    bio: "",
    tagline: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const next = (values?: Partial<Profile>) => {
    console.log(values);
    if (values) setProfile((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const back = () => {
    if (currentStep === 2) {
      setProfile((prev) => ({ ...prev, dateOfBirth: "" }));
    }
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async (values: Partial<Profile>) => {
    console.log(profile);
    const finalProfile = { ...profile, ...values };
    setLoading(true);
    try {
      const res = await completeProfileApi(finalProfile);
      if (res.status === "Success") {
        router.push("/candidate/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Form onNext={next} initialValues={profile} />;
      case 2:
        return (
          <Step2Form onNext={next} onBack={back} initialValues={profile} />
        );
      case 3:
        return (
          <Step3Form onNext={next} onBack={back} initialValues={profile} />
        );
      case 4:
        return (
          <Step4Form
            onNext={handleComplete}
            onBack={back}
            initialValues={profile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Col xs={24} md={12} className="lg:px-16 lg:py-8 ">
      <Text className="w-full !text-[#1677FF] font-semibold">
        STEP {currentStep} OF 4
      </Text>

      <div className="w-full shadow-none ">
        <Title level={1} className="!mb-2">
          {currentStep === 1 && "Personal Information"}
          {currentStep === 2 && "Education Information"}
          {currentStep === 3 && "Expertise Description"}
          {currentStep === 4 && "Permissions Required"}
        </Title>

        {loading ? (
          <div className=" flex justify-center items-center h-48">
            <Spin size="large" />
          </div>
        ) : (
          renderStep()
        )}
      </div>
    </Col>
  );
}
