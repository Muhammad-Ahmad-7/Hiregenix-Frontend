"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Input,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  Divider,
} from "antd";
import {
  CheckCircleFilled,
  CloseOutlined,
  CodeOutlined,
  GlobalOutlined,
  LinkedinFilled,
  MailOutlined,
  MessageOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
  ThunderboltFilled,
  EnvironmentOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { chatBotQueryApi } from "@/app/api/chatbot/chatbot.api";
import { getCompanyProfileWithIdApi } from "@/app/api/general/general.api";
import MarkdownMessage from "@/component/MarkdownMessage";

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

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

const TAG_COLORS = [
  "blue", "geekblue", "purple", "cyan", "green", "lime", "orange", "gold", "magenta",
] as const;

const HIRING_CONFIG: Record<
  HiringStatus,
  { label: string; tagColor: string }
> = {
  [HiringStatus.Active]: { label: "Actively Hiring", tagColor: "success" },
  [HiringStatus.Paused]: { label: "Hiring Paused", tagColor: "warning" },
  [HiringStatus.NotHiring]: { label: "Not Hiring", tagColor: "default" },
};

const QUICK_CHIPS = [
  "What tech stack do they use?",
  "Are they hiring?",
  "Where are they located?",
  "How to contact them?",
];

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function CompanyProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getCompanyProfileWithIdApi({ companyId: id })
      .then((res) => {
        if (!res || !res.data || !(res.data.company || res.data))
          throw new Error("Failed to fetch company profile.");
        const data: CompanyResponse = (res?.data?.company ?? res?.data) as CompanyResponse;
        if (!data) throw new Error("Company data not found in response.");
        setCompany(data);
        setMessages([
          {
            id: "0",
            role: "bot",
            content: `Hi! I'm the ${data.companyName} AI assistant, powered by Hiregenix. Ask me anything — tech stack, culture, hiring status, and more.`,
            timestamp: new Date(),
          },
        ]);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
    try {
      const res = await chatBotQueryApi({ query: text.trim(), companyId: id });
      const answer: string | undefined = res?.data?.answer;
      if (!answer) throw new Error("Sorry, I could not get a response. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: answer,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: err instanceof Error ? err.message : "Something went wrong.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  }

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card className="rounded-2xl shadow-md border-0">
              <Skeleton active avatar={{ size: 80, shape: "circle" }} paragraph={{ rows: 4 }} />
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {[0, 1, 2].map((i) => (
                <Card key={i} className="rounded-2xl shadow-md border-0">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
              ))}
            </Space>
          </Col>
        </Row>
      </div>
    );
  }

  // ── ERROR ──
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

  const hiringCfg = HIRING_CONFIG[company.hiringStatus as HiringStatus] ?? {
    label: company.hiringStatus ?? "Unknown",
    tagColor: "default",
  };

  // ── PAGE ──
  return (
    <div className=" bg-gray-50 p-3 lg:p-4">

      {/* ── Brand Bar ── */}
      <div
        className="mb-5  py-2.5 rounded-2xl flex items-center justify-between"

      >
        <div className="flex items-center justify-center gap-2.5">
          <span className="text-xl font-bold" style={{ color: "#0958d9" }}>
            Hiregenix
          </span>
          <Tag
            className="!rounded-full !text-[10px] !font-semibold hidden sm:inline-flex"
          >
            AI-POWERED RECRUITMENT
          </Tag>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Companies</span>
          <span>/</span>
          <span className="text-gray-600 font-medium">{company.companyName}</span>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <Row gutter={[24, 24]}>

        {/* ── LEFT SIDEBAR (mirrors file 2 sidebar card) ── */}
        <Col xs={24} lg={8}>
          <div className="sticky top-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="rounded-2xl shadow-md border-0">
                <Space direction="vertical" style={{ width: "100%" }} size="large">

                  {/* Avatar + name + hiring status */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {company.logoUrl ? (
                        <Avatar
                          size={80}
                          src={company.logoUrl}
                          style={{ border: "3px solid #e6f7ff" }}
                        />
                      ) : (
                        <Avatar
                          size={80}
                          style={{
                            backgroundColor: "#1890FF",
                            border: "3px solid #e6f7ff",
                            fontSize: 28,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(company.companyName)}
                        </Avatar>
                      )}
                      {company.isVerified && (
                        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                          <CheckCircleFilled className="text-blue-500 text-sm" />
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <Title level={4} className="!mb-0 !leading-tight">
                          {company.companyName}
                        </Title>
                        {company.isVerified && (
                          <Tag
                            className="!rounded-full !text-[10px] !font-semibold !px-2 !border-0"
                            style={{ background: "#e6f4ff", color: "#1677ff" }}
                          >
                            <SafetyCertificateOutlined className="mr-0.5" />
                            Verified
                          </Tag>
                        )}
                      </div>
                      <Tag
                        color={hiringCfg.tagColor}
                        className="!rounded-full !font-medium"
                      >
                        {hiringCfg.label}
                      </Tag>
                    </div>
                  </div>

                  <Divider className="!my-0" />

                  {/* Info rows — mirrors file 2 info cards */}
                  <Row gutter={[12, 12]}>
                    <Col xs={24}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                        <EnvironmentOutlined className="text-blue-600 text-lg flex-shrink-0" />
                        <div>
                          <Text type="secondary" className="text-xs block">Location</Text>
                          <Text strong>{company.city}, {company.country}</Text>
                        </div>
                      </div>
                    </Col>

                    {company.foundedYear && (
                      <Col xs={24}>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                          <CalendarOutlined className="text-purple-600 text-lg flex-shrink-0" />
                          <div>
                            <Text type="secondary" className="text-xs block">Founded</Text>
                            <Text strong>{company.foundedYear}</Text>
                          </div>
                        </div>
                      </Col>
                    )}

                    <Col xs={24}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                        <MailOutlined className="text-cyan-600 text-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <Text type="secondary" className="text-xs block">Contact Email</Text>
                          <Text strong ellipsis>
                            <a href={`mailto:${company.contactEmail}`} className="text-cyan-700 hover:text-cyan-500">
                              {company.contactEmail}
                            </a>
                          </Text>
                        </div>
                      </div>
                    </Col>

                    {/* {company.ntnNumber && (
                      <Col xs={24}>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50">
                          <SafetyCertificateOutlined className="text-orange-500 text-lg flex-shrink-0" />
                          <div>
                            <Text type="secondary" className="text-xs block">NTN Number</Text>
                            <Text strong className="font-mono">{company.ntnNumber}</Text>
                          </div>
                        </div>
                      </Col>
                    )} */}
                  </Row>

                  <Divider className="!my-0" />

                  {/* Quick Links */}
                  <div>
                    <Text strong className="block mb-2">Quick Links</Text>
                    <Space wrap>
                      {company.website && (
                        <Button
                          type="text"
                          icon={<GlobalOutlined />}
                          onClick={() => window.open(company.website, "_blank")}
                          className="!text-blue-600 !border !border-blue-200 !rounded-full hover:!bg-blue-50"
                        >
                          Website
                        </Button>
                      )}
                      {company.linkedInUrl && (
                        <Button
                          type="text"
                          icon={<LinkedinFilled />}
                          onClick={() => window.open(company.linkedInUrl, "_blank")}
                          className="!text-[#0A66C2] !border !border-blue-200 !rounded-full hover:!bg-blue-50"
                        >
                          LinkedIn
                        </Button>
                      )}
                      {!company.website && !company.linkedInUrl && (
                        <Text type="secondary">No links available</Text>
                      )}
                    </Space>
                  </div>

                </Space>
              </Card>
            </motion.div>
          </div>
        </Col>

        {/* ── RIGHT CONTENT (mirrors file 2 detail cards) ── */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <Card className="rounded-2xl shadow-md border-0">
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <Title level={5} className="!mb-0">About Company</Title>
                  <Paragraph className="!mb-0 text-gray-600 leading-relaxed">
                    {company.description || (
                      <Text type="secondary">No description available.</Text>
                    )}
                  </Paragraph>
                </Space>
              </Card>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
            >
              <Card className="rounded-2xl shadow-md border-0">
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <div className="flex items-center justify-between">
                    <Title level={5} className="!mb-0">
                      <CodeOutlined className="mr-2 text-blue-500" />
                      Tech Stack
                    </Title>
                    <Tag
                      className="!rounded-full !font-mono !text-sm"
                    >
                      {company.techStack.length}
                    </Tag>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {company.techStack.length > 0 ? (
                      company.techStack.map((tech, i) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.75 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.18 + i * 0.03, duration: 0.18 }}
                        >
                          <Tag
                            color={TAG_COLORS[i % TAG_COLORS.length]}
                            className="!rounded-lg !font-medium !text-xs !cursor-default"
                          >
                            {tech}
                          </Tag>
                        </motion.div>
                      ))
                    ) : (
                      <Text type="secondary">No tech stack listed.</Text>
                    )}
                  </div>
                </Space>
              </Card>
            </motion.div>

            {/* Additional Info row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <Row gutter={[16, 16]}>
                {company.ntnNumber && (
                  <Col xs={24} sm={12}>
                    <Card className="rounded-2xl shadow-md border-0 h-full">
                      <Text type="secondary" className="text-sm block mb-1">NTN Number</Text>
                      <Title level={5} className="!mt-0 !mb-0 font-mono">{company.ntnNumber}</Title>
                    </Card>
                  </Col>
                )}
                {(company.website || company.linkedInUrl) && (
                  <Col xs={24} sm={company.ntnNumber ? 12 : 24}>
                    <Card className="rounded-2xl shadow-md border-0 h-full">
                      <Text type="secondary" className="text-sm block mb-2">Official Links</Text>
                      <Space wrap>
                        {company.website && (
                          <Button
                            type="text"
                            icon={<GlobalOutlined />}
                            onClick={() => window.open(company.website, "_blank")}
                            className="!text-blue-600 !px-0"
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </Button>
                        )}
                        {company.linkedInUrl && (
                          <Button
                            type="text"
                            icon={<LinkedinFilled />}
                            onClick={() => window.open(company.linkedInUrl, "_blank")}
                            className="!text-[#0A66C2] !px-0"
                          >
                            LinkedIn
                          </Button>
                        )}
                      </Space>
                    </Card>
                  </Col>
                )}
              </Row>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400"
            >
              <ThunderboltFilled style={{ color: "#1677ff", fontSize: 10 }} />
              <span>
                Powered by{" "}
                <span className="font-semibold" style={{ color: "#1677ff" }}>Hiregenix</span>
                {" "}· AI-Powered Recruitment
              </span>
            </motion.div>

          </Space>
        </Col>
      </Row>

      {/* ══════════════════════════════════════
          FLOATING CHAT — unchanged from original
      ══════════════════════════════════════ */}
      <div>
        {/* FAB */}
        <AnimatePresence>
          {!chatOpen && (
            <motion.button
              key="fab"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={() => setChatOpen(true)}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border-0"
              style={{
                background: "linear-gradient(135deg,#1677ff,#0958d9)",
                boxShadow: "0 6px 24px rgba(22,119,255,0.45)",
              }}
            >
              <MessageOutlined className="text-white text-xl" />
              <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Popup chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              key="chatpopup"
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="chatbot-panel fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl overflow-hidden"
              style={{
                width: "min(calc(100vw - 2rem),380px)",
                height: "min(calc(100vh - 5rem),560px)",
                boxShadow: "0 8px 40px rgba(22,119,255,0.22),0 2px 10px rgba(0,0,0,0.1)",
                background: "var(--chatbot-panel-bg)",
              }}
            >
              <ChatPanel
                company={company}
                messages={messages}
                inputText={inputText}
                isTyping={isTyping}
                showChips={showChips}
                bottomRef={bottomRef}
                onInput={setInputText}
                onSend={sendMessage}
                onKey={handleKey}
                onClose={() => setChatOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHAT PANEL — completely unchanged from original
// ─────────────────────────────────────────────

interface ChatPanelProps {
  company: CompanyResponse;
  messages: ChatMessage[];
  inputText: string;
  isTyping: boolean;
  showChips: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
  onInput: (val: string) => void;
  onSend: (text: string) => void;
  onKey: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onClose?: () => void;
}

function ChatPanel({
  company,
  messages,
  inputText,
  isTyping,
  showChips,
  bottomRef,
  onInput,
  onSend,
  onKey,
  onClose,
}: ChatPanelProps) {
  return (
    <div className="h-full w-full flex flex-col min-h-0">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1677ff 0%,#0958d9 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <RobotOutlined className="text-white" style={{ fontSize: 14 }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white leading-tight">AI Assistant</p>
              <span className="text-[9px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                HIREGENIX
              </span>
            </div>
            <p className="text-xs text-blue-100 truncate">Ask anything about {company.companyName}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-emerald-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors cursor-pointer border-0"
              >
                <CloseOutlined className="text-white" style={{ fontSize: 11 }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot-scroll flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.18 }}
              className={`flex items-end gap-1.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                style={
                  isUser
                    ? { background: "var(--chatbot-user-bubble)", color: "white" }
                    : {
                      background: "var(--chatbot-bot-chip-bg)",
                      color: "var(--chatbot-accent)",
                      border: "1px solid var(--chatbot-bot-chip-border)",
                    }
                }
              >
                {isUser
                  ? <UserOutlined style={{ fontSize: 9 }} />
                  : <RobotOutlined style={{ fontSize: 9 }} />}
              </div>
              <div className={`max-w-[82%] flex flex-col gap-0.5 ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className="rounded-2xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    isUser
                      ? {
                        background: "var(--chatbot-user-gradient)",
                        color: "white",
                        borderBottomRightRadius: 4,
                        boxShadow: "0 2px 8px rgba(22,119,255,0.28)",
                      }
                      : {
                        background: "var(--chatbot-bot-bubble)",
                        color: "var(--chatbot-bot-text)",
                        borderBottomLeftRadius: 4,
                        border: "1px solid var(--chatbot-bot-border)",
                        boxShadow: "0 1px 4px rgba(22,119,255,0.06)",
                      }
                  }
                >
                  {msg.role === "bot"
                    ? <MarkdownMessage content={msg.content} />
                    : msg.content
                  }
                </div>
                <Text className="!text-[9px] !text-gray-400 px-1">{formatTime(msg.timestamp)}</Text>
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--chatbot-bot-chip-bg)",
                  border: "1px solid var(--chatbot-bot-chip-border)",
                }}
              >
                <RobotOutlined style={{ fontSize: 9, color: "#1677ff" }} />
              </div>
              <div
                className="rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1 items-center"
                style={{
                  background: "var(--chatbot-bot-bubble)",
                  border: "1px solid var(--chatbot-bot-border)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full block"
                    style={{ background: "#1677ff" }}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showChips && !isTyping && messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-1.5 mt-1"
            >
              <Text className="!text-[9px] !text-gray-400 uppercase tracking-wider px-1">
                Suggested
              </Text>
              <div className="flex flex-wrap gap-1">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => onSend(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-full cursor-pointer transition-all duration-150 font-medium"
                    style={{
                      background: "var(--chatbot-chip-bg)",
                      border: "1px solid var(--chatbot-chip-border)",
                      color: "var(--chatbot-accent)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--chatbot-chip-hover)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--chatbot-chip-bg)";
                    }}
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
      <div className="chatbot-input flex-shrink-0 px-3 py-2.5">
        <div className="flex gap-2 items-end">
          <Input.TextArea
            value={inputText}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask about the company..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            className="!rounded-xl !text-xs"
            style={{ borderColor: "var(--chatbot-chip-border)" }}
            disabled={isTyping}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => onSend(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="!rounded-xl !h-8 !w-8 !min-w-0 !p-0 !flex !items-center !justify-center !border-0 flex-shrink-0"
            style={{
              background:
                inputText.trim() && !isTyping
                  ? "linear-gradient(135deg,#1677ff,#0958d9)"
                  : undefined,
            }}
          />
        </div>
        <p className="text-[9px] text-gray-300 mt-1 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Footer */}
      <div className="chatbot-footer flex-shrink-0 flex items-center justify-center gap-1 py-1.5">
        <ThunderboltFilled style={{ color: "#1677ff", fontSize: 9 }} />
        <span className="text-[9px] text-gray-400">
          Powered by{" "}
          <span className="font-semibold" style={{ color: "#1677ff" }}>Hiregenix AI</span>
        </span>
      </div>
    </div>
  );
}