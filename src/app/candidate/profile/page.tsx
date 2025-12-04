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
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  GithubFilled,
  LinkedinFilled,
  PaperClipOutlined,
  UploadOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface ResumeData {
  parsedData: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string | null;
    summary: string | null;
    skills: string[];
    experience: Array<{
      _id: string;
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      description: string;
    }>;
    education: Array<{
      _id: string;
      institution: string;
      degree: string;
      startYear: number;
      endYear: number;
    }>;
    projects: Array<{
      _id: string;
      name: string;
      description: string;
      technologies: string[];
      link: string | null;
    }>;
    certifications: string[];
  };
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

  // Mock user profile - replace with your Redux state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "Muhammad Taha",
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

  useEffect(() => {
    // Simulate API call - replace with your actual API call
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API call: const response = await getResumeDataApi();

        // Simulated data from your API response
        const mockData: ResumeData = {
          parsedData: {
            name: "Muhammad Taha",
            email: "m_taha_ayaz@yahoo.com",
            phone: "03055800377",
            linkedin: "https://www.linkedin.com/in/muhammad-taha-ayaz",
            github: "https://github.com/tahaxd77",
            portfolio: null,
            summary: null,
            skills: [
              "Java",
              "Python",
              "C/C++",
              "SQL",
              "JavaScript",
              "HTML/CSS",
              "Git",
              "React Native",
              "React",
              "Flask",
              "Supabase",
              "scikit-learn",
              "pandas",
              "Spark MLlib",
              "JavaFX",
            ],
            experience: [
              {
                _id: "69302d7cb074fbffb726fa49",
                company: "COMSATS University",
                position:
                  "Undergraduate Student (Relevant Coursework/Projects)",
                startDate: "2022-09-30T19:00:00.000Z",
                description:
                  "• Developed an understanding with SQL databases to store data efficiently.\n• Learned different types of Data structures and their optimization.\n• Developed a great knowledge about Object Oriented Programming.\n• Experienced learning Mobile App Development using React Native.",
              },
            ],
            education: [
              {
                _id: "69302d7cb074fbffb726fa4a",
                institution: "COMSATS University",
                degree: "Bachelor of Computer Science",
                startYear: 2022,
                endYear: 2026,
              },
              {
                _id: "69302d7cb074fbffb726fa4b",
                institution: "Punjab College",
                degree: "Intermediate in Computer Sciences",
                startYear: 2020,
                endYear: 2022,
              },
            ],
            projects: [
              {
                _id: "69302d7cb074fbffb726fa4c",
                name: "Real Estate Price Predictor",
                description:
                  "Developed a predictive tool using machine learning models to estimate real estate prices based on user input and historical data. Utilized Python libraries such as scikit-learn, pandas, and matplotlib for data preprocessing, model training, and performance visualization.",
                technologies: [
                  "Python",
                  "JavaScript",
                  "scikit-learn",
                  "pandas",
                  "matplotlib",
                  "HTML",
                  "CSS",
                ],
                link: null,
              },
              {
                _id: "69302d7cb074fbffb726fa4d",
                name: "Movie Recommendation System",
                description:
                  "Developed a Movie Recommendation System using Python, Jupyter Notebook, and Spark MLlib (ALS algorithm) to provide personalized recommendations based on user ratings. Built Flask-based REST APIs for serving recommendations and movie details.",
                technologies: [
                  "Jupyter Notebook",
                  "Python",
                  "JS",
                  "Spark MLlib",
                  "Flask",
                ],
                link: null,
              },
              {
                _id: "69302d7cb074fbffb726fa4e",
                name: "BuilderPro",
                description:
                  "Developed a cross-platform e-commerce mobile application tailored for building materials, enabling users to browse, search, and purchase products seamlessly. Implemented robust backend functionality using Supabase.",
                technologies: ["React Native", "JS", "Supabase"],
                link: null,
              },
              {
                _id: "69302d7cb074fbffb726fa4f",
                name: "RealTime Chat Application",
                description:
                  "Built a real-time chat application enabling users to connect and message friends instantly with a responsive and intuitive UI. Integrated Supabase for seamless user authentication and real-time database updates.",
                technologies: ["React", "JS", "Supabase"],
                link: null,
              },
              {
                _id: "69302d7cb074fbffb726fa50",
                name: "Dealership Management System",
                description:
                  "Developed complete backend model used to store the data efficiently. This allows to perform CRUD operations more smoothly. Allows to generate various reports on different aspects.",
                technologies: ["Python", "SQL Server"],
                link: null,
              },
              {
                _id: "69302d7cb074fbffb726fa51",
                name: "Library Management System",
                description:
                  "Developed a system to efficiently manage catalogue and inventory. A user interactive system to make sure the borrowing and returning of books.",
                technologies: ["Java", "JavaFX"],
                link: null,
              },
            ],
            certifications: [],
          },
          fileUrl:
            "https://res.cloudinary.com/hiregenx/image/upload/v1764764854/qp5mtvtqlljrekogcapz.pdf",
          aiScore: 72.5,
          aiSuggestions: [
            "Add a professional summary or objective statement at the beginning of your resume.",
            "Quantify your project achievements with metrics and results.",
            "Include links to your GitHub repositories or live demos for each project.",
            "Consider seeking internships or part-time roles to gain formal work experience.",
          ],
        };

        setResumeData(mockData);
        setResumeUrl(mockData.fileUrl);

        // Update user profile with resume data
        if (mockData.parsedData) {
          setUserProfile((prev) => ({
            ...prev,
            fullName: mockData.parsedData.name || prev.fullName,
            githubUrl: mockData.parsedData.github || prev.githubUrl,
            linkedinUrl: mockData.parsedData.linkedin || prev.linkedinUrl,
            portfolioUrl: mockData.parsedData.portfolio || prev.portfolioUrl,
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
      // const response = await uploadResumeApi(formData);
      // Handle response and update state
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

  const SidebarCard = (
    <Card className="rounded-xl">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar size={72} src={userProfile.profilePictureUrl} />
            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {userProfile.fullName}
              </Title>
              <Text type="secondary">{userProfile.tagline}</Text>
            </div>
          </div>
          <EditOutlined className="cursor-pointer text-lg" />
        </div>

        <Divider className="!my-3" />

        <div className="flex justify-between items-center">
          <Text strong>Email</Text>
          <Text>{resumeData?.parsedData.email || "Not specified"}</Text>
        </div>

        <div className="flex justify-between items-center">
          <Text strong>Phone</Text>
          <Text>{resumeData?.parsedData.phone || "Not specified"}</Text>
        </div>

        <div className="flex justify-between items-center">
          <Text strong>Location</Text>
          <Text>
            {userProfile.city && userProfile.country
              ? `${userProfile.city}, ${userProfile.country}`
              : "Not specified"}
          </Text>
        </div>

        <div className="flex justify-between items-start">
          <Text strong className="!w-[35%]">
            Skills
          </Text>
          <Space wrap className="!flex justify-end">
            {resumeData?.parsedData.skills?.slice(0, 8).map((skill, index) => (
              <Tag key={index} className="rounded-full" color="blue">
                {skill}
              </Tag>
            ))}
            {resumeData?.parsedData.skills &&
              resumeData.parsedData.skills.length > 8 && (
                <Tag className="rounded-full">
                  +{resumeData.parsedData.skills.length - 8}
                </Tag>
              )}
          </Space>
        </div>

        <Divider className="!my-3" />

        <Text strong>Bio</Text>
        <Paragraph>{userProfile.bio}</Paragraph>

        <Divider className="!my-3" />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Text strong>Links</Text>
            <PlusOutlined className="cursor-pointer" />
          </div>

          {userProfile.githubUrl && (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <GithubFilled className="text-3xl" />
                <a
                  href={userProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text strong>GitHub</Text>
                </a>
              </div>
            </div>
          )}

          {userProfile.linkedinUrl && (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <LinkedinFilled className="text-3xl text-[#0A66C2]" />
                <a
                  href={userProfile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text strong>LinkedIn</Text>
                </a>
              </div>
            </div>
          )}

          {userProfile.portfolioUrl && (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <GlobalOutlined className="text-3xl" />
                <a
                  href={userProfile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text strong>Portfolio</Text>
                </a>
              </div>
            </div>
          )}
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
                          {userProfile.fullName.replace(/\s+/g, "")}Resume.pdf
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
    </div>
  );
}
