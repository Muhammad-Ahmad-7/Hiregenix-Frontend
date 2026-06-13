"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  ConfigProvider,
  Divider,
  Drawer,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
  theme as antdTheme,
} from "antd";
import {
  AppstoreOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  BarsOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloudOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LoginOutlined,
  MailOutlined,
  MenuOutlined,
  MessageOutlined,
  MoonOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setThemeMode } from "@/redux/slices/themeSlice";
import { getToken } from "@/utils/token";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const navItems = [
  { key: "features", label: "Features" },
  { key: "platform", label: "Platform" },
  { key: "workflow", label: "Workflow" },
  { key: "faq", label: "FAQ" },
];

const features = [
  {
    title: "AI Interview Intelligence",
    description: "Structured interviews, answer analysis, skill signals, and clear scorecards in one flow.",
    icon: <ThunderboltOutlined />,
  },
  {
    title: "Verified Candidate Profiles",
    description: "Resume parsing, identity checks, profile completion, and trust signals for serious hiring.",
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: "Smart Role Matching",
    description: "Match candidates with roles using skills, experience, intent, and job requirements.",
    icon: <RocketOutlined />,
  },
  {
    title: "Hiring Team Collaboration",
    description: "Keep recruiters, companies, and decision makers aligned with shared pipeline context.",
    icon: <TeamOutlined />,
  },
  {
    title: "Recruitment Analytics",
    description: "Track candidate quality, pipeline movement, interview performance, and hiring velocity.",
    icon: <BarChartOutlined />,
  },
  {
    title: "Automated Interview Flow",
    description: "Reduce manual scheduling, reminders, repeated screening, and scattered feedback loops.",
    icon: <CalendarOutlined />,
  },
];

const platformCards = [
  {
    title: "For Companies",
    description: "Post roles, shortlist relevant candidates, run AI-assisted interviews, and compare scorecards.",
    icon: <TeamOutlined />,
    eyebrow: "Hiring workspace",
    points: [
      "Create and manage role-based pipelines",
      "Publish jobs with structured requirements",
      "Shortlist AI-matched candidate profiles",
      "Automate interview scheduling and screening",
      "Review interview reports and scorecards",
      "Track applications, interviews, and hiring progress",
    ],
  },
  {
    title: "For Candidates",
    description: "Build a verified profile, discover suitable roles, complete interviews, and track progress.",
    icon: <UserOutlined />,
    eyebrow: "Career workspace",
    points: [
      "Build a complete and verified professional profile",
      "Parse resumes into structured skills and experience",
      "Discover jobs matched to your background",
      "Apply and monitor every application in one place",
      "Complete secure AI-assisted interviews",
      "Review interview status and job analytics",
    ],
  },
];

const workflow = [
  {
    title: "Create your workspace",
    description: "Set up a candidate profile or company hiring account.",
    icon: <UserOutlined />,
  },
  {
    title: "Build trusted context",
    description: "Add skills and resumes, or define company and role requirements.",
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: "Publish or discover",
    description: "Companies publish roles while candidates explore matched opportunities.",
    icon: <GlobalOutlined />,
  },
  {
    title: "AI matching",
    description: "HireGenix connects requirements, experience, skills, and intent.",
    icon: <ThunderboltOutlined />,
  },
  {
    title: "Apply and shortlist",
    description: "Candidates apply quickly and companies prioritize relevant profiles.",
    icon: <CheckCircleOutlined />,
  },
  {
    title: "Structured interviews",
    description: "Run consistent AI-assisted interviews with identity verification.",
    icon: <CalendarOutlined />,
  },
  {
    title: "Evaluate signals",
    description: "Review scorecards, strengths, gaps, and role-fit analytics.",
    icon: <BarChartOutlined />,
  },
  {
    title: "Make the decision",
    description: "Compare candidates, collaborate, and close the hiring loop.",
    icon: <RocketOutlined />,
  },
];

const faqItems = [
  {
    key: "1",
    label: "How does HireGenix reduce hiring time?",
    children:
      "It removes repeated manual screening by combining resume parsing, smart matching, structured AI interviews, and clear scorecards.",
  },
  {
    key: "2",
    label: "Is HireGenix only for companies?",
    children:
      "No. It supports both sides: companies manage hiring pipelines, while candidates build verified profiles and apply to suitable roles.",
  },
  {
    key: "3",
    label: "Can it support campus or bulk hiring?",
    children:
      "Yes. The workflow is designed for repeatable screening, interview automation, and candidate comparison at scale.",
  },
  {
    key: "4",
    label: "What makes it different from a normal job portal?",
    children:
      "A normal job portal mostly lists jobs. HireGenix adds AI evaluation, interview reports, matching, analytics, and collaboration.",
  },
  {
    key: "5",
    label: "How does AI-assisted interviewing work?",
    children:
      "HireGenix runs structured interviews based on the role, evaluates relevant answer signals, and produces a consistent report for review. Final hiring decisions always remain with the company.",
  },
  {
    key: "6",
    label: "Can candidates track their applications and interviews?",
    children:
      "Yes. Candidates can monitor applied jobs, active opportunities, upcoming interviews, and completed interview analytics from their dashboard.",
  },
  {
    key: "7",
    label: "Can companies manage multiple jobs at the same time?",
    children:
      "Yes. Company teams can publish and monitor multiple roles, review recent applications, shortlist candidates, and track interview progress from one workspace.",
  },
  {
    key: "8",
    label: "Does HireGenix support verified candidate profiles?",
    children:
      "Yes. Profiles combine structured resume information, completed profile details, skills, and identity or interview verification signals to give companies clearer context.",
  },
];

const stats = [
  { value: "8.5k+", label: "Verified candidates" },
  { value: "1.2k+", label: "Active roles" },
  { value: "92%", label: "Interview signal accuracy" },
  { value: "14d", label: "Average time-to-hire" },
];

const dashboardData = {
  candidate: {
    label: "Candidate",
    title: "Candidate Dashboard",
    path: "candidate/dashboard",
    menu: ["Insights", "Profile", "Job Portal", "Chat", "Job Analytics", "Interviews"],
    menuIcons: [<BarsOutlined key="insights" />, <UserOutlined key="profile" />, <FileTextOutlined key="portal" />, <MessageOutlined key="chat" />, <MailOutlined key="analytics" />, <CalendarOutlined key="interviews" />],
    stats: [
      { label: "Applied Jobs", value: "24" },
      { label: "Resume Score", value: "86" },
      { label: "Matched Jobs", value: "18" },
      { label: "Active Jobs", value: "7" },
    ],
    tableTitle: "Recent Applied Jobs",
    columns: ["Position", "Mode", "Status", "Due"],
    rows: [
      ["Frontend Engineer", "Remote", "Scheduled", "Jun 18"],
      ["Product Designer", "Hybrid", "Completed", "Jun 21"],
      ["React Developer", "On-site", "Applied", "Jun 25"],
    ],
    sideTitle: "Today's interviews",
    sideRows: ["Frontend Engineer · 10:30 AM", "Product Designer · 2:00 PM"],
  },
  company: {
    label: "Company",
    title: "Company Dashboard",
    path: "company/dashboard",
    menu: ["Insights", "Profile", "Job Portal", "Chat", "Job Analytics", "Applications"],
    menuIcons: [<BarsOutlined key="insights" />, <UserOutlined key="profile" />, <FileTextOutlined key="portal" />, <MessageOutlined key="chat" />, <MailOutlined key="analytics" />, <AppstoreOutlined key="applications" />],
    stats: [
      { label: "Total Jobs", value: "32" },
      { label: "Active Jobs", value: "11" },
      { label: "Applications", value: "148" },
      { label: "Interviews", value: "26" },
    ],
    tableTitle: "Active Jobs",
    columns: ["Role", "Mode", "Applicants", "Due"],
    rows: [
      ["Senior Frontend Engineer", "Remote", "38", "Jun 20"],
      ["Product Designer", "Hybrid", "24", "Jun 24"],
      ["Backend Engineer", "On-site", "31", "Jun 28"],
    ],
    sideTitle: "Recent applications",
    sideRows: ["Ayesha Khan · Frontend", "Hassan Ali · Backend", "Zara Iqbal · Product"],
  },
};

