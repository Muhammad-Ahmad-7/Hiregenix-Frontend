"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Avatar,
  Card,
  Tag,
  Typography,
  Divider,
  Space,
  Row,
  Col,
  Timeline,
  Affix,
  Grid,
  Empty,
} from "antd";
import {
  GithubFilled,
  LinkedinFilled,
  PaperClipOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { getResumeDataByIdApi } from "@/app/api/candidate/profile.api";
import { getCandidateProfileWithIdApi } from "@/app/api/general/general.api";
import { CandidateProfileResponse } from "@/constants/Interfaces/Types/Profile.interface";
import { CandidateResume } from "@/constants/Interfaces/Types/Resume.interface";
import ReactMarkdown from "react-markdown";
import ProfileSkeleton from "@/component/Skeletons/ProfileSkeleton";
import toast from "react-hot-toast";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// ─── Interfaces ───────────────────────────────────────────────────────────────

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
  _id: string;
  name?: string;
  issuer?: string;
  year?: string;
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
  certifications?: ResumeCertification[];
}

interface ResumeData {
  parsedData: ResumeParsedData;
  fileUrl: string;
  aiScore: number;
  aiSuggestions: string[];
}

// ─── Type guard ───────────────────────────────────────────────────────────────

const isCandidateProfile = (
  profile: CandidateProfileResponse | unknown
): profile is CandidateProfileResponse => {
  return (
    profile !== null && typeof profile === "object" && "fullName" in profile
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapApiResumeToState = (apiResume: CandidateResume): ResumeData => {
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const AIResponseViewer = ({ aiResult }: { aiResult: string }) => (
  <div className="ai-response-container">
    <ReactMarkdown>{aiResult}</ReactMarkdown>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CandidateProfileView() {
  const params = useParams();
  // Support both /candidate/[id] and extracting from URL
  const id = (params?.id as string) || (typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "");

  const screens = useBreakpoint();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [profile, setProfile] = useState<CandidateProfileResponse | null>(null);

  const isLargeScreen = screens.lg;

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [resumeResponse, profileResponse] = await Promise.all([
        getResumeDataByIdApi(id),
        getCandidateProfileWithIdApi(id),
      ]);

      const apiResume = resumeResponse?.data?.resume;
      if (apiResume) {
        const mapped = mapApiResumeToState(apiResume);
        setResumeData(mapped);
        setResumeUrl(mapped.fileUrl);
      }

      const candidateProfile = profileResponse?.data?.candidate;
      if (candidateProfile) {
        setProfile(candidateProfile);
      }
    } catch (error) {
      toast.error("Failed to load candidate profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Sidebar (read-only) ─────────────────────────────────────────────────

  const SidebarCard = (
    <Card className="rounded-xl">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="flex items-center gap-3">
          <Avatar
            size={72}
            src={
              isCandidateProfile(profile)
                ? profile?.profilePictureUrl
                : "https://api.dicebear.com/8.x/avataaars/svg?seed=user"
            }
          />
          <div>
            <Title level={4} style={{ marginBottom: 0 }}>
              {isCandidateProfile(profile)
                ? profile?.fullName || resumeData?.parsedData.name || "No Name"
                : resumeData?.parsedData.name || "No Name"}
            </Title>
            <Text type="secondary">
              {isCandidateProfile(profile)
                ? profile?.tagline || "No tagline available"
                : "No tagline available"}
            </Text>
          </div>
        </div>

        <Divider className="!my-3" />

        <div className="flex justify-between items-center">
          <Text strong>Email</Text>
          <Text>
            {isCandidateProfile(profile)
              ? profile?.userId?.email || resumeData?.parsedData.email || "Not specified"
              : resumeData?.parsedData.email || "Not specified"}
          </Text>
        </div>
        <div className="flex justify-between items-center">
          <Text strong>Phone</Text>
          <Text>
            {isCandidateProfile(profile)
              ? profile?.contactNumber || resumeData?.parsedData.phone || "Not specified"
              : resumeData?.parsedData.phone || "Not specified"}
          </Text>
        </div>
        <div className="flex justify-between items-center">
          <Text strong>Location</Text>
          <Text>
            {isCandidateProfile(profile) && profile?.city && profile?.country
              ? `${profile.city}, ${profile.country}`
              : "Not specified"}
          </Text>
        </div>

        <div className="flex justify-between items-start">
          <Text strong className="!w-[35%]">Skills</Text>
          <Space wrap className="!flex justify-end">
            {(
              isCandidateProfile(profile)
                ? profile?.skills || resumeData?.parsedData.skills || []
                : resumeData?.parsedData.skills || []
            )
              .slice(0, 8)
              .map((skill: string, index: number) => (
                <Tag key={index} className="rounded-full" color="blue">{skill}</Tag>
              ))}
            {(
              isCandidateProfile(profile)
                ? profile?.skills?.length || resumeData?.parsedData.skills?.length || 0
                : resumeData?.parsedData.skills?.length || 0
            ) > 8 && (
                <Tag className="rounded-full">
                  +{Math.max(
                    resumeData?.parsedData.skills?.length || 0,
                    isCandidateProfile(profile) ? profile?.skills?.length || 0 : 0
                  ) - 8}
                </Tag>
              )}
          </Space>
        </div>

        <Divider className="!my-3" />

        <Text strong>Bio</Text>
        <Paragraph ellipsis={{ rows: 6 }} style={{ marginBottom: 0 }}>
          {isCandidateProfile(profile)
            ? profile?.bio || "No bio available"
            : "No bio available"}
        </Paragraph>

        <Divider className="!my-3" />

        <div className="flex flex-col gap-4">
          <Text strong>Links</Text>
          {(() => {
            const githubUrl = isCandidateProfile(profile)
              ? profile?.githubUrl || resumeData?.parsedData.github
              : resumeData?.parsedData.github;
            const linkedinUrl = isCandidateProfile(profile)
              ? profile?.linkedinUrl || resumeData?.parsedData.linkedin
              : resumeData?.parsedData.linkedin;
            const portfolioUrl = isCandidateProfile(profile)
              ? profile?.portfolioUrl || resumeData?.parsedData.portfolio
              : resumeData?.parsedData.portfolio;
            return (
              <div className="flex gap-4">
                {githubUrl && (
                  <div className="flex gap-2 items-center">
                    <GithubFilled className="text-3xl" />
                    <a href={githubUrl} target="_blank" rel="noreferrer">
                      <Text strong>GitHub</Text>
                    </a>
                  </div>
                )}
                {linkedinUrl && (
                  <div className="flex gap-2 items-center">
                    <LinkedinFilled className="text-3xl text-[#0A66C2]" />
                    <a href={linkedinUrl} target="_blank" rel="noreferrer">
                      <Text strong>LinkedIn</Text>
                    </a>
                  </div>
                )}
                {portfolioUrl && (
                  <div className="flex gap-2 items-center">
                    <GlobalOutlined className="text-3xl" />
                    <a href={portfolioUrl} target="_blank" rel="noreferrer">
                      <Text strong>Portfolio</Text>
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </Space>
    </Card>
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Row gutter={[24, 24]}>
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <Col xs={24} md={24} lg={9}>
          {isLargeScreen ? <Affix offsetTop={80}>{SidebarCard}</Affix> : SidebarCard}
        </Col>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <Col xs={24} md={24} lg={15}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">

            {/* AI Score */}
            {resumeData && (
              <Card
                className="rounded-xl"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                <div className="text-white flex justify-between items-center">
                  <div>
                    <Title level={5} style={{ color: "white", margin: 0 }}>AI Resume Score</Title>
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                      This resume has been analyzed by AI
                    </Text>
                  </div>
                  <div className="text-right">
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                      {resumeData.aiScore}/100
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>Score</Text>
                  </div>
                </div>
              </Card>
            )}

            {/* Resume Download */}
            <Card className="rounded-xl">
              {resumeUrl ? (
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                    Resume Available
                  </Title>
                  <Text type="secondary">You can view or download the candidate&apos;s resume below.</Text>
                  <div className="!mt-4 gap-2 flex items-center">
                    <PaperClipOutlined />
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!text-[#52C41A] hover:!text-[#73D13D]"
                    >
                      {(
                        isCandidateProfile(profile)
                          ? profile?.fullName || "Candidate"
                          : "Candidate"
                      ).replace(/\s+/g, "")}Resume.pdf
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <Title level={5} style={{ margin: 0 }}>No Resume Uploaded</Title>
                  <Text type="secondary">This candidate has not uploaded a resume yet.</Text>
                </div>
              )}
            </Card>

            {/* AI Suggestions */}
            {resumeData?.aiSuggestions && resumeData.aiSuggestions.length > 0 && (
              <Card title={<Title level={5}>AI Suggestions</Title>} className="rounded-xl">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {resumeData.aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex gap-2">
                      <Text type="secondary">{index + 1}.</Text>
                      <AIResponseViewer aiResult={suggestion} />
                    </div>
                  ))}
                </Space>
              </Card>
            )}

            {/* ── Experience ────────────────────────────────────────────────── */}
            <Card title={<Title level={5}>Experience</Title>} className="rounded-xl">
              {resumeData?.parsedData.experience && resumeData.parsedData.experience.length > 0 ? (
                <Timeline>
                  {resumeData.parsedData.experience.map((exp) => (
                    <Timeline.Item key={exp._id}>
                      <div className="mb-4">
                        <Text strong className="text-lg">{exp.position}</Text>
                        <div>
                          <Text type="secondary">
                            {exp.company} • {formatDate(exp.startDate)}
                            {exp.endDate ? ` – ${formatDate(exp.endDate)}` : " – Present"}
                          </Text>
                        </div>
                        <Paragraph className="mt-2" style={{ whiteSpace: "pre-line" }}>
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

            {/* ── Education ─────────────────────────────────────────────────── */}
            <Card title={<Title level={5}>Education</Title>} className="rounded-xl">
              {resumeData?.parsedData.education && resumeData.parsedData.education.length > 0 ? (
                <Timeline>
                  {resumeData.parsedData.education.map((edu) => (
                    <Timeline.Item key={edu._id}>
                      <div className="mb-4">
                        <Text strong className="text-lg">{edu.degree}</Text>
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

            {/* ── Projects ──────────────────────────────────────────────────── */}
            <Card
              title={<Title level={5}><ProjectOutlined /> Projects</Title>}
              className="rounded-xl"
            >
              {resumeData?.parsedData.projects && resumeData.parsedData.projects.length > 0 ? (
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  {resumeData.parsedData.projects.map((project) => (
                    <div key={project._id}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <Text strong className="text-lg">{project?.name}</Text>
                            {project?.link && (
                              <a href={project?.link} target="_blank" rel="noopener noreferrer">
                                <Tag color="blue" className="cursor-pointer">View Project</Tag>
                              </a>
                            )}
                          </div>
                          <Paragraph className="mt-2">{project.description}</Paragraph>
                          <Space wrap className="mt-2">
                            {project.technologies.map((tech, i) => (
                              <Tag key={i} color="blue" className="rounded-full">{tech}</Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                      <Divider />
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty description="No projects available" />
              )}
            </Card>

            {/* ── Certifications ────────────────────────────────────────────── */}
            <Card
              title={<Title level={5}><TrophyOutlined /> Certifications</Title>}
              className="rounded-xl"
            >
              {resumeData?.parsedData.certifications && resumeData.parsedData.certifications.length > 0 ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {resumeData.parsedData.certifications.map((cert, index) => (
                    <div key={index}>
                      <Text strong>{cert.name}</Text>
                      <div>
                        <Text type="secondary">
                          {cert.issuer}{cert.year ? ` • ${cert.year}` : ""}
                        </Text>
                      </div>
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty description="No certifications available" />
              )}
            </Card>

          </Space>
        </Col>
      </Row>
    </div>
  );
}