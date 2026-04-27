"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useParams } from "next/navigation";
import { Alert, Avatar, Button, Input, Skeleton, Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  CloseOutlined,
  CodeOutlined,
  GlobalOutlined,
  LinkedinOutlined,
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

const HIRING_CONFIG: Record<
  HiringStatus,
  { label: string; dotColor: string; bg: string; text: string }
> = {
  [HiringStatus.Active]: {
    label: "Actively Hiring",
    dotColor: "#10b981",
    bg: "#ecfdf5",
    text: "#065f46",
  },
  [HiringStatus.Paused]: {
    label: "Hiring Paused",
    dotColor: "#f59e0b",
    bg: "#fffbeb",
    text: "#92400e",
  },
  [HiringStatus.NotHiring]: {
    label: "Not Hiring",
    dotColor: "#9ca3af",
    bg: "#f3f4f6",
    text: "#374151",
  },
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

  // chat
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
        if (!res || !res.data || !(res.data.company || res.data)) {
          throw new Error("Failed to fetch company profile.");
        }
        const data: CompanyResponse = (res?.data?.company ??
          res?.data) as CompanyResponse;

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
      if (!answer) {
        throw new Error("Sorry, I could not get a response. Please try again.");
      }
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
      <div
        className="h-screen w-screen overflow-hidden flex flex-col p-4 lg:p-5"
        style={{
          background:
            "linear-gradient(150deg,#f0f7ff 0%,#fff 55%,#e8f2ff 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-200 animate-pulse" />
          <div className="w-28 h-4 rounded bg-blue-100 animate-pulse" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
                <Skeleton
                  active
                  avatar={i === 0 ? { size: 60, shape: "square" } : undefined}
                  paragraph={{ rows: 2 }}
                />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (error || !company) {
    return (
      <div
        className="h-screen w-screen overflow-hidden flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg,#f0f7ff 0%,#fff 100%)" }}
      >
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
    dotColor: "#9ca3af",
    bg: "#f3f4f6",
    text: "#374151",
  };

  // ── PAGE ──
  return (
    // FIX 1: Root must be h-screen overflow-hidden flex flex-col — already correct
    <div
      className="h-screen w-screen overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(150deg,#f0f7ff 0%,#fff 55%,#e8f2ff 100%)",
      }}
    >
      {/* ── Brand Bar ── */}
      <div
        className="flex-shrink-0 px-5 lg:px-8 py-2.5 flex items-center justify-between"
        style={{
          borderBottom: "1px solid #e6f0ff",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg,#1677ff,#0958d9)" }}
          >
            <ThunderboltFilled
              className="text-white"
              style={{ fontSize: 13 }}
            />
          </div>
          <span
            className="text-base font-bold"
            style={{ color: "#0958d9", letterSpacing: "-0.025em" }}
          >
            Hiregenix
          </span>
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline"
            style={{
              background: "#e6f4ff",
              color: "#1677ff",
              border: "1px solid #bae0ff",
            }}
          >
            AI-POWERED RECRUITMENT
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">
            Companies
          </span>
          <span>/</span>
          <span className="text-gray-600 font-medium">
            {company.companyName}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      {/*
        FIX 2: Body wrapper is flex-1 min-h-0 — this is critical.
        flex-1 makes it fill remaining space, min-h-0 allows it to shrink
        below content size (without this, flex children expand infinitely).
      */}
      <div className="flex-1 min-h-0 overflow-hidden px-4 lg:px-6 py-3">
        {/*
          FIX 3: motion.div grid also needs min-h-0 AND h-full.
          h-full fills the parent, min-h-0 prevents grid rows from overflowing.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* LEFT — scrollable profile column */}
          {/*
            FIX 4: Left column needs min-h-0 so it doesn't stretch the grid row.
            overflow-y-auto handles the internal scroll.
          */}
          <div
            className="lg:col-span-2 h-full min-h-0 overflow-y-auto flex flex-col gap-3 pb-2 pr-0.5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#bae0ff transparent",
            }}
          >
            {/* HERO */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="rounded-2xl overflow-hidden bg-white"
                style={{
                  boxShadow:
                    "0 2px 14px rgba(22,119,255,0.09),0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="h-14 relative"
                  style={{
                    background:
                      "linear-gradient(120deg,#1677ff 0%,#4096ff 50%,#69b1ff 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle,white 1px,transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                </div>
                <div className="px-5 pb-4">
                  <div className="flex items-end justify-between -mt-7 mb-3">
                    <div className="relative">
                      {company.logoUrl ? (
                        <Avatar
                          size={56}
                          src={company.logoUrl}
                          className="!border-4 !border-white !shadow-lg !rounded-xl"
                        />
                      ) : (
                        <Avatar
                          size={56}
                          className="!text-blue-700 !font-bold !text-lg !rounded-xl !border-4 !border-white !shadow-lg"
                          style={{ backgroundColor: "#dbeeff" }}
                        >
                          {getInitials(company.companyName)}
                        </Avatar>
                      )}
                      {company.isVerified && (
                        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                          <CheckCircleFilled className="text-blue-500 text-xs" />
                        </span>
                      )}
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: hiringCfg.bg,
                        color: hiringCfg.text,
                        border: `1px solid ${hiringCfg.dotColor}33`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{
                          background: hiringCfg.dotColor,
                          boxShadow:
                            hiringCfg.dotColor === "10b981"
                              ? `0 0 0 3px ${hiringCfg.dotColor}33`
                              : "none",
                        }}
                      />
                      {hiringCfg.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Title
                          level={4}
                          className="!mb-0 !text-gray-900 !font-bold"
                          style={{
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            fontSize: 18,
                          }}
                        >
                          {company.companyName}
                        </Title>
                        {company.isVerified && (
                          <Tag
                            className="!rounded-full !text-[10px] !font-semibold !px-2 !py-0 !border-0"
                            style={{ background: "#e6f4ff", color: "#1677ff" }}
                          >
                            <SafetyCertificateOutlined className="mr-0.5" />
                            Verified
                          </Tag>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <EnvironmentOutlined
                            className="text-blue-400"
                            style={{ fontSize: 10 }}
                          />
                          {company.city}, {company.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarOutlined
                            className="text-blue-400"
                            style={{ fontSize: 10 }}
                          />
                          Founded {company.foundedYear}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <Text className="!text-[9px] !text-gray-400 !uppercase !tracking-widest !block !mb-0.5">
                        NTN
                      </Text>
                      <code
                        className="text-xs rounded-lg px-2.5 py-1 text-gray-600 font-mono"
                        style={{
                          background: "#f8faff",
                          border: "1px solid #e6f0ff",
                        }}
                      >
                        {company.ntnNumber}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ABOUT */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <div
                className="rounded-2xl p-4 bg-white"
                style={{
                  boxShadow:
                    "0 2px 10px rgba(22,119,255,0.07),0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ background: "#e6f4ff" }}
                  >
                    <span
                      style={{
                        color: "#1677ff",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      ✦
                    </span>
                  </div>
                  <Title
                    level={5}
                    className="!text-gray-800 !mb-0 !font-semibold"
                    style={{ fontSize: 12 }}
                  >
                    About
                  </Title>
                </div>
                <Paragraph className="!text-gray-600 !text-xs !leading-relaxed !mb-0 line-clamp-3">
                  {company.description}
                </Paragraph>
              </div>
            </motion.div>

            {/* TECH STACK */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.13 }}
            >
              <div
                className="rounded-2xl p-4 bg-white"
                style={{
                  boxShadow:
                    "0 2px 10px rgba(22,119,255,0.07),0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ background: "#e6f4ff" }}
                  >
                    <CodeOutlined style={{ color: "#1677ff", fontSize: 10 }} />
                  </div>
                  <Title
                    level={5}
                    className="!text-gray-800 !mb-0 !font-semibold"
                    style={{ fontSize: 12 }}
                  >
                    Tech Stack
                  </Title>
                  <span
                    className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: "#f0f7ff",
                      color: "#1677ff",
                      border: "1px solid #bae0ff",
                    }}
                  >
                    {company.techStack.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {company.techStack.map((tech, i) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.03, duration: 0.18 }}
                    >
                      <Tag
                        color={TAG_COLORS[i % TAG_COLORS.length]}
                        className="!rounded-full !text-[11px] !font-medium !px-2.5 !py-0 !cursor-default"
                      >
                        {tech}
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CONTACT */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
            >
              <div
                className="rounded-2xl p-4 bg-white"
                style={{
                  boxShadow:
                    "0 2px 10px rgba(22,119,255,0.07),0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ background: "#e6f4ff" }}
                  >
                    <MailOutlined style={{ color: "#1677ff", fontSize: 10 }} />
                  </div>
                  <Title
                    level={5}
                    className="!text-gray-800 !mb-0 !font-semibold"
                    style={{ fontSize: 12 }}
                  >
                    Contact & Links
                  </Title>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      icon: <MailOutlined />,
                      label: "Email",
                      value: company.contactEmail,
                      href: `mailto:${company.contactEmail}`,
                      color: "#1677ff",
                      bg: "#e6f4ff",
                    },
                    {
                      icon: <GlobalOutlined />,
                      label: "Website",
                      value: company.website.replace(/^https?:\/\//, ""),
                      href: company.website,
                      color: "#0958d9",
                      bg: "#dbeeff",
                    },
                    {
                      icon: <LinkedinOutlined />,
                      label: "LinkedIn",
                      value: company.linkedInUrl.replace(/^https?:\/\//, ""),
                      href: company.linkedInUrl,
                      color: "#0a66c2",
                      bg: "#e8f0fe",
                    },
                  ].map(({ icon, label, value, href, color, bg }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl transition-all duration-150 hover:scale-[1.02]"
                      style={{
                        background: "#f8faff",
                        border: "1px solid #e6f0ff",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = bg;
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = color + "55";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "#f8faff";
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "#e6f0ff";
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs"
                        style={{ background: bg, color }}
                      >
                        {icon}
                      </span>
                      <div className="min-w-0">
                        <Text className="!text-[9px] !text-gray-400 !uppercase !tracking-wider !block">
                          {label}
                        </Text>
                        <Text
                          className="!text-[11px] !font-medium !truncate !block"
                          style={{ color }}
                        >
                          {value}
                        </Text>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1.5 py-1 text-xs text-gray-400"
            >
              <ThunderboltFilled style={{ color: "#1677ff", fontSize: 9 }} />
              <span>
                Powered by{" "}
                <span className="font-semibold" style={{ color: "#1677ff" }}>
                  Hiregenix
                </span>{" "}
                · AI-Powered Recruitment
              </span>
            </motion.div>
          </div>

          {/* RIGHT — inline chat (lg+ only) */}
          {/*
            FIX 5: Right column wrapper needs min-h-0 so it doesn't push
            the grid beyond viewport height. h-full fills the grid cell,
            min-h-0 allows it to actually be constrained to that height.
          */}
          <div className="hidden lg:flex lg:col-span-1 h-full min-h-0 flex-col">
            {/*
              FIX 6: motion.div also needs min-h-0. Without it, flex-1
              causes this element to grow beyond its parent's bounds.
            */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 4px 24px rgba(22,119,255,0.12),0 1px 6px rgba(0,0,0,0.05)",
                background: "white",
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
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          FLOATING CHAT — mobile / below lg
      ══════════════════════════════════════ */}
      <div className="lg:hidden">
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
              className="fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl overflow-hidden"
              style={{
                width: "min(calc(100vw - 2rem),380px)",
                height: "min(calc(100vh - 5rem),560px)",
                boxShadow:
                  "0 8px 40px rgba(22,119,255,0.22),0 2px 10px rgba(0,0,0,0.1)",
                background: "white",
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
// CHAT PANEL — shared by inline + popup
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
    /*
      FIX 7: ChatPanel must be a proper flex column that fills its parent
      completely. Use h-full w-full flex flex-col min-h-0 on the wrapper.
      This is the key: the panel itself must participate in the flex shrink
      chain so the messages area — and only the messages area — scrolls.
    */
    <div className="h-full w-full flex flex-col min-h-0">
      {/* Header — flex-shrink-0 so it never compresses */}
      <div
        className="flex-shrink-0 px-4 py-3 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#1677ff 0%,#0958d9 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle,white 1px,transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <RobotOutlined className="text-white" style={{ fontSize: 14 }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white leading-tight">
                AI Assistant
              </p>
              <span className="text-[9px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                HIREGENIX
              </span>
            </div>
            <p className="text-xs text-blue-100 truncate">
              Ask anything about {company.companyName}
            </p>
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
                <CloseOutlined
                  className="text-white"
                  style={{ fontSize: 11 }}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/*
        FIX 8: Messages area — this is THE scroll container.
        flex-1 + min-h-0 + overflow-y-auto is the complete fix.
        flex-1 → takes all remaining vertical space after header+input+footer
        min-h-0 → allows it to shrink (flex default is min-height: auto which prevents shrink)
        overflow-y-auto → shows scrollbar only when content overflows
      */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-2"
        style={{
          background: "#fafcff",
          scrollbarWidth: "thin",
          scrollbarColor: "#bae0ff transparent",
        }}
      >
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
                    ? { background: "#1677ff", color: "white" }
                    : {
                        background: "#e6f4ff",
                        color: "#1677ff",
                        border: "1px solid #bae0ff",
                      }
                }
              >
                {isUser ? (
                  <UserOutlined style={{ fontSize: 9 }} />
                ) : (
                  <RobotOutlined style={{ fontSize: 9 }} />
                )}
              </div>
              <div
                className={`max-w-[82%] flex flex-col gap-0.5 ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className="rounded-2xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    isUser
                      ? {
                          background: "linear-gradient(135deg,#1677ff,#0958d9)",
                          color: "white",
                          borderBottomRightRadius: 4,
                          boxShadow: "0 2px 8px rgba(22,119,255,0.28)",
                        }
                      : {
                          background: "white",
                          color: "#374151",
                          borderBottomLeftRadius: 4,
                          border: "1px solid #e6f0ff",
                          boxShadow: "0 1px 4px rgba(22,119,255,0.06)",
                        }
                  }
                >
                  {msg.content}
                </div>
                <Text className="!text-[9px] !text-gray-400 px-1">
                  {formatTime(msg.timestamp)}
                </Text>
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
                style={{ background: "#e6f4ff", border: "1px solid #bae0ff" }}
              >
                <RobotOutlined style={{ fontSize: 9, color: "#1677ff" }} />
              </div>
              <div
                className="rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1 items-center"
                style={{ background: "white", border: "1px solid #e6f0ff" }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full block"
                    style={{ background: "#1677ff" }}
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
                      background: "white",
                      border: "1px solid #bae0ff",
                      color: "#1677ff",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#e6f4ff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "white";
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll anchor — always stays at the bottom of messages */}
        <div ref={bottomRef} />
      </div>

      {/* Input — flex-shrink-0 so it never compresses */}
      <div
        className="flex-shrink-0 px-3 py-2.5"
        style={{ borderTop: "1px solid #e6f0ff", background: "white" }}
      >
        <div className="flex gap-2 items-end">
          <Input.TextArea
            value={inputText}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask about the company..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            className="!rounded-xl !text-xs"
            style={{ borderColor: "#bae0ff" }}
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

      {/* Footer — flex-shrink-0 so it never compresses */}
      <div
        className="flex-shrink-0 flex items-center justify-center gap-1 py-1.5"
        style={{ borderTop: "1px solid #f0f7ff", background: "#fafcff" }}
      >
        <ThunderboltFilled style={{ color: "#1677ff", fontSize: 9 }} />
        <span className="text-[9px] text-gray-400">
          Powered by{" "}
          <span className="font-semibold" style={{ color: "#1677ff" }}>
            Hiregenix AI
          </span>
        </span>
      </div>
    </div>
  );
}
