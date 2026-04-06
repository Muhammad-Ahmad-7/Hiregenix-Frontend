"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Input,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CodeOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  MailOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Role = "admin" | "candidate" | "company";

enum HiringStatus {
  Active = "active",
  Paused = "paused",
  NotHiring = "not_hiring",
}

interface UserDetail {
  _id: string;
  email: string;
  role: Role;
}

interface CompanyResponse {
  _id: string;
  companyName: string;
  city: string;
  country: string;
  foundedYear: number;
  ntnNumber: string;
  logoUrl: string;
  website: string;
  description: string;
  contactEmail: string;
  linkedInUrl: string;
  techStack: string[];
  hiringStatus: HiringStatus;
  userId: UserDetail;
  isVerified: boolean;
  isDeleted: boolean | string;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────

const MOCK_COMPANIES: Record<string, CompanyResponse> = {
  cmp_001: {
    _id: "cmp_001",
    companyName: "TechCraft Solutions",
    city: "Lahore",
    country: "Pakistan",
    foundedYear: 2017,
    ntnNumber: "1234567-8",
    logoUrl: "",
    website: "https://techcraft.io",
    description:
      "TechCraft Solutions is a product-led engineering firm specializing in cloud-native SaaS platforms and distributed systems. We partner with mid-market enterprises to modernize legacy infrastructure, accelerate deployment cycles, and build scalable data pipelines. Our team of 120+ engineers operates across Pakistan, UAE, and the UK, delivering high-impact engineering outcomes with a relentless focus on reliability and developer experience.",
    contactEmail: "contact@techcraft.io",
    linkedInUrl: "https://linkedin.com/company/techcraft",
    techStack: [
      "TypeScript",
      "Node.js",
      "React",
      "Next.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "Kubernetes",
      "AWS",
      "Terraform",
      "GraphQL",
    ],
    hiringStatus: HiringStatus.Active,
    userId: { _id: "usr_001", email: "admin@techcraft.io", role: "company" },
    isVerified: true,
    isDeleted: false,
    isProfileCompleted: true,
    createdAt: "2023-03-15T09:00:00.000Z",
    updatedAt: "2024-11-20T14:30:00.000Z",
    __v: 0,
  },
  cmp_002: {
    _id: "cmp_002",
    companyName: "NexaVision AI",
    city: "Karachi",
    country: "Pakistan",
    foundedYear: 2020,
    ntnNumber: "9876543-2",
    logoUrl: "",
    website: "https://nexavision.ai",
    description:
      "NexaVision AI is a cutting-edge artificial intelligence startup building vision-based automation tools for manufacturing and logistics. We leverage deep learning and computer vision to help industries reduce defects, optimize workflows, and achieve operational excellence at scale.",
    contactEmail: "hello@nexavision.ai",
    linkedInUrl: "https://linkedin.com/company/nexavision",
    techStack: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "OpenCV",
      "FastAPI",
      "React",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Kafka",
    ],
    hiringStatus: HiringStatus.Paused,
    userId: { _id: "usr_002", email: "admin@nexavision.ai", role: "company" },
    isVerified: false,
    isDeleted: false,
    isProfileCompleted: true,
    createdAt: "2023-07-01T10:00:00.000Z",
    updatedAt: "2024-10-05T11:00:00.000Z",
    __v: 0,
  },
};

// ─────────────────────────────────────────────
// MOCK API
// ─────────────────────────────────────────────

