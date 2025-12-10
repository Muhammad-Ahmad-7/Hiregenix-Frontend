"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Tag,
  Typography,
  Divider,
  Button,
  Space,
  Row,
  Col,
  Affix,
  Grid,
  message,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  GithubFilled,
  LinkedinFilled,
  GlobalOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import IconWrapper from "@/icons/IconWrapper";
// import { uploadResumeApi } from "@/app/api/candidate/profile.api";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import JobApplicationStats from "./JobApplicationStats";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface UserProfile {
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

export default function ProfileDashboard() {
  const {
    profile,
    //  loading
  } = useSelector((state: RootState) => state.user);
  const screens = useBreakpoint();
  // const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  // const [uploading, setUploading] = useState(false);
  const [userProfile, setProfile] = useState<UserProfile | null>(null);

  // Check if screen is large (lg breakpoint and above)
  const isLargeScreen = screens.lg;

  useEffect(() => {
    console.log(profile);
    // Set user profile from Redux state
    if (profile) {
      setProfile(profile as UserProfile);
    }
    // Check if profile already has a resume URL
    if (profile?.resumeUrl) {
      setResumeUrl(profile.resumeUrl);
    }
  }, [profile]);

  // const handleResumeUpload = async (file: File) => {
  //   setUploading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await uploadResumeApi(formData);
  //     console.log("API Response:", response);

  //     // Check if response exists and has the expected data structure
  //     if (response && response.data && response.data.resumeUrl) {
  //       setResumeUrl(response.data.resumeUrl);
  //       message.success("Resume uploaded successfully!");
  //     } else {
  //       // Handle case where API returns but without expected data
  //       message.error("Upload failed: Invalid response from server");
  //       console.error("Invalid response structure:", response);
  //     }
  //   } catch (err) {
  //     const errorMessage = "Failed to upload resume. Please try again.";

  //     message.error(errorMessage);
  //     console.error("Upload error:", err);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // const uploadProps = {
  //   beforeUpload: (file: File) => {
  //     const isPdf = file.type === "application/pdf";
  //     if (!isPdf) {
  //       message.error("You can only upload PDF files!");
  //       return false;
  //     }
  //     const isLt5M = file.size / 1024 / 1024 < 5;
  //     if (!isLt5M) {
  //       message.error("File must be smaller than 5MB!");
  //       return false;
  //     }
  //     handleResumeUpload(file);
  //     return false; // Prevent auto upload
  //   },
  //   showUploadList: false,
  // };

  // Helper function to get year from URL or return default
  const getYearFromUrl = () =>
  // url: string
  {
    // You can implement logic to extract year from URL or profile data
    return "2023";
  };

  const SidebarCard = (
    <Card className="rounded-xl">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar
              size={72}
              src={
                userProfile?.profilePictureUrl ||
                "https://api.dicebear.com/8.x/avataaars/svg?seed=default"
              }
            />
            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {userProfile?.fullName || "User Name"}
              </Title>
              <Text type="secondary">
                {userProfile?.tagline || "Professional"}
              </Text>
            </div>
          </div>

          <IconWrapper icon={<EditOutlined />} bgColorIcon="default" />
        </div>
        <Divider className=" !my-3" />
        <div className="flex justify-between items-center">
          <Text strong>Joined</Text>
          <Text>August 22, 2025</Text>
        </div>
        <div className="flex justify-between items-center">
          <Text strong>Location</Text>
          <Text>
            {userProfile?.city && userProfile?.country
              ? `${userProfile.city}, ${userProfile.country}`
              : "Not specified"}
          </Text>
        </div>
        <div className="flex justify-between items-center ">
          <Text strong className="!w-[35%]">
            Skills
          </Text>
          <Space wrap className="!flex justify-end ">
            {userProfile?.skills && userProfile.skills.length > 0 ? (
              userProfile.skills.map((skill, index) => (
                <Tag key={index} className="rounded-full">
                  {skill}
                </Tag>
              ))
            ) : (
              <Text type="secondary">No skills added</Text>
            )}
          </Space>
        </div>

        <div className="flex items-center gap-2 justify-between">
          <Button
            type="primary"
            icon={<VideoCameraOutlined />}
            className="!rounded-full font-semibold !w-full  px-5 mx-2 h-10 flex items-center"
          // onClick={onJoin}
          >
            Hire
          </Button>

          <div className="border rounded-full p-2 hover:bg-gray-100 cursor-pointer transition">
            <ClockCircleOutlined className="text-gray-700 text-lg" />
          </div>
        </div>

        <Text strong>Bio</Text>
        <Paragraph>{userProfile?.bio || "No bio available"}</Paragraph>

        <Divider className=" !my-3" />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Text strong>Links</Text>
            <IconWrapper icon={<PlusOutlined />} bgColorIcon="default" />
          </div>

          {userProfile?.githubUrl && (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <GithubFilled className="text-3xl" />
                <a
                  href={userProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <Text strong>GitHub</Text>
                </a>
              </div>
              <Text type="secondary">
                Since {getYearFromUrl(userProfile.githubUrl)}
              </Text>
            </div>
          )}

          {userProfile?.linkedinUrl && (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <LinkedinFilled className="text-3xl text-[#0A66C2]" />
                <a
                  href={userProfile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <Text strong>LinkedIn</Text>
                </a>
              </div>
              <Text type="secondary">
                Since {getYearFromUrl(userProfile.linkedinUrl)}
              </Text>
            </div>
          )}

          {userProfile?.portfolioUrl && (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <GlobalOutlined className="text-3xl" />
                <a
                  href={userProfile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <Text strong>Portfolio</Text>
                </a>
              </div>
              <Text type="secondary">Website</Text>
            </div>
          )}

          {!userProfile?.githubUrl &&
            !userProfile?.linkedinUrl &&
            !userProfile?.portfolioUrl && (
              <Text type="secondary">No links added</Text>
            )}
        </div>
      </Space>
    </Card>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Row gutter={[24, 24]}>
        {/* Left Sidebar */}
        <Col xs={24} md={24} lg={9}>
          {isLargeScreen ? (
            <div className="fixed">{SidebarCard}</div>
          ) : (
            SidebarCard
          )}
        </Col>

        {/* Right Main Section */}
        <Col xs={24} md={24} lg={15}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <JobApplicationStats />
          </Space>
        </Col>
      </Row>
    </div>
  );
}
