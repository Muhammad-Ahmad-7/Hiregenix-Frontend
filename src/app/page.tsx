"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Tag,
  Steps,
  Avatar,
  Divider,
  ConfigProvider,
  Collapse,
  theme as antdTheme,
} from "antd";
import {
  BulbOutlined,
  MoonOutlined,
  LoginOutlined,
  LogoutOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CloudOutlined,
  GlobalOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getToken, removeToken } from "@/utils/token";
import { RootState } from "@/redux/store";
import { setThemeMode } from "@/redux/slices/themeSlice";
import { motion } from "framer-motion";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const features = [
  {
    title: "AI Interview Insights",
    description:
      "Structured interviews, real-time scoring, and bias-aware recommendations.",
    icon: <ThunderboltOutlined />,
  },
  {
    title: "Verified Talent",
    description:
      "Identity checks, profile completion, and trust signals built in.",
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: "Smart Matching",
    description:
      "Role-based recommendations for candidates and recruiters in seconds.",
    icon: <RocketOutlined />,
  },
  {
    title: "Collaborative Hiring",
    description:
      "Shared pipelines, notes, and decisions for modern hiring teams.",
    icon: <TeamOutlined />,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track conversion, interview health, and hiring velocity at a glance.",
    icon: <BarChartOutlined />,
  },
  {
    title: "Interview Automation",
    description:
      "Scheduling, reminders, and feedback loops without manual coordination.",
    icon: <CalendarOutlined />,
  },
];

const workflow = [
  {
    title: "Create your profile",
    description:
      "Sign up and build a verified profile with skills, experience, and hiring goals."
  },
  {
    title: "Add or discover opportunities",
    description:
      "Candidates explore jobs tailored to them, while companies post roles and define requirements."
  },
  {
    title: "Smart matching",
    description:
      "The system connects the right candidates with the right jobs using skill and intent-based matching."
  },
  {
    title: "Apply or shortlist instantly",
    description:
      "Candidates apply in one click, and companies can instantly shortlist the most relevant profiles."
  },
  {
    title: "AI-assisted interviews",
    description:
      "Structured interviews with guided questions and real-time evaluation support."
  },
  {
    title: "Clear evaluation reports",
    description:
      "Get simple, structured scorecards that highlight strengths, gaps, and fit for the role."
  },
  {
    title: "Faster hiring decisions",
    description:
      "Collaborate, compare candidates, and make confident hiring decisions without delays."
  }
];

const faqItems = [
  {
    key: "1",
    label: "How does HireGenix improve hiring speed?",
    children:
      "Automations, smart matching, and interview insights cut decision time and reduce back-and-forth.",
  },
  {
    key: "2",
    label: "Is candidate data secure?",
    children:
      "Yes. Data is encrypted in transit and at rest, with role-based access controls.",
  },
  {
    key: "3",
    label: "Can I use HireGenix for campus or bulk hiring?",
    children:
      "Absolutely. Use pipelines, analytics, and interview templates to scale hiring programs.",
  },
  {
    key: "4",
    label: "Does the platform work for both candidates and companies?",
    children:
      "Yes. HireGenix is designed for candidates, recruiters, and hiring teams in one system.",
  },
];

const stats = [
  { label: "Active Roles", value: 1200, suffix: "+" },
  { label: "Verified Candidates", value: 8500, suffix: "+" },
  { label: "Avg. Time-to-Hire", value: 14, suffix: " days" },
  { label: "Interview Accuracy", value: 92, suffix: "%" },
];

const reviews = [
  {
    name: "Amaan Raza",
    role: "HR Lead, NovaLabs",
    quote: "HireGenix turned our screening into a crisp, data-driven flow.",
  },
  {
    name: "Hira Khan",
    role: "Talent Ops, PeakHire",
    quote: "We ship offers faster and the scorecards are always consistent.",
  },
  {
    name: "Sameer Ali",
    role: "Recruiter, CloudBridge",
    quote: "The AI matching saved us hours per role. The pipeline stays clean.",
  },
  {
    name: "Zainab Mir",
    role: "People Partner, CoreStack",
    quote: "A polished hiring experience for candidates and managers alike.",
  },
  {
    name: "Muneeb Arif",
    role: "Founder, Apex Talent",
    quote: "We finally have a clear view of who is ready for interview.",
  },
];

const reviewLoop = [...reviews, ...reviews];

const dashboardJobs = [
  { role: "Senior Frontend", status: "Open", tone: "success", candidates: "18" },
  { role: "Product Designer", status: "Screening", tone: "info", candidates: "9" },
  { role: "Data Analyst", status: "On hold", tone: "warning", candidates: "6" },
];

const dashboardApplications = [
  { name: "Ayesha Khan", role: "Frontend", stage: "Interview" },
  { name: "Hassan Ali", role: "Product", stage: "Screening" },
  { name: "Zara Iqbal", role: "Data", stage: "Offer" },
];

// Dashboard Snapshot Component
const DashboardSnapshot = ({ themeMode }: { themeMode: string }) => {
  const isDark = themeMode === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Card
        className="landing-dashboard-snapshot"
        bordered={false}
        style={{
          background: isDark ? "#0f172a" : "#ffffff",
          border: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: isDark
            ? "0 20px 60px rgba(0, 0, 0, 0.4)"
            : "0 20px 60px rgba(0, 0, 0, 0.08)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {/* Dashboard Header */}
          <div style={{ padding: "20px", borderBottom: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}` }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={5} style={{ margin: 0, color: "var(--text-primary)" }}>
                  Hiring Dashboard
                </Title>
              </Col>
              <Col>
                <Space size={8}>
                  <Tag color="blue">Today</Tag>
                  <Tag>All Roles</Tag>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Dashboard Content */}
          <div style={{ padding: "20px" }}>
            <Row gutter={[16, 16]}>
              {/* Key Metrics */}
              <Col xs={24}>
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card size="small" bordered={false} style={{ background: isDark ? "#111827" : "#f9fafb" }}>
                        <Space direction="vertical" size={4}>
                          <Text style={{ fontSize: "12px", color: "var(--text-muted)" }}>Open Roles</Text>
                          <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--accent)" }}>
                            24
                          </div>
                        </Space>
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 }}
                    >
                      <Card size="small" bordered={false} style={{ background: isDark ? "#111827" : "#f9fafb" }}>
                        <Space direction="vertical" size={4}>
                          <Text style={{ fontSize: "12px", color: "var(--text-muted)" }}>Applications</Text>
                          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#22c55e" }}>
                            156
                          </div>
                        </Space>
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card size="small" bordered={false} style={{ background: isDark ? "#111827" : "#f9fafb" }}>
                        <Space direction="vertical" size={4}>
                          <Text style={{ fontSize: "12px", color: "var(--text-muted)" }}>Interviews</Text>
                          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>
                            12
                          </div>
                        </Space>
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.65 }}
                    >
                      <Card size="small" bordered={false} style={{ background: isDark ? "#111827" : "#f9fafb" }}>
                        <Space direction="vertical" size={4}>
                          <Text style={{ fontSize: "12px", color: "var(--text-muted)" }}>Offers</Text>
                          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#8b5cf6" }}>
                            3
                          </div>
                        </Space>
                      </Card>
                    </motion.div>
                  </Col>
                </Row>
              </Col>

              {/* Tables */}
              <Col xs={24}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Row gutter={[12, 12]}>
                    <Col xs={24} md={12}>
                      <Card size="small" bordered={false} style={{ background: isDark ? "#111827" : "#f9fafb" }}>
                        <Space direction="vertical" size={10} style={{ width: "100%" }}>
                          <Text className="dashboard-table-title">Your Jobs</Text>
                          <div className="dashboard-table">
                            <div className="dashboard-table-row dashboard-table-header">
                              <span>Role</span>
                              <span>Status</span>
                              <span>Candidates</span>
                            </div>
                            {dashboardJobs.map((job) => (
                              <div key={job.role} className="dashboard-table-row">
                                <span>{job.role}</span>
                                <span className={`dashboard-status dashboard-status-${job.tone}`}>
                                  {job.status}
                                </span>
                                <span>{job.candidates}</span>
                              </div>
                            ))}
                          </div>
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card size="small" bordered={false} style={{ background: isDark ? "#111827" : "#f9fafb" }}>
                        <Space direction="vertical" size={10} style={{ width: "100%" }}>
                          <Text className="dashboard-table-title">Top Applications</Text>
                          <div className="dashboard-table">
                            <div className="dashboard-table-row dashboard-table-header">
                              <span>Candidate</span>
                              <span>Role</span>
                              <span>Stage</span>
                            </div>
                            {dashboardApplications.map((applicant) => (
                              <div key={applicant.name} className="dashboard-table-row">
                                <span>{applicant.name}</span>
                                <span>{applicant.role}</span>
                                <span className="dashboard-status dashboard-status-info">
                                  {applicant.stage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </motion.div>
              </Col>
            </Row>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(Boolean(getToken()));
  }, []);

  const themeConfig = useMemo(
    () => ({
      algorithm:
        themeMode === "dark"
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: themeMode === "dark" ? "#60a5fa" : "#1677ff",
      },
    }),
    [themeMode]
  );

  const toggleTheme = () => {
    dispatch(setThemeMode(themeMode === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthed(false);
    router.push("/auth");
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: "100vh", background: "var(--background)" }}>
        <Header className="landing-header">
          <Row align="middle" justify="space-between" gutter={16}>
            <Space size="middle">
              <Avatar
                shape="square"
                size={36}
                className="landing-logo"
                icon={<CloudOutlined />}
              />
              <Title level={4} style={{ margin: 0, color: "var(--text-primary)" }}>
                HireGenix
              </Title>
              <Tag color="blue">Enterprise AI Hiring</Tag>
            </Space>
            <Menu
              mode="horizontal"
              selectable={false}
              className="landing-menu"
              onClick={({ key }) => {
                const section = document.getElementById(String(key));
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
              items={[
                { key: "features", label: "Features" },
                { key: "workflow", label: "Workflow" },
                { key: "faq", label: "FAQ" },
                { key: "footer", label: "Contact" },
              ]}
            />
            <Space size="middle">
              <Button
                icon={themeMode === "dark" ? <BulbOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
              >
                {themeMode === "dark" ? "Light" : "Dark"}
              </Button>
              {isAuthed ? (
                <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => router.push("/auth")}
                >
                  Login
                </Button>
              )}
            </Space>
          </Row>
        </Header>

        <Content className="landing-content">
          <section className="landing-hero">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <Space direction="vertical" size="large" className="landing-hero-copy">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Tag color="blue">
                        AI-powered talent intelligence
                      </Tag>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <Title className="landing-title">
                        Hire with certainty. Scale with confidence.
                      </Title>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Paragraph className="landing-subtitle">
                        HireGenix unifies verified profiles, smart matching, and
                        interview analytics into one enterprise-ready hiring
                        platform for candidates and companies.
                      </Paragraph>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <Space wrap className="landing-hero-actions">
                        <Button type="primary" size="large" onClick={() => router.push("/auth")}>
                          Launch platform
                        </Button>
                        <Button size="large" onClick={() => router.push("/auth/sign-up?role=company")}>
                          Start hiring
                        </Button>
                        <Button size="large" onClick={() => router.push("/auth/sign-up?role=candidate")}>
                          Find roles
                        </Button>
                      </Space>
                    </motion.div>
                    <Space size="large" wrap className="landing-metrics">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                          className="landing-metric"
                        >
                          <Text className="landing-metric-label">{stat.label}</Text>
                          <div className="landing-metric-value">
                            {stat.value}
                            <span>{stat.suffix}</span>
                          </div>
                        </motion.div>
                      ))}
                    </Space>
                  </Space>
                </motion.div>
              </Col>
              <Col xs={24}>
                <DashboardSnapshot themeMode={themeMode} />
              </Col>
            </Row>
          </section>

          <section className="landing-section" id="social">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24}>
                  <Title level={3} className="landing-section-title">
                    Trusted by hiring leaders
                  </Title>
                  <Paragraph className="landing-section-subtitle">
                    Companies use HireGenix to streamline hiring at scale.
                  </Paragraph>
                </Col>
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    {["NovaLabs", "PeakHire", "Apex Talent", "CloudBridge", "CoreStack", "VantaX"].map(
                      (name, index) => (
                        <Col xs={12} md={8} key={name}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true, amount: 0.3 }}
                          >
                            <Card className="landing-logo-card" bordered={false}>
                              <Space>
                                <Avatar icon={<GlobalOutlined />} />
                                <Text>{name}</Text>
                              </Space>
                            </Card>
                          </motion.div>
                        </Col>
                      )
                    )}
                  </Row>
                </Col>
              </Row>
            </motion.div>
          </section>

          <section className="landing-section" id="features">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Title level={2} className="landing-section-title">
                    AI-first features built for hiring teams
                  </Title>
                  <Paragraph className="landing-section-subtitle">
                    Everything you need to align recruiters, hiring managers, and
                    candidates in one intelligent workflow.
                  </Paragraph>
                </Col>
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    {features.map((feature, index) => (
                      <Col xs={24} md={12} key={feature.title}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true, amount: 0.3 }}
                        >
                          <Card className="landing-feature-card" bordered={false}>
                            <Space direction="vertical" size="middle">
                              <Avatar size={48} icon={feature.icon} className="landing-feature-icon" />
                              <Title level={4} style={{ margin: 0 }}>
                                {feature.title}
                              </Title>
                              <Paragraph style={{ margin: 0 }}>
                                {feature.description}
                              </Paragraph>
                            </Space>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </motion.div>
          </section>

          <section className="landing-section" id="workflow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24}>
                  <Card className="landing-workflow-card" bordered={false}>
                    <Title level={2} style={{ marginTop: 0 }}>
                      Workflow that scales with your hiring volume
                    </Title>
                    <Paragraph>
                      From sourcing to offer, HireGenix guides every step with AI
                      insight and collaboration.
                    </Paragraph>
                    <Steps
                      direction="vertical"
                      items={workflow.map((step, index) => ({
                        title: step.title,
                        description: step.description,
                        icon: <CheckCircleOutlined />,
                        status: index < 2 ? "finish" : "process",
                      }))}
                    />
                  </Card>
                </Col>
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    {["Candidate Experience", "Recruiter Console", "Company Insights", "Interview Studio"].map(
                      (label, index) => (
                        <Col xs={24} md={12} key={label}>
                          <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.3 }}
                          >
                            <Card className="landing-tile-card" bordered={false}>
                              <Space direction="vertical" size={10}>
                                <Avatar icon={<UserOutlined />} className="landing-tile-icon" />
                                <Text strong>{label}</Text>
                                <Text className="landing-tile-text">
                                  Unified views, consistent data, and real-time
                                  updates for every team.
                                </Text>
                              </Space>
                            </Card>
                          </motion.div>
                        </Col>
                      )
                    )}
                  </Row>
                </Col>
              </Row>
            </motion.div>
          </section>

          <section className="landing-section landing-reviews" id="reviews">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Title level={2} className="landing-section-title">
                    Teams love the clarity
                  </Title>
                  <Paragraph className="landing-section-subtitle">
                    Real feedback from recruiters and hiring managers using HireGenix daily.
                  </Paragraph>
                </Col>
                <Col xs={24}>
                  <div className="reviews-marquee">
                    <div className="reviews-track">
                      {reviewLoop.map((review, index) => (
                        <Card key={`${review.name}-${index}`} className="review-card" bordered={false}>
                          <Space direction="vertical" size={10}>
                            <Paragraph className="review-quote">“{review.quote}”</Paragraph>
                            <Space size={10}>
                              <Avatar size={32} icon={<UserOutlined />} />
                              <div>
                                <Text className="review-name">{review.name}</Text>
                                <div className="review-role">{review.role}</div>
                              </div>
                            </Space>
                          </Space>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </section>

          <section className="landing-section" id="faq">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Title level={2} className="landing-section-title">
                    Answers for your team
                  </Title>
                  <Paragraph className="landing-section-subtitle">
                    Everything you need to know about onboarding, security, and
                    scaling your hiring workflow.
                  </Paragraph>
                </Col>
                <Col xs={24}>
                  <Collapse items={faqItems} bordered={false} className="landing-faq" />
                </Col>
              </Row>
            </motion.div>
          </section>
        </Content>

        <Footer className="landing-footer" id="footer">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={10}>
              <Space direction="vertical" size="small">
                <Title level={4} style={{ marginBottom: 0 }}>
                  HireGenix
                </Title>
                <Paragraph style={{ margin: 0 }}>
                  Enterprise-grade hiring intelligence for modern teams.
                </Paragraph>
                <Space>
                  <Tag color="blue">AI Interviews</Tag>
                  <Tag color="gold">Verified Profiles</Tag>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={7}>
              <Space direction="vertical" size="small">
                <Text strong>Platform</Text>
                <Button type="link" className="landing-footer-link" onClick={() => router.push("/auth")}>Sign in</Button>
                <Button type="link" className="landing-footer-link" onClick={() => router.push("/auth/sign-up?role=company")}>Company signup</Button>
                <Button type="link" className="landing-footer-link" onClick={() => router.push("/auth/sign-up?role=candidate")}>Candidate signup</Button>
              </Space>
            </Col>
            <Col xs={24} md={7}>
              <Space direction="vertical" size="small">
                <Text strong>Contact</Text>
                <Text>hello@hiregenix.ai</Text>
                <Text>Karachi, Pakistan</Text>
              </Space>
            </Col>
          </Row>
          <Divider style={{ margin: "24px 0" }} />
          <Text className="landing-footer-copy">
            HireGenix © {new Date().getFullYear()} · Built for smart hiring
          </Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
