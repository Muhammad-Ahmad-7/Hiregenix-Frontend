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
  Timeline,
  Affix,
  Grid,
  Upload,
  message,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import {
  EditOutlined,
  GithubFilled,
  LinkedinFilled,
  PaperClipOutlined,
  UploadOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getResumeDataApi,
  updateProfileApi,
  uploadResumeApi,
} from "@/app/api/candidate/profile.api";
import { setProfile } from "@/redux/slices/userSlice";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

interface ResumeExperience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface ResumeEducation {
  _id: string;
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}

interface ResumeProject {
  _id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string | null;
}

interface ResumeCertification {
  name: string;
  issuer: string;
  date?: string;
}

interface ResumeParsedData {
  portfolio: string | null;
  summary: string | null;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
}

interface ResumeData {
  parsedData: ResumeParsedData;
  fileUrl: string;
  aiScore: number;
  aiSuggestions: string[];
}

interface UserProfile {
  fullName: string;
  profilePictureUrl: string;
  tagline: string;
  city: string;
  country: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeUrl?: string;
}

export default function ProfileDashboard() {
  const screens = useBreakpoint();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { profile } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    profilePictureUrl:
      "https://api.dicebear.com/8.x/avataaars/svg?seed=Muhammad",
    tagline: "Full Stack Developer | AI Enthusiast",
    city: "Lahore",
    country: "Pakistan",
    bio: "Passionate about building innovative solutions with modern technologies. Experienced in full-stack development and machine learning.",
    githubUrl: "https://github.com/tahaxd77",
    linkedinUrl: "https://www.linkedin.com/in/muhammad-taha-ayaz",
    portfolioUrl: "",
  });

  const isLargeScreen = screens.lg;

  const mapApiResumeToState = (apiResume: any): ResumeData => {
    const parsed = apiResume.parsedData || {};

    return {
      parsedData: {
        portfolio: parsed.portfolio ?? null,
        summary: parsed.summary ?? null,
        name: parsed.name ?? "",
        email: parsed.email ?? "",
        phone: parsed.phone ?? "",
        linkedin: parsed.linkedin ?? "",
        github: parsed.github ?? "",
        skills: parsed.skills ?? [],
        experience: parsed.experience ?? [],
        education: parsed.education ?? [],
        projects: parsed.projects ?? [],
        certifications: parsed.certifications ?? [],
      },
      fileUrl: apiResume.fileUrl ?? "",
      aiScore: apiResume.aiScore ?? 0,
      aiSuggestions: apiResume.aiSuggestions ?? [],
    };
  };

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);

        const response = await getResumeDataApi();
        const apiResume = response?.data?.resume;

        if (!apiResume) {
          setResumeData(null);
          setResumeUrl(null);
          return;
        }

        const mapped = mapApiResumeToState(apiResume);

        setResumeData(mapped);
        setResumeUrl(mapped.fileUrl);

        if (mapped.parsedData) {
          setUserProfile((prev) => ({
            ...prev,
            fullName: mapped.parsedData.name || prev.fullName,
            githubUrl: mapped.parsedData.github || prev.githubUrl,
            linkedinUrl: mapped.parsedData.linkedin || prev.linkedinUrl,
            portfolioUrl: mapped.parsedData.portfolio || prev.portfolioUrl,
          }));
        }
      } catch (error) {
        message.error("Failed to load resume data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  const handleResumeUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadResumeApi(formData);
      const apiResume = response?.data?.resume;

      if (apiResume) {
        const mapped = mapApiResumeToState(apiResume);
        setResumeData(mapped);
        setResumeUrl(mapped.fileUrl);

        if (mapped.parsedData) {
          setUserProfile((prev) => ({
            ...prev,
            fullName: mapped.parsedData.name || prev.fullName,
            githubUrl: mapped.parsedData.github || prev.githubUrl,
            linkedinUrl: mapped.parsedData.linkedin || prev.linkedinUrl,
            portfolioUrl: mapped.parsedData.portfolio || prev.portfolioUrl,
          }));
        }
      }

      message.success("Resume uploaded successfully!");
    } catch (error: unknown) {
      message.error("Failed to upload resume");
      console.error(error);
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
      return false;
    },
    showUploadList: false,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const handleEditClick = () => {
    form.setFieldsValue({
      fullName: profile?.fullName || resumeData?.parsedData.name || "",
      tagline: profile?.tagline || "",
      email: profile?.userId?.email || resumeData?.parsedData.email || "",
      phone: profile?.contactNumber || resumeData?.parsedData.phone || "",
      city: profile?.city || "",
      country: profile?.country || "",
      bio: profile?.bio || "",
      githubUrl: profile?.githubUrl || resumeData?.parsedData.github || "",
      linkedinUrl:
        profile?.linkedinUrl || resumeData?.parsedData.linkedin || "",
      portfolioUrl:
        profile?.portfolioUrl || resumeData?.parsedData.portfolio || "",
      skills: profile?.skills || resumeData?.parsedData.skills || [],
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (values: any) => {
    try {
      // Update Redux state locally
      dispatch(setProfile(values));

      // Update backend
      await updateProfileApi(values);

      // Update local UI state
      setUserProfile((prev) => ({
        ...prev,
        ...values,
      }));

      message.success("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Failed to update profile");
      console.error(error);
    } finally {
    }
  };

  // Build skill options from existing skills (Option A)
  const skillOptions =
    (profile?.skills || resumeData?.parsedData.skills || []).map(
      (s: string) => ({
        label: s,
        value: s,
      })
    ) || [];

  const SidebarCard = (
    <Card className="rounded-xl">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar
              size={72}
              src={
                profile?.profilePictureUrl ||
                "https://api.dicebear.com/8.x/avataaars/svg?seed=user"
              }
            />

            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {profile?.fullName || resumeData?.parsedData.name || "No Name"}
              </Title>
              <Text type="secondary">
                {profile?.tagline || "No tagline available"}
              </Text>
            </div>
          </div>

          <EditOutlined
            className="cursor-pointer text-lg hover:text-blue-500 transition-colors"
            onClick={handleEditClick}
          />
        </div>

        <Divider className="!my-3" />

        {/* Email */}
        <div className="flex justify-between items-center">
          <Text strong>Email</Text>
          <Text>
            {profile?.userId?.email ||
              resumeData?.parsedData.email ||
              "Not specified"}
          </Text>
        </div>

        {/* Phone */}
        <div className="flex justify-between items-center">
          <Text strong>Phone</Text>
          <Text>
            {profile?.contactNumber ||
              resumeData?.parsedData.phone ||
              "Not specified"}
          </Text>
        </div>

        {/* Location */}
        <div className="flex justify-between items-center">
          <Text strong>Location</Text>
          <Text>
            {profile?.city && profile?.country
              ? `${profile.city}, ${profile.country}`
              : "Not specified"}
          </Text>
        </div>

        {/* Skills */}
        <div className="flex justify-between items-start">
          <Text strong className="!w-[35%]">
            Skills
          </Text>

          <Space wrap className="!flex justify-end">
            {(profile?.skills || resumeData?.parsedData.skills || [])
              .slice(0, 8)
              .map((skill: string, index: number) => (
                <Tag key={index} className="rounded-full" color="blue">
                  {skill}
                </Tag>
              ))}

            {(profile?.skills?.length ||
              resumeData?.parsedData.skills?.length ||
              0) > 8 && (
              <Tag className="rounded-full">
                +
                {Math.max(
                  resumeData?.parsedData.skills?.length || 0,
                  profile?.skills?.length || 0
                ) - 8}
              </Tag>
            )}
          </Space>
        </div>

        <Divider className="!my-3" />

        {/* Bio */}
        <Text strong>Bio</Text>
        <Paragraph>{profile?.bio || "No bio available"}</Paragraph>

        <Divider className="!my-3" />

        {/* Links */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Text strong>Links</Text>
            <></>
          </div>

          {(() => {
            const githubUrl =
              profile?.githubUrl || resumeData?.parsedData.github;
            const linkedinUrl =
              profile?.linkedinUrl || resumeData?.parsedData.linkedin;
            const portfolioUrl =
              profile?.portfolioUrl || resumeData?.parsedData.portfolio;

            return (
              <>
                {githubUrl && (
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <GithubFilled className="text-3xl" />
                      <a href={githubUrl} target="_blank" rel="noreferrer">
                        <Text strong>GitHub</Text>
                      </a>
                    </div>
                  </div>
                )}

                {linkedinUrl && (
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <LinkedinFilled className="text-3xl text-[#0A66C2]" />
                      <a href={linkedinUrl} target="_blank" rel="noreferrer">
                        <Text strong>LinkedIn</Text>
                      </a>
                    </div>
                  </div>
                )}

                {portfolioUrl && (
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <GlobalOutlined className="text-3xl" />
                      <a href={portfolioUrl} target="_blank" rel="noreferrer">
                        <Text strong>Portfolio</Text>
                      </a>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </Space>
    </Card>
  );

  if (loading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24} lg={9}>
          {isLargeScreen ? (
            <Affix offsetTop={80}>{SidebarCard}</Affix>
          ) : (
            SidebarCard
          )}
        </Col>

        <Col xs={24} md={24} lg={15}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* AI Score Card */}
            {resumeData && (
              <Card
                className="rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <Title level={5} style={{ color: "white", margin: 0 }}>
                        AI Resume Score
                      </Title>
                      <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                        Your resume has been analyzed by AI
                      </Text>
                    </div>
                    <div className="text-right">
                      <Title level={2} style={{ color: "white", margin: 0 }}>
                        {resumeData.aiScore}/100
                      </Title>
                      <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                        Score
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Resume Upload Card */}
            <Card className="rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  {resumeUrl ? (
                    <>
                      <Title level={5} style={{ margin: 0 }}>
                        <CheckCircleOutlined
                          style={{ color: "#52c41a", marginRight: 8 }}
                        />
                        Resume Uploaded Successfully
                      </Title>
                      <Text type="secondary">
                        Your resume has been received and analyzed.
                      </Text>
                      <div className="!mt-4 gap-2 flex items-center">
                        <PaperClipOutlined />
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="!text-[#52C41A] hover:!text-[#73D13D]"
                        >
                          {(
                            profile?.fullName ||
                            userProfile.fullName ||
                            "Resume"
                          ).replace(/\s+/g, "")}
                          Resume.pdf
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <Title level={5} style={{ margin: 0 }}>
                        Upload Your Resume
                      </Title>
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
                    <EditOutlined className="cursor-pointer text-lg" />
                  </Upload>
                )}
              </div>
            </Card>

            {/* AI Suggestions */}
            {resumeData?.aiSuggestions &&
              resumeData.aiSuggestions.length > 0 && (
                <Card
                  title={<Title level={5}>AI Suggestions</Title>}
                  className="rounded-xl"
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {resumeData.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex gap-2">
                        <Text type="secondary">{index + 1}.</Text>
                        <Text>{suggestion}</Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              )}

            {/* Experience Section */}
            <Card
              title={<Title level={5}>Experience</Title>}
              className="rounded-xl"
            >
              {resumeData?.parsedData.experience &&
              resumeData.parsedData.experience.length > 0 ? (
                <Timeline>
                  {resumeData.parsedData.experience.map((exp) => (
                    <Timeline.Item key={exp._id}>
                      <div className="mb-4">
                        <Text strong className="text-lg">
                          {exp.position}
                        </Text>
                        <div>
                          <Text type="secondary">
                            {exp.company} • {formatDate(exp.startDate)}
                          </Text>
                        </div>
                        <Paragraph
                          className="mt-2"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {exp.description}
                        </Paragraph>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Empty description="No experience data available" />
              )}
            </Card>

            {/* Education Section */}
            <Card
              title={<Title level={5}>Education</Title>}
              className="rounded-xl"
            >
              {resumeData?.parsedData.education &&
              resumeData.parsedData.education.length > 0 ? (
                <Timeline>
                  {resumeData.parsedData.education.map((edu) => (
                    <Timeline.Item key={edu._id}>
                      <div className="mb-4">
                        <Text strong className="text-lg">
                          {edu.degree}
                        </Text>
                        <div>
                          <Text type="secondary">
                            {edu.institution} • {edu.startYear} - {edu.endYear}
                          </Text>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Empty description="No education data available" />
              )}
            </Card>

            {/* Projects Section */}
            <Card
              title={
                <Title level={5}>
                  <ProjectOutlined /> Projects
                </Title>
              }
              className="rounded-xl"
            >
              {resumeData?.parsedData.projects &&
              resumeData.parsedData.projects.length > 0 ? (
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  {resumeData.parsedData.projects.map((project) => (
                    <div key={project._id}>
                      <div className="flex justify-between items-start">
                        <Text strong className="text-lg">
                          {project.name}
                        </Text>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="small">View Project</Button>
                          </a>
                        )}
                      </div>
                      <Paragraph className="mt-2">
                        {project.description}
                      </Paragraph>
                      <Space wrap className="mt-2">
                        {project.technologies.map((tech, i) => (
                          <Tag key={i} color="blue" className="rounded-full">
                            {tech}
                          </Tag>
                        ))}
                      </Space>
                      <Divider />
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty description="No projects available" />
              )}
            </Card>

            {/* Certifications */}
            {resumeData?.parsedData.certifications &&
              resumeData.parsedData.certifications.length > 0 && (
                <Card
                  title={
                    <Title level={5}>
                      <TrophyOutlined /> Certifications
                    </Title>
                  }
                  className="rounded-xl"
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {resumeData.parsedData.certifications.map((cert, index) => (
                      <div key={index}>
                        <Text strong>{cert.name}</Text>
                        <div>
                          <Text type="secondary">{cert.issuer}</Text>
                        </div>
                      </div>
                    ))}
                  </Space>
                </Card>
              )}
          </Space>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSave}
          className="mt-4"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Tagline"
            name="tagline"
            rules={[{ required: true, message: "Please enter your tagline" }]}
          >
            <Input placeholder="e.g., Full Stack Developer | AI Enthusiast" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter your city" }]}
              >
                <Input placeholder="Your city" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[
                  { required: true, message: "Please enter your country" },
                ]}
              >
                <Input placeholder="Your country" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Bio"
            name="bio"
            rules={[{ required: true, message: "Please enter your bio" }]}
          >
            <TextArea
              rows={4}
              placeholder="Tell us about yourself..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Skills{" "}
                <span style={{ color: "rgba(0,0,0,.45)" }}>(up to 5)</span>
              </span>
            }
            name="skills"
            rules={[
              { required: true, message: "Please select at least one skill" },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add or select skills"
              options={skillOptions}
              maxTagCount={5}
            />
          </Form.Item>

          <Form.Item
            label="GitHub URL"
            name="githubUrl"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
          >
            <Input
              placeholder="https://github.com/yourusername"
              prefix={<GithubFilled />}
            />
          </Form.Item>

          <Form.Item
            label="LinkedIn URL"
            name="linkedinUrl"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
          >
            <Input
              placeholder="https://linkedin.com/in/yourusername"
              prefix={<LinkedinFilled />}
            />
          </Form.Item>

          <Form.Item
            label="Portfolio URL"
            name="portfolioUrl"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
          >
            <Input
              placeholder="https://yourportfolio.com"
              prefix={<GlobalOutlined />}
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
