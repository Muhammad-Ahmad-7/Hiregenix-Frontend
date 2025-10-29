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
  List,
  Row,
  Col,
  Timeline,
  Affix,
  Grid,
  Upload,
  message,
} from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  GithubFilled,
  LinkedinFilled,
  PaperClipOutlined,
  UploadOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import IconWrapper from "@/icons/IconWrapper";
import { signUpApi } from "@/app/api/auth.api";
import UiButton from "@/component/common/CustomButton";
import {
  candidateProfileApi,
  uploadResumeApi,
} from "@/app/api/candidate/profile.api";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import ResumeUploader from "@/component/pages/candidate/profile/ResumeUploader";

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

const skills = [
  "Front-end developer",
  "Backend",
  "Node.js",
  "Threads",
  "Mobile App Development",
];

const experiences = [
  {
    title: "Product Engineer",
    company: "Google Labs",
    date: "Mar 2023 – Aug 2023",
    description:
      "Designed and developed a fully responsive web application using React.js for the front end and Node.js/Express.js for the back end. Integrated REST APIs and implemented MongoDB for data management. Focused on optimizing performance and delivering a smooth user experience.",
  },
  {
    title: "Product Engineer",
    company: "Google Labs",
    date: "Mar 2023 – Aug 2023",
    description:
      "Designed and developed a fully responsive web application using React.js for the front end and Node.js/Express.js for the back end. Integrated REST APIs and implemented MongoDB for data management. Focused on optimizing performance and delivering a smooth user experience.",
  },
];

export default function ProfileDashboard() {
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const screens = useBreakpoint();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Check if screen is large (lg breakpoint and above)
  const isLargeScreen = screens.lg;

  useEffect(() => {
    console.log(profile);
    // Set user profile from Redux state
    if (profile) {
      setUserProfile(profile as UserProfile);
    }
    // Check if profile already has a resume URL
    if (profile?.resumeUrl) {
      setResumeUrl(profile.resumeUrl);
    }
  }, [profile]);

  const handleResumeUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadResumeApi(formData);
      console.log("API Response:", response);

      // Check if response exists and has the expected data structure
      if (response && response.data && response.data.resumeUrl) {
        setResumeUrl(response.data.resumeUrl);
        message.success("Resume uploaded successfully!");
      } else {
        // Handle case where API returns but without expected data
        message.error("Upload failed: Invalid response from server");
        console.error("Invalid response structure:", response);
      }
    } catch (error: any) {
      // Better error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload resume. Please try again.";
      message.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error("You can only upload PDF files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return false;
      }
      handleResumeUpload(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  // Helper function to get year from URL or return default
  const getYearFromUrl = (url: string) => {
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

        <Divider className=" !my-3" />

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
            <Affix offsetTop={80}>{SidebarCard}</Affix>
          ) : (
            SidebarCard
          )}
        </Col>

        {/* Right Main Section */}
        <Col xs={24} md={24} lg={15}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* Resume Upload/Display Card */}
            <Card className="rounded-xl">
              <div className="flex justify-between items-center">
                <div className="">
                  {resumeUrl ? (
                    <>
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Resume Uploaded Successfully
                        </Title>
                      </div>
                      <Text type="secondary">
                        Your resume has been received and is ready for review.
                      </Text>
                      <div className="!mt-4 gap-2 flex items-center">
                        <PaperClipOutlined />
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="!text-[#52C41A] hover:!text-[#73D13D]"
                        >
                          {userProfile?.fullName
                            ? `${userProfile.fullName.replace(
                                /\s+/g,
                                ""
                              )}Resume.pdf`
                            : "Resume.pdf"}
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Upload Your Resume
                        </Title>
                      </div>
                      <Text type="secondary">
                        Upload your resume in PDF format to complete your
                        profile.
                      </Text>
                      <div className="!mt-4">
                        <Upload {...uploadProps}>
                          <Button
                            icon={<UploadOutlined />}
                            loading={uploading}
                            type="primary"
                          >
                            {uploading ? "Uploading..." : "Upload Resume"}
                          </Button>
                        </Upload>
                      </div>
                    </>
                  )}
                </div>
                {resumeUrl && (
                  <Upload {...uploadProps}>
                    <IconWrapper
                      icon={<EditOutlined />}
                      bgColorIcon="default"
                    />
                  </Upload>
                )}
              </div>
            </Card>

            {/* Experience Section */}
            <Card
              title={<Title level={5}>Experience</Title>}
              className="rounded-xl shadow-md"
            >
              <Timeline mode="left">
                {experiences.map((item, index) => (
                  <Timeline.Item key={index}>
                    <div className="mb-6" color="gray">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text strong className="text-lg">
                            {item.title} — {item.company}
                          </Text>
                          <div>
                            <Text type="secondary">{item.date}</Text>
                          </div>
                        </div>
                      </div>

                      <Paragraph className="mt-2 mb-3">
                        {item.description}
                      </Paragraph>

                      <Space wrap>
                        {skills.slice(0, 5).map((skill, i) => (
                          <Tag
                            key={i}
                            color="blue"
                            className="rounded-full text-sm font-medium"
                          >
                            {skill}
                          </Tag>
                        ))}
                        {skills.length > 5 && (
                          <Tag className="rounded-full text-sm font-medium">
                            +{skills.length - 5}
                          </Tag>
                        )}
                      </Space>

                      {index !== experiences.length - 1 && (
                        <Divider className="!my-4 border-gray-200" />
                      )}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>

              <div className="text-center mt-4">
                <Button type="default">Load More</Button>
              </div>
            </Card>

            {/* Certifications */}
            <Card
              title={<Title level={5}>Certifications</Title>}
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Paragraph>
                <Text strong>Product Engineer</Text> — Google Labs (Mar 2023 –
                Aug 2023)
              </Paragraph>
              <Paragraph>
                Designed and developed a fully responsive web application using
                React.js and Node.js/Express.js for backend.
              </Paragraph>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
