"use client";

import React, { useState } from "react";
import {
  Table,
  Tabs,
  Input,
  Dropdown,
  Button,
  Space,
  Typography,
  Card,
} from "antd";
import { SearchOutlined, DownOutlined, MoreOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ApplicationTable = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const data = [
    {
      key: "1",
      title: "Alexa Jopherin",
      role: "Front-end Developer",
      location: "England",
      flag: "🇬🇧",
      date: "22-09-25",
      applicationScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "2",
      title: "Alexa Jopherin",
      role: "Front-end Developer",
      location: "China",
      flag: "🇨🇳",
      date: "22-09-25",
      applicationScore: "70%",
      interviewScore: "70%",
      avgScore: "85%",
    },
    {
      key: "3",
      title: "Alexa Jopherin",
      role: "Front-end Developer",
      location: "Brazil",
      flag: "🇧🇷",
      date: "22-09-25",
      applicationScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
  ];

  const getAvgColor = (value: string) => {
    const num = parseInt(value);
    if (num >= 85) return "bg-purple-200";
    if (num >= 80) return "bg-green-200";
    if (num >= 70) return "bg-yellow-200";
    return "bg-red-200";
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{text}</span>
          <span className="text-gray-500 text-xs">{record.role}</span>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_, record) => (
        <span>
          {record.location} <span className="ml-1">{record.flag}</span>
        </span>
      ),
    },
    {
      title: "Application Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Application Score",
      dataIndex: "applicationScore",
      key: "applicationScore",
    },
    {
      title: "Interview Score",
      dataIndex: "interviewScore",
      key: "interviewScore",
    },
    {
      title: "Avg Score",
      dataIndex: "avgScore",
      key: "avgScore",
      render: (value) => (
        <div className={`text-center rounded-md py-1 ${getAvgColor(value)}`}>
          {value}
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "center",
      render: () => (
        <Button
          type="text"
          icon={<MoreOutlined />}
          className="hover:bg-gray-100 rounded-full"
        />
      ),
    },
  ];

  const filterMenu = {
    items: [
      { key: "1", label: "Sort by Name" },
      { key: "2", label: "Sort by Score" },
      { key: "3", label: "Sort by Date" },
    ],
  };

  return (
    <Card className="rounded-2xl shadow-sm p-6">
      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "all", label: "All applications" },
          { key: "best", label: "Best matches" },
          { key: "failed", label: "Failed" },
        ]}
        className="mb-4"
      />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <Title level={5} className="!m-0 font-medium text-gray-700">
          Results: {data.length} Jobs
        </Title>

        <Space>
          <Dropdown menu={filterMenu} trigger={["click"]}>
            <Button>
              Sort by <DownOutlined />
            </Button>
          </Dropdown>
          <Input
            placeholder="input search text"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 10,
        }}
        bordered
        className="rounded-lg overflow-hidden"
      />
    </Card>
  );
};

export default ApplicationTable;
