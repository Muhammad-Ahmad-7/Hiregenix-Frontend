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
  ArrowLeftOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const MessagingInterface = () => {
  const [selectedChat, setSelectedChat] = useState("ibm");
  const [showChatList, setShowChatList] = useState(true);

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

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white">
      {/* Left Sidebar - Conversations List */}
      <div
        className={`${
          showChatList ? "flex" : "hidden"
        } md:flex w-full md:w-[380px] lg:w-[420px] border-r border-gray-200 flex-col`}
      >
        {/* Search Header */}
        <div className="p-3 md:p-4 border-b border-gray-200">
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
              <Button className="hidden sm:flex">
                All <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                items: [
                  { key: "1", label: "All" },
                  { key: "2", label: "Unread" },
                  { key: "3", label: "Archived" },
                ],
              }}
            >
              <Button icon={<MenuOutlined />} className="sm:hidden" />
            </Dropdown>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleChatSelect(conv.id)}
              className={`flex items-start gap-3 p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
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
                  <span className="font-medium text-gray-900 text-sm md:text-base truncate">
                    {conv.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {conv.time}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {conv.message}
                </p>
              </div>
              {conv.unread > 0 && (
                <Badge count={conv.unread} className="mt-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Window */}
      <div
        className={`${
          !showChatList ? "flex" : "hidden"
        } md:flex flex-1 flex-col`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToList}
              className="md:hidden flex-shrink-0"
            />
            <Avatar
              size={40}
              style={{ backgroundColor: "#1890ff" }}
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231890ff' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='white' font-family='Arial'%3EIBM%3C/text%3E%3C/svg%3E"
              className="flex-shrink-0"
            />
            <span className="font-medium text-gray-900 text-sm md:text-base truncate">
              International Business Machines
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs md:text-sm text-gray-500 hidden sm:block">
              Sun, Aug 17, 3:57 PM
            </span>
            <Button type="text" icon={<MoreOutlined />} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 md:mb-6 flex ${
                msg.sender === "you" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender !== "you" && (
                <Avatar
                  size={32}
                  className="mr-2 md:mr-3 mt-1 flex-shrink-0"
                  style={{ backgroundColor: "#1890ff" }}
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231890ff' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='white' font-family='Arial'%3EIBM%3C/text%3E%3C/svg%3E"
                />
              )}
              <div
                className={`max-w-[85%] md:max-w-2xl ${
                  msg.sender === "you" ? "items-end" : "items-start"
                } flex flex-col`}
              >
                {msg.sender !== "you" && (
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    IBM
                  </div>
                )}
                {msg.sender === "you" && msg.attachment && (
                  <div className="bg-white rounded-lg p-2 md:p-3 mb-2 shadow-sm border border-gray-200 flex items-center gap-2 max-w-full">
                    <FilePdfOutlined className="text-red-500 text-lg md:text-xl flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium truncate">
                      {msg.attachment}
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 md:p-4 ${
                    msg.sender === "you"
                      ? "bg-white shadow-sm border border-gray-200"
                      : "bg-white shadow-sm border border-gray-200"
                  }`}
                >
                  <p className="text-xs md:text-sm text-gray-800 whitespace-pre-line break-words">
                    {msg.text}
                  </p>
                  {msg.emoji && (
                    <div className="mt-2">
                      <span className="text-lg md:text-xl">{msg.emoji}</span>
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
                  className="ml-2 md:ml-3 mt-1 flex-shrink-0"
                  style={{ backgroundColor: "#52c41a" }}
                >
                  U
                </Avatar>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              type="primary"
              icon={<span className="text-base md:text-lg">⚡</span>}
              className="h-9 md:h-10 px-3 md:px-4 hidden sm:flex"
              style={{ backgroundColor: "#7c3aed" }}
            />
            <Input
              placeholder="Write a message..."
              className="flex-1 h-9 md:h-10 text-sm md:text-base"
              suffix={
                <div className="flex gap-1 md:gap-2">
                  <Button
                    type="text"
                    icon={<SmileOutlined />}
                    className="hidden sm:flex"
                  />
                  <Button type="text" icon={<PaperClipOutlined />} />
                </div>
              }
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              className="h-9 md:h-10 w-9 md:w-10 flex items-center justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