const getRoleFromToken = (token: string): "candidate" | "company" | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(normalizedPayload));
    const role = decoded.role ?? decoded.user?.role ?? decoded.userType;

    return role === "candidate" || role === "company" ? role : null;
  } catch {
    return null;
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function ProductPreview() {
  const [previewRole, setPreviewRole] = useState<keyof typeof dashboardData>("candidate");
  const preview = dashboardData[previewRole];

  return (
    <motion.div
      className="hg-product-preview"
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.25 }}
    >
      <div className="hg-window-bar">
        <div className="hg-window-dots"><span /><span /><span /></div>
        <Text>hiregenix.dev/{preview.path}</Text>
        <div className="hg-preview-switch" aria-label="Dashboard preview">
          {(Object.keys(dashboardData) as Array<keyof typeof dashboardData>).map((role) => (
            <button
              type="button"
              key={role}
              className={previewRole === role ? "is-active" : ""}
              onClick={() => setPreviewRole(role)}
            >
              {dashboardData[role].label}
            </button>
          ))}
        </div>
      </div>

      <div className="hg-dashboard-frame">
        <aside className="hg-preview-sidebar">
          <div className="hg-preview-sidebar-title">HG</div>
          <div className="hg-preview-menu">
            {preview.menu.map((item, index) => (
              <div className={index === 0 ? "is-active" : ""} key={item} title={item}>
                {preview.menuIcons[index]}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="hg-preview-workspace">
          <div className="hg-preview-header">
            <MenuOutlined />
            <strong>{preview.title}</strong>
            <span />
          </div>

          <div className="hg-preview-content">
            <div className="hg-preview-stats">
              {preview.stats.map((stat, index) => (
                <div className="hg-preview-stat" key={stat.label}>
                  <div className="hg-preview-stat-top">
                    <span className="hg-preview-stat-icon">{index % 2 === 0 ? <FileTextOutlined /> : <BarChartOutlined />}</span>
                    <span>{stat.label}</span>
                    <ArrowUpOutlined className="hg-preview-stat-arrow" />
                  </div>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>

            <div className="hg-preview-panels">
              <div className="hg-preview-card hg-preview-table-card">
                <div className="hg-preview-card-heading">
                  <strong>{preview.tableTitle}</strong>
                  <span>View all →</span>
                </div>
                <div className="hg-preview-table">
                  <div className="hg-preview-table-row is-header">
                    {preview.columns.map((column) => <span key={column}>{column}</span>)}
                  </div>
                  {preview.rows.map((row) => (
                    <div className="hg-preview-table-row" key={row[0]}>
                      <span><strong>{row[0]}</strong><small>{previewRole === "candidate" ? "HireGenix partner" : "Mid-level · Engineering"}</small></span>
                      <span><em>{row[1]}</em></span>
                      <span><em>{row[2]}</em></span>
                      <span>{row[3]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hg-preview-card hg-preview-side-card">
                <div className="hg-preview-card-heading">
                  <strong>{preview.sideTitle}</strong>
                  <CalendarOutlined />
                </div>
                <div className="hg-preview-activity">
                  {preview.sideRows.map((item) => (
                    <div key={item}>
                      <Avatar size={30}>{previewRole === "company" ? item.split(" ").map((part) => part[0]).slice(0, 2).join("") : <CalendarOutlined />}</Avatar>
                      <span><strong>{item.split(" · ")[0]}</strong><small>{item.split(" · ")[1]}</small></span>
                      <CheckCircleOutlined />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const profile = useSelector((state: RootState) => state.user.profile);
  const [isAuthed, setIsAuthed] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/auth");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsAuthed(Boolean(token));

    const role = profile?.userType ?? (token ? getRoleFromToken(token) : null);
    if (role) setDashboardPath(`/${role}/dashboard`);
  }, [profile]);

  const themeConfig = useMemo(
    () => ({
      algorithm: themeMode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: themeMode === "dark" ? "#60a5fa" : "#1677ff",
        borderRadius: 14,
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      },
    }),
    [themeMode]
  );

  const toggleTheme = () => dispatch(setThemeMode(themeMode === "dark" ? "light" : "dark"));

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className="hg-shell" data-theme={themeMode}>
        <div className="hg-grid-bg" />
        <div className="hg-glow hg-glow-one" />
        <div className="hg-glow hg-glow-two" />

        <Header className="hg-header">
          <div className="hg-header-inner">
            <button className="hg-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <span className="hg-logo"><CloudOutlined /></span>
              <span>HireGenix</span>
            </button>

            <nav className="hg-nav" aria-label="Landing navigation">
              {navItems.map((item) => (
                <button key={item.key} onClick={() => scrollToSection(item.key)}>
                  {item.label}
                </button>
              ))}
            </nav>

            <Space size={8} className="hg-header-actions">
              <Button className="hg-desktop-header-action" icon={themeMode === "dark" ? <BulbOutlined /> : <MoonOutlined />} onClick={toggleTheme}>
                {themeMode === "dark" ? "Light" : "Dark"}
              </Button>
              <Button
                className="hg-desktop-header-action"
                type="primary"
                icon={isAuthed ? <AppstoreOutlined /> : <LoginOutlined />}
                onClick={() => router.push(isAuthed ? dashboardPath : "/auth")}
              >
                {isAuthed ? "Dashboard" : "Login"}
              </Button>
              <Button className="hg-menu-button" icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)} />
            </Space>
          </div>
        </Header>

        <Drawer
          title="HireGenix"
          placement="right"
          width={320}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {navItems.map((item) => (
              <Button key={item.key} type="text" block onClick={() => scrollToSection(item.key)}>
                {item.label}
              </Button>
            ))}
            <Divider />
            <Button block onClick={toggleTheme}>
              Switch to {themeMode === "dark" ? "light" : "dark"} mode
            </Button>
            <Button block type="primary" onClick={() => router.push(isAuthed ? dashboardPath : "/auth")}>
              {isAuthed ? "Open dashboard" : "Login"}
            </Button>
          </Space>
        </Drawer>

        <Content className="hg-content">
          <section className="hg-hero">
            <motion.div
              className="hg-hero-copy"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.65 }}
            >
              <Tag className="hg-pill" color="blue">
                AI-native hiring platform for modern teams
              </Tag>
              <Title className="hg-title">
                Hire better candidates with AI-powered interviews and talent intelligence.
              </Title>
              <Paragraph className="hg-subtitle">
                HireGenix brings job matching, verified profiles, structured interviews, and hiring analytics into one clean workflow for companies and candidates.
              </Paragraph>
              <Space size={12} wrap className="hg-hero-actions">
                <Button type="primary" size="large" onClick={() => router.push("/auth/sign-up?role=company")}>
                  Start hiring
                </Button>
                <Button size="large" onClick={() => router.push("/auth/sign-up?role=candidate")}>
                  Find roles
                </Button>
              </Space>
            </motion.div>

            <ProductPreview />

            <Row gutter={[16, 16]} className="hg-stats">
              {stats.map((stat) => (
                <Col xs={12} md={6} key={stat.label}>
                  <Card bordered={false} className="hg-stat-card">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          <section className="hg-section hg-logo-strip">
            <Text>Built for recruiting teams, startups, campus hiring, and talent operations</Text>
            <div>
              {["NovaLabs", "CloudBridge", "CoreStack", "PeakHire", "Apex Talent"].map((name) => (
                <span key={name}><GlobalOutlined /> {name}</span>
              ))}
            </div>
          </section>

          <section className="hg-section" id="features">
            <div className="hg-section-heading">
              <Tag color="blue">Features</Tag>
              <Title level={2}>Everything required to move from applicants to confident decisions.</Title>
              <Paragraph>
                The page should not just look pretty. It should explain the product fast. These sections make the value obvious.
              </Paragraph>
            </div>

            <Row gutter={[16, 16]}>
              {features.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={feature.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <Card bordered={false} className="hg-feature-card">
                      <Avatar size={46} icon={feature.icon} />
                      <Title level={4}>{feature.title}</Title>
                      <Paragraph>{feature.description}</Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </section>

          <section className="hg-section" id="platform">
            <div className="hg-section-heading">
              <Tag color="blue">One connected platform</Tag>
              <Title level={2}>Purpose-built experiences for both sides of hiring.</Title>
              <Paragraph>
                Candidates and companies work from focused dashboards while sharing one reliable hiring workflow.
              </Paragraph>
            </div>
            <Row gutter={[18, 18]} align="stretch">
              {platformCards.map((card, index) => (
                <Col xs={24} md={12} key={card.title}>
                  <motion.div
                    className="hg-platform-motion"
                    initial={{ opacity: 0, x: index === 0 ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.25 }}
                  >
                    <Card bordered={false} className="hg-platform-card">
                      <div className="hg-platform-card-top">
                        <Avatar size={48} shape="circle" icon={card.icon} />
                        <Text>{card.eyebrow}</Text>
                      </div>
                      <Title level={3}>{card.title}</Title>
                      <Paragraph>{card.description}</Paragraph>
                      <div className="hg-check-list">
                        {card.points.map((point) => (
                          <span key={point}><CheckCircleOutlined /> {point}</span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </section>

          <section className="hg-section" id="workflow">
            <div className="hg-workflow-card">
              <div className="hg-section-heading hg-left-heading">
                <Tag color="blue">Workflow</Tag>
                <Title level={2}>One connected path from profile to final decision.</Title>
                <Paragraph>
                  Every step passes structured context into the next, keeping candidates and hiring teams aligned.
                </Paragraph>
              </div>
              <motion.div
                className="hg-workflow-map"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
              >
                <motion.div
                  className="hg-workflow-line"
                  variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }}
                  transition={{ duration: 1.25, ease: "easeInOut" }}
                />
                {workflow.map((item, index) => (
                  <motion.div
                    className={`hg-workflow-node ${index % 2 === 0 ? "is-left" : "is-right"}`}
                    key={item.title}
                    variants={{
                      hidden: { opacity: 0, x: index % 2 === 0 ? -32 : 32, y: 12 },
                      visible: { opacity: 1, x: 0, y: 0 },
                    }}
                    transition={{ duration: 0.5, delay: 0.12 + index * 0.1, ease: "easeOut" }}
                  >
                    <div className="hg-workflow-node-card">
                      <div className="hg-workflow-node-head">
                        <span className="hg-workflow-icon">{item.icon}</span>
                        <span className="hg-workflow-number">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <Title level={4}>{item.title}</Title>
                      <Paragraph>{item.description}</Paragraph>
                    </div>
                    <motion.span
                      className="hg-workflow-dot"
                      animate={{ boxShadow: ["0 0 0 0 rgba(22,119,255,.45)", "0 0 0 9px rgba(22,119,255,0)"] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.18 }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <section className="hg-section" id="faq">
            <div className="hg-section-heading">
              <Tag color="blue">FAQ</Tag>
              <Title level={2}>Clear answers for serious users.</Title>
            </div>
            <Collapse bordered={false} items={faqItems} className="hg-faq" />
          </section>
        </Content>

        <Footer className="hg-footer" id="footer">
          <div>
            <Title level={4}>HireGenix</Title>
            <Paragraph>AI hiring intelligence for companies and candidates.</Paragraph>
          </div>
          <nav className="hg-footer-links" aria-label="Account links">
            <Link href="/auth">Login</Link>
            <Link href="/auth/sign-up?role=company">Company signup</Link>
            <Link href="/auth/sign-up?role=candidate">Candidate signup</Link>
          </nav>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
