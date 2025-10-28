"use client";
import React, { useState } from "react";
import { Input, Avatar, Badge, Dropdown, Button } from "antd";
import {
  SearchOutlined,
  DownOutlined,
  MoreOutlined,
  SmileOutlined,
  PaperClipOutlined,
  SendOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

const MessagingInterface = () => {
  const [selectedChat, setSelectedChat] = useState("ibm");

  const conversations = [
    {
      id: "halo",
      name: "Halo Studio",
      avatar: "H",
      message: "Hi James, we've reviewed your application and would love...",
      time: "30m",
      unread: 2,
      color: "#000",
    },
    {
      id: "donald",
      name: "Donald",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Donald",
      message: "Thank you for submitting your resume. Could you also share...",
      time: "1h",
      unread: 0,
      color: "#f56a00",
    },
    {
      id: "dexter",
      name: "Dexter Champlin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dexter",
      message: "Thank you for submitting your resume. Could you also share...",
      time: "2h",
      unread: 0,
      color: "#7265e6",
    },
    {
      id: "melinda",
      name: "Melinda Rice",
      avatar: "M",
      message: "Thank you for submitting your resume. Could you also share...",
      time: "2h",
      unread: 0,
      color: "#00a2ae",
    },
    {
      id: "muriel",
      name: "Ms. Muriel Fay",
      avatar: "M",
      message: "Thank you for submitting your resume. Could you also share...",
      time: "7h",
      unread: 2,
      color: "#666",
    },
    {
      id: "lyle",
      name: "Lyle Kassulke DVM",
      avatar: "L",
      message: "Thank you for submitting your resume. Could you also share...",
      time: "9h",
      unread: 0,
      color: "#00474f",
    },
    {
      id: "jimmy",
      name: "Jimmy Hilpert",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jimmy",
      message: "Thank you for submitting your resume. Could you also share...",
      time: "1 day",
      unread: 2,
      color: "#ccc",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "ibm",
      text: "Hi Abdullah, we're reviewed your application and are quite impressed with your background! Our team would love to learn a bit more about your past experience before we move ahead.",
      time: "5 min ago",
      emoji: "👍",
    },
    {
      id: 2,
      sender: "you",
      text: "Hi! Thank you for the kind words. I've shared my updated resume with detailed project experience — please let me know if there's anything specific you'd like to know.\n\nLet me know if you need any further information",
      time: "5 min ago",
      status: "Read",
      attachment: "Updatedplan.pdf",
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Conversations List */}
      <div className="w-[420px] border-r border-gray-200 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Search name"
              prefix={<SearchOutlined className="text-gray-400" />}
              className="flex-1"
            />
            <Dropdown
              menu={{
                items: [
                  { key: "1", label: "All" },
                  { key: "2", label: "Unread" },
                  { key: "3", label: "Archived" },
                ],
              }}
            >
              <Button>
                All <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === conv.id ? "bg-blue-50" : ""
              }`}
            >
              <Avatar
                size={40}
                src={conv.avatar.startsWith("http") ? conv.avatar : null}
                style={{ backgroundColor: conv.color }}
              >
                {!conv.avatar.startsWith("http") && conv.avatar}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{conv.name}</span>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.message}</p>
              </div>
              {conv.unread > 0 && (
                <Badge count={conv.unread} className="mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              style={{ backgroundColor: "#1890ff" }}
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231890ff' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='white' font-family='Arial'%3EIBM%3C/text%3E%3C/svg%3E"
            />
            <span className="font-medium text-gray-900">
              International Business Machines
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sun, Aug 17, 3:57 PM</span>
            <Button type="text" icon={<MoreOutlined />} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-6 flex ${
                msg.sender === "you" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender !== "you" && (
                <Avatar
                  size={32}
                  className="mr-3 mt-1"
                  style={{ backgroundColor: "#1890ff" }}
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231890ff' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='white' font-family='Arial'%3EIBM%3C/text%3E%3C/svg%3E"
                />
              )}
              <div
                className={`max-w-2xl ${
                  msg.sender === "you" ? "items-end" : "items-start"
                } flex flex-col`}
              >
                {msg.sender !== "you" && (
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    IBM
                  </div>
                )}
                {msg.sender === "you" && msg.attachment && (
                  <div className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200 flex items-center gap-2">
                    <FilePdfOutlined className="text-red-500 text-xl" />
                    <span className="text-sm font-medium">
                      {msg.attachment}
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-4 ${
                    msg.sender === "you"
                      ? "bg-white shadow-sm border border-gray-200"
                      : "bg-white shadow-sm border border-gray-200"
                  }`}
                >
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {msg.text}
                  </p>
                  {msg.emoji && (
                    <div className="mt-2">
                      <span className="text-xl">{msg.emoji}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{msg.time}</span>
                  {msg.status && <span>· {msg.status}</span>}
                  {msg.sender === "you" && (
                    <span className="text-gray-400">You</span>
                  )}
                </div>
              </div>
              {msg.sender === "you" && (
                <Avatar
                  size={32}
                  className="ml-3 mt-1"
                  style={{ backgroundColor: "#52c41a" }}
                >
                  U
                </Avatar>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              icon={<span className="text-lg">⚡</span>}
              className="h-10 px-4"
              style={{ backgroundColor: "#7c3aed" }}
            />
            <Input
              placeholder="Write a message..."
              className="flex-1 h-10"
              suffix={
                <div className="flex gap-2">
                  <Button type="text" icon={<SmileOutlined />} />
                  <Button type="text" icon={<PaperClipOutlined />} />
                </div>
              }
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              className="h-10 w-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
