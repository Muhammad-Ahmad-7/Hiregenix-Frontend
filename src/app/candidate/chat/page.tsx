// import MessagingInterface from "@/component/pages/candidate/chat/MessagingInterface";
// import React from "react";

// export default function page() {
//   return <MessagingInterface />;
// }
"use client";

import { useState } from "react";
import { Input, Avatar, Button, Badge } from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  PaperClipOutlined,
  SmileOutlined,
  SendOutlined,
} from "@ant-design/icons";
import MessagingInterface from "@/component/pages/candidate/chat/MessagingInterface";

interface Email {
  id: number;
  sender: string;
  senderInitial: string;
  senderColor: string;
  subject: string;
  preview: string;
  time: string;
  hasNotification?: boolean;
  notificationColor?: string;
}

interface Message {
  id: number;
  sender: string;
  senderInitial: string;
  senderColor: string;
  company: string;
  subject: string;
  content: string;
  timestamp: string;
  attachment?: string;
  isOwn?: boolean;
}

const emails: Email[] = [
  {
    id: 1,
    sender: "Halo Studio",
    senderInitial: "H",
    senderColor: "#1f2937",
    subject: "Hi James, we've reviewed your application and would love...",
    preview: "Hi James, we've reviewed your application and would love...",
    time: "30m",
    hasNotification: true,
    notificationColor: "#ef4444",
  },
  {
    id: 2,
    sender: "Donald",
    senderInitial: "D",
    senderColor: "#f97316",
    subject: "Thank you for submitting your resume. Could you also share...",
    preview: "Thank you for submitting your resume. Could you also share...",
    time: "1h",
  },
  {
    id: 3,
    sender: "Dexter Champlin",
    senderInitial: "D",
    senderColor: "#06b6d4",
    subject: "Thank you for submitting your resume. Could you also share...",
    preview: "Thank you for submitting your resume. Could you also share...",
    time: "2h",
  },
  {
    id: 4,
    sender: "Melinda Rice",
    senderInitial: "M",
    senderColor: "#ec4899",
    subject: "Thank you for submitting your resume. Could you also share...",
    preview: "Thank you for submitting your resume. Could you also share...",
    time: "2h",
  },
  {
    id: 5,
    sender: "Ms. Muriel Fay",
    senderInitial: "M",
    senderColor: "#f59e0b",
    subject: "Thank you for submitting your resume. Could you also share...",
    preview: "Thank you for submitting your resume. Could you also share...",
    time: "7h",
    hasNotification: true,
    notificationColor: "#ef4444",
  },
  {
    id: 6,
    sender: "Lyle Kasulke DVM",
    senderInitial: "L",
    senderColor: "#10b981",
    subject: "Thank you for submitting your resume. Could you also share...",
    preview: "Thank you for submitting your resume. Could you also share...",
    time: "9h",
  },
  {
    id: 7,
    sender: "Jimmy Hilpert",
    senderInitial: "J",
    senderColor: "#8b5cf6",
    subject: "Thank you for submitting your resume. Could you also share...",
    preview: "Thank you for submitting your resume. Could you also share...",
    time: "1 day",
    hasNotification: true,
    notificationColor: "#ef4444",
  },
];

const messages: Message[] = [
  {
    id: 1,
    sender: "IBM",
    senderInitial: "I",
    senderColor: "#3b82f6",
    company: "International Business Machines",
    subject:
      "Hi Abdullah, we've reviewed your application and are quite impressed with your background! Our team would love to learn a bit more about your past experience before we move ahead.",
    content:
      "Hi Abdullah, we've reviewed your application and are quite impressed with your background! Our team would love to learn a bit more about your past experience before we move ahead.",
    timestamp: "5 min ago",
  },
  {
    id: 2,
    sender: "You",
    senderInitial: "Y",
    senderColor: "#3b82f6",
    company: "",
    subject:
      "Hi! Thank you for the kind words. I've shared my updated resume with detailed project experience — please let me know if there's anything specific you'd like to know.\n\nLet me know if you need any further information",
    content:
      "Hi! Thank you for the kind words. I've shared my updated resume with detailed project experience — please let me know if there's anything specific you'd like to know.\n\nLet me know if you need any further information",
    timestamp: "5 min ago",
    attachment: "Updatedplan.pdf",
    isOwn: true,
  },
];

export default function EmailInterface() {
  const [selectedEmail, setSelectedEmail] = useState<number>(1);
  const [replyText, setReplyText] = useState("");

  return (
    <>
      <MessagingInterface />
      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar - Email List */}
        <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <Input
                placeholder="Search name"
                prefix={<SearchOutlined className="text-gray-400" />}
                className="flex-1"
                style={{ borderRadius: "4px" }}
              />
              <Button type="text" icon={<MoreOutlined />} />
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedEmail === email.id ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-3">
                  <Avatar
                    size={40}
                    style={{ backgroundColor: email.senderColor }}
                    className="flex-shrink-0"
                  >
                    {email.senderInitial}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-gray-900 truncate">
                        {email.sender}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {email.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {email.preview}
                    </p>
                  </div>
                  {email.hasNotification && (
                    <Badge
                      count={1}
                      style={{ backgroundColor: email.notificationColor }}
                      className="flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Email Detail */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
          {/* Email Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    IBM
                  </span>
                  <span className="text-sm text-gray-500">
                    International Business Machines
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Sun, Aug 17, 3:57 PM
                </h2>
              </div>
              <Button type="text" icon={<MoreOutlined />} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.isOwn ? "justify-end" : ""}`}
              >
                {!message.isOwn && (
                  <Avatar
                    size={40}
                    style={{ backgroundColor: message.senderColor }}
                    className="flex-shrink-0"
                  >
                    {message.senderInitial}
                  </Avatar>
                )}
                <div
                  className={`max-w-md ${message.isOwn ? "text-right" : ""}`}
                >
                  <div
                    className={`p-4 rounded-lg ${
                      message.isOwn
                        ? "bg-blue-50 text-gray-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.attachment && (
                      <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                        <PaperClipOutlined />
                        {message.attachment}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>{message.timestamp}</span>
                    {message.isOwn && <span>• Read</span>}
                  </div>
                </div>
                {message.isOwn && (
                  <Avatar
                    size={40}
                    style={{ backgroundColor: "#3b82f6" }}
                    className="flex-shrink-0"
                  >
                    Y
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-3 items-end">
              <Avatar
                size={40}
                style={{ backgroundColor: "#a855f7" }}
                className="flex-shrink-0"
              >
                +
              </Avatar>
              <div className="flex-1 flex gap-2 items-end">
                <Input.TextArea
                  placeholder="Write a message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="flex-1"
                  style={{ borderRadius: "8px" }}
                />
                <div className="flex gap-2">
                  <Button
                    type="text"
                    icon={<SmileOutlined className="text-xl" />}
                  />
                  <Button
                    type="text"
                    icon={<PaperClipOutlined className="text-xl" />}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    style={{ backgroundColor: "#3b82f6" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
