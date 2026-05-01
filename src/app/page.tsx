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
  Statistic,
  Space,
  Tag,
  Steps,
  Avatar,
  Divider,
  ConfigProvider,
  Collapse,
  Progress,
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
    title: "Profile setup",
    description:
      "Candidates and companies complete their verified profiles and goals.",
  },
  {
    title: "AI matching",
    description: "HireGenix recommends roles or candidates that fit best.",
  },
  {
    title: "Interview & score",
    description:
      "Structured interview sessions with instant insights and scorecards.",
  },
  {
    title: "Decide with confidence",
    description: "Collaborate, review, and move to offer faster.",
  },
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
              <Col xs={24} lg={12}>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                  <Tag color="blue">AI-powered talent intelligence</Tag>
                  <Title className="landing-title">
                    Hire with certainty. Scale with confidence.
                  </Title>
                  <Paragraph className="landing-subtitle">
                    HireGenix unifies verified profiles, smart matching, and
                    interview analytics into one enterprise-ready hiring
                    platform for candidates and companies.
                  </Paragraph>
                  <Space wrap>
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
                  <Space size="large" wrap className="landing-metrics">
                    {stats.map((stat) => (
                      <div key={stat.label} className="landing-metric">
                        <Text className="landing-metric-label">{stat.label}</Text>
                        <div className="landing-metric-value">
                          {stat.value}
                          <span>{stat.suffix}</span>
                        </div>
                      </div>
                    ))}
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={12}>
                <div className="landing-visual">
                  <Card className="landing-visual-card" bordered={false}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Card size="small" className="landing-mini-card" bordered={false}>
                          <Space direction="vertical" size={8}>
                            <Text className="landing-mini-title">Company Pipeline</Text>
                            <Progress percent={72} strokeColor="var(--accent)" />
                            <Space wrap>
                              <Tag color="blue">Shortlist 18</Tag>
                              <Tag color="gold">Interview 7</Tag>
                            </Space>
                          </Space>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card size="small" className="landing-mini-card" bordered={false}>
                          <Space direction="vertical" size={8}>
                            <Text className="landing-mini-title">Candidate Score</Text>
                            <Statistic
                              value={92}
                              suffix="%"
                              valueStyle={{ color: "var(--text-primary)" }}
                            />
                            <Tag color="green">Verified</Tag>
                          </Space>
                        </Card>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={[12, 12]}>
                      {["AI Interview", "Skill Match", "Availability"].map((item) => (
                        <Col xs={24} sm={8} key={item}>
                          <Card size="small" className="landing-pill" bordered={false}>
                            <Space>
                              <Avatar size={24} icon={<CheckCircleOutlined />} />
                              <Text>{item}</Text>
                            </Space>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                  <Card className="landing-visual-glow" bordered={false}>
                    <Space direction="vertical" size={6}>
                      <Text className="landing-glow-title">Live Interview Feed</Text>
                      <Space wrap>
                        <Tag color="blue">Screening</Tag>
                        <Tag color="green">Complete</Tag>
                        <Tag color="gold">In progress</Tag>
                      </Space>
                      <Paragraph className="landing-glow-text">
                        Candidates are scored in real time with structured
                        feedback loops and verified identity checks.
                      </Paragraph>
                    </Space>
                  </Card>
                </div>
              </Col>
            </Row>
          </section>

          <section className="landing-section" id="social">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} lg={6}>
                <Title level={3} className="landing-section-title">
                  Trusted by hiring leaders
                </Title>
                <Paragraph className="landing-section-subtitle">
                  Companies use HireGenix to streamline hiring at scale.
                </Paragraph>
              </Col>
              <Col xs={24} lg={18}>
                <Row gutter={[16, 16]}>
                  {["NovaLabs", "PeakHire", "Apex Talent", "CloudBridge", "CoreStack", "VantaX"].map(
                    (name) => (
                      <Col xs={12} md={8} key={name}>
                        <Card className="landing-logo-card" bordered={false}>
                          <Space>
                            <Avatar icon={<GlobalOutlined />} />
                            <Text>{name}</Text>
                          </Space>
                        </Card>
                      </Col>
                    )
                  )}
                </Row>
              </Col>
            </Row>
          </section>

          <section className="landing-section" id="features">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Title level={2} className="landing-section-title">
                  AI-first features built for hiring teams
                </Title>
                <Paragraph className="landing-section-subtitle">
                  Everything you need to align recruiters, hiring managers, and
                  candidates in one intelligent workflow.
                </Paragraph>
              </Col>
              <Col xs={24} lg={16}>
                <Row gutter={[16, 16]}>
                  {features.map((feature) => (
                    <Col xs={24} md={12} key={feature.title}>
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
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </section>

          <section className="landing-section" id="workflow">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} lg={10}>
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
              <Col xs={24} lg={14}>
                <Row gutter={[16, 16]}>
                  {["Candidate Experience", "Recruiter Console", "Company Insights", "Interview Studio"].map(
                    (label) => (
                      <Col xs={24} md={12} key={label}>
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
                      </Col>
                    )
                  )}
                </Row>
              </Col>
            </Row>
          </section>

          <section className="landing-section" id="faq">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Title level={2} className="landing-section-title">
                  Answers for your team
                </Title>
                <Paragraph className="landing-section-subtitle">
                  Everything you need to know about onboarding, security, and
                  scaling your hiring workflow.
                </Paragraph>
              </Col>
              <Col xs={24} lg={16}>
                <Collapse items={faqItems} bordered={false} className="landing-faq" />
              </Col>
            </Row>
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
