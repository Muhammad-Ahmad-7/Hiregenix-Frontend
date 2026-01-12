"use client";

import Step4Form from "@/component/forms/Step4Form";
import { Col, Typography, Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import CompanyStep1From from "./CompanyStep1From";
import CompanyStep2From from "./CompanyStep2From";
import CompanyStep3From from "./CompanyStep3From";
import { completeCompanyProfileApi } from "@/app/api/company/profile.api";
import { CompleteCompanyProfile } from "@/constants/Interfaces/Types/Profile.interface";

const { Title, Text } = Typography;

type CompanyProfile = CompleteCompanyProfile;

export default function CompanyStep1() {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    companyName: "",
    country: "",
    city: "",
    foundedYear: new Date().getFullYear(),
    ntnNumber: "",
    contactEmail: "",
    logoUrl: "https://example.com/uploads/onyx-logo.png",
    website: "",
    linkedInUrl: "",
    description: "",
    techStack: [],
    hiringStatus: "actively_hiring",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const next = (values?: Partial<CompanyProfile>) => {
    if (values) setCompanyProfile((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const back = () => setCurrentStep((prev) => prev - 1);

  const handleComplete = async () => {
    const finalProfile: CompleteCompanyProfile = {
      ...companyProfile,
    };
    setLoading(true);
    try {
      const res = await completeCompanyProfileApi(finalProfile);
      if (res?.status === "Success") {
        toast.success("Company profile completed successfully!");
        router.push("/company/profile");
      }
    } catch (error) {
      toast.error("Failed to complete company profile.");
      console.error("Error completing company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyStep1From
            onNext={next}
            initialValues={{
              companyName: companyProfile.companyName,
              country: companyProfile.country,
              city: companyProfile.city,
              foundedYear: companyProfile.foundedYear,
              ntnNumber: companyProfile.ntnNumber,
              contactEmail: companyProfile.contactEmail,
              logoUrl: companyProfile.logoUrl,
            }}
          />
        );
      case 2:
        return (
          <CompanyStep2From
            onNext={next}
            onBack={back}
            initialValues={{
              linkedInUrl: companyProfile.linkedInUrl,
              website: companyProfile.website,
            }}
          />
        );
      case 3:
        return (
          <CompanyStep3From
            onNext={next}
            onBack={back}
            initialValues={{
              techStack: companyProfile.techStack,
              description: companyProfile.description,
              hiringStatus: companyProfile.hiringStatus,
            }}
          />
        );
      case 4:
        return (
          <Step4Form
            onNext={handleComplete}
            onBack={back}
            initialValues={undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Col xs={24} md={12} className="p-4 lg:px-32 lg:py-16">
      <Text className="w-full !text-[#1677FF] font-semibold">
        STEP {currentStep} OF 4
      </Text>

      <div className="w-full shadow-none">
        <Title level={1} className="!mb-2">
          {currentStep === 1 && "Company Information"}
          {currentStep === 2 && "Business Details"}
          {currentStep === 3 && "Technical Stack & Description"}
          {currentStep === 4 && "Confirmation & Permissions"}
        </Title>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spin size="large" />
          </div>
        ) : (
          renderStep()
        )}
      </div>
    </Col>
  );
}