async function fetchCompanyById(id: string): Promise<CompanyResponse> {
  await new Promise((r) => setTimeout(r, 900));
  const company = MOCK_COMPANIES[id];
  if (!company) throw new Error(`No company found with id "${id}".`);
  return company;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TAG_COLORS = [
  "blue",
  "geekblue",
  "purple",
  "cyan",
  "green",
  "lime",
  "orange",
  "gold",
  "magenta",
] as const;

const HIRING_CONFIG: Record<HiringStatus, { label: string; dotColor: string }> =
  {
    [HiringStatus.Active]: { label: "Actively Hiring", dotColor: "#52c41a" },
    [HiringStatus.Paused]: { label: "Hiring Paused", dotColor: "#faad14" },
    [HiringStatus.NotHiring]: { label: "Not Hiring", dotColor: "#d9d9d9" },
  };

const QUICK_CHIPS = [
  "What tech stack do they use?",
  "Are they hiring?",
  "Where are they located?",
  "How to contact them?",
];

function getBotResponse(message: string, company: CompanyResponse): string {
  const q = message.toLowerCase();
  if (q.match(/tech|stack|language|framework/))
    return `${company.companyName} uses: ${company.techStack.join(", ")}.`;
  if (q.match(/location|where|city|country|based/))
    return `${company.companyName} is based in ${company.city}, ${company.country}.`;
  if (q.match(/contact|email|reach|mail/))
    return `You can reach them at ${company.contactEmail}.`;
  if (q.match(/website|site|url|link/))
    return `Their website is ${company.website}.`;
  if (q.match(/linkedin/)) return `LinkedIn: ${company.linkedInUrl}`;
  if (q.match(/founded|year|old|started/))
    return `${company.companyName} was founded in ${company.foundedYear}.`;
  if (q.match(/hiring|job|career|work|vacancy/)) {
    const map: Record<string, string> = {
      active: `${company.companyName} is actively hiring! Visit their website for openings.`,
      paused: `${company.companyName} has paused hiring for now. Check back later.`,
      not_hiring: `${company.companyName} is not currently hiring.`,
    };
    return map[company.hiringStatus] ?? "Hiring status unknown.";
  }
  if (q.match(/verified|legit|trust/))
    return company.isVerified
      ? `Yes, ${company.companyName} is a verified company on our platform.`
      : `${company.companyName} has not been verified yet.`;
  if (q.match(/about|describe|who are/))
    return company.description.slice(0, 220) + "…";
  return `I can answer questions about ${company.companyName}'s tech stack, location, contact info, hiring, and more. What would you like to know?`;
}

// ─────────────────────────────────────────────
// MAIN PAGE  →  /company/[id]/page.tsx
// ─────────────────────────────────────────────

export default function CompanyProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  // ── data state ──
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── chat state ──
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── fetch company ──
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCompanyById(id)
      .then((data) => {
        setCompany(data);
        setMessages([
          {
            id: "0",
            role: "bot",
            content: `Hi! I'm the ${data.companyName} assistant. Ask me anything about the company — tech stack, location, hiring, and more.`,
            timestamp: new Date(),
          },
        ]);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── auto-scroll chat ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── send message ──
  async function sendMessage(text: string) {
    if (!text.trim() || isTyping || !company) return;
    setShowChips(false);
    setInputText("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
    setIsTyping(false);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      content: getBotResponse(text, company),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  }

  // ─────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {[80, 120, 100, 80].map((h, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6">
                <Skeleton
                  active
                  avatar={i === 0 ? { size: 80, shape: "square" } : undefined}
                  paragraph={{ rows: Math.round(h / 25) }}
                />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 h-[560px]">
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────
  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert
          type="error"
          showIcon
          message="Company Not Found"
          description={error ?? "Unknown error occurred."}
          className="!rounded-2xl !shadow-md max-w-md w-full"
        />
      </div>
    );
  }

  const hiringCfg = HIRING_CONFIG[company.hiringStatus];

  // ─────────────────────────────────────────
  // PAGE
  // ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* ══════════════════════════════
              LEFT COLUMN  (profile)
          ══════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* ── HEADER CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="!rounded-2xl !shadow-md !border-gray-100 hover:!shadow-lg transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Logo */}
                  <div className="relative flex-shrink-0">
                    {company.logoUrl ? (
                      <Avatar
                        size={80}
                        src={company.logoUrl}
                        className="!border !border-gray-100 !shadow-sm !rounded-xl"
                      />
                    ) : (
                      <Avatar
                        size={80}
                        className="!text-blue-700 !font-semibold !text-2xl !rounded-xl !border !border-blue-100"
                        style={{ backgroundColor: "#EFF6FF" }}
                      >
                        {getInitials(company.companyName)}
                      </Avatar>
                    )}
                    {company.isVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircleFilled className="text-blue-500 text-base" />
                      </span>
                    )}
                  </div>

                  {/* Name + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Title
                        level={3}
                        className="!mb-0 !text-gray-900 !font-semibold"
                        style={{ lineHeight: 1.2 }}
                      >
                        {company.companyName}
                      </Title>
                      {company.isVerified && (
                        <Tag
                          color="blue"
                          className="!rounded-full !text-xs !font-medium !px-2.5 !py-0.5"
                        >
                          Verified
                        </Tag>
                      )}
                    </div>
                    <Text className="text-gray-500 text-sm block mb-3">
                      {company.city}, {company.country}&nbsp;·&nbsp;Founded{" "}
                      {company.foundedYear}
                    </Text>
                    <Badge color={hiringCfg.dotColor} text={hiringCfg.label} />
                  </div>

                  {/* NTN */}
                  <div className="flex-shrink-0 hidden md:flex flex-col items-end gap-1">
                    <Text className="text-[10px] text-gray-400 uppercase tracking-widest">
                      NTN
                    </Text>
                    <code className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-gray-600 font-mono">
                      {company.ntnNumber}
                    </code>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* ── ABOUT CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="!rounded-2xl !shadow-md !border-gray-100 hover:!shadow-lg transition-shadow duration-200">
                <Title
                  level={5}
                  className="!text-gray-800 !mb-3 !font-semibold"
                >
                  About
                </Title>
                <Paragraph className="!text-gray-600 !text-sm !leading-relaxed !mb-0">
                  {company.description}
                </Paragraph>
              </Card>
            </motion.div>

            {/* ── TECH STACK CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Card className="!rounded-2xl !shadow-md !border-gray-100 hover:!shadow-lg transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <CodeOutlined className="text-blue-500" />
                  <Title
                    level={5}
                    className="!text-gray-800 !mb-0 !font-semibold"
                  >
                    Tech Stack
                  </Title>
                  <span className="ml-auto text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5 font-mono">
                    {company.techStack.length} technologies
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.techStack.map((tech, i) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.04, duration: 0.22 }}
                    >
                      <Tag
                        color={TAG_COLORS[i % TAG_COLORS.length]}
                        className="!rounded-full !text-xs !font-medium !px-3 !py-1 !cursor-default hover:!opacity-75 transition-opacity"
                      >
                        {tech}
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* ── CONTACT + META CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="!rounded-2xl !shadow-md !border-gray-100 hover:!shadow-lg transition-shadow duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact */}
                  <div>
                    <Title
                      level={5}
                      className="!text-gray-800 !mb-1 !font-semibold"
                    >
                      Contact
                    </Title>
                    <Divider className="!my-3 !border-gray-100" />
                    {[
                      {
                        icon: <MailOutlined />,
                        label: "Email",
                        value: company.contactEmail,
                        href: `mailto:${company.contactEmail}`,
                      },
                      {
                        icon: <GlobalOutlined />,
                        label: "Website",
                        value: company.website.replace(/^https?:\/\//, ""),
                        href: company.website,
                      },
                      {
                        icon: <LinkedinOutlined />,
                        label: "LinkedIn",
                        value: company.linkedInUrl.replace(/^https?:\/\//, ""),
                        href: company.linkedInUrl,
                      },
                    ].map(({ icon, label, value, href }) => (
                      <div key={label}>
                        <div className="flex items-start gap-3 py-2.5">
                          <span className="text-gray-400 mt-0.5 flex-shrink-0">
                            {icon}
                          </span>
                          <div className="min-w-0">
                            <Text className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                              {label}
                            </Text>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors break-all font-medium"
                            >
                              {value}
                            </a>
                          </div>
                        </div>
                        <Divider className="!my-0 !border-gray-50" />
                      </div>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div>
                    <Title
                      level={5}
                      className="!text-gray-800 !mb-1 !font-semibold"
                    >
                      Metadata
                    </Title>
                    <Divider className="!my-3 !border-gray-100" />
                    <div className="flex flex-col gap-4">
                      {[
                        {
                          icon: <CalendarOutlined />,
                          label: "Created",
                          value: formatDate(company.createdAt),
                        },
                        {
                          icon: <ClockCircleOutlined />,
                          label: "Last Updated",
                          value: formatDate(company.updatedAt),
                        },
                      ].map(({ icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-gray-400">{icon}</span>
                          <div>
                            <Text className="text-[10px] text-gray-400 uppercase tracking-wider block">
                              {label}
                            </Text>
                            <Text className="text-sm text-gray-700">
                              {value}
                            </Text>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">
                          <UserOutlined />
                        </span>
                        <div>
                          <Text className="text-[10px] text-gray-400 uppercase tracking-wider block">
                            Account Email
                          </Text>
                          <Text className="text-sm text-gray-700">
                            {company.userId.email}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ══════════════════════════════
              RIGHT COLUMN  (chatbot)
          ══════════════════════════════ */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col lg:sticky lg:top-6"
              style={{ height: 580 }}
            >
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <RobotOutlined className="text-blue-500 text-base" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    Company Assistant
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Ask anything about {company.companyName}
                  </p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 font-medium flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Online
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${isUser ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                      >
                        {isUser ? (
                          <UserOutlined style={{ fontSize: 11 }} />
                        ) : (
                          <RobotOutlined style={{ fontSize: 11 }} />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            isUser
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-gray-50 border border-gray-100 text-gray-700 rounded-bl-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <Text className="!text-[10px] !text-gray-400 px-1">
                          {formatTime(msg.timestamp)}
                        </Text>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <RobotOutlined
                          style={{ fontSize: 11, color: "#6b7280" }}
                        />
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gray-400 block"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick chips */}
                <AnimatePresence>
                  {showChips && !isTyping && messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-2 mt-1"
                    >
                      <Text className="!text-[10px] !text-gray-400 uppercase tracking-wider px-1">
                        Suggested questions
                      </Text>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => sendMessage(chip)}
                            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-150 cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                <div className="flex gap-2 items-end">
                  <Input.TextArea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about the company..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    className="!rounded-xl !text-sm !border-gray-200 focus:!border-blue-400"
                    disabled={isTyping}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => sendMessage(inputText)}
                    disabled={!inputText.trim() || isTyping}
                    className="!rounded-xl !h-9 !w-9 !min-w-0 !p-0 !flex !items-center !justify-center !bg-blue-600 hover:!bg-blue-700 !border-0 flex-shrink-0"
                  />
                </div>
                <p className="text-[10px] text-gray-300 mt-1.5 text-center">
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
