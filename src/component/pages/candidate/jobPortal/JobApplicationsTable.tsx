"use client";

import React, { useState } from "react";
import { Table, Tabs, Button, Input, Dropdown } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";

const JobApplicationsTable = () => {
  const [activeTab, setActiveTab] = useState("all");

  const allJobsData = [
    {
      key: "1",
      title: "Java developer",
      company: "ArtixStudio",
      type: "Remote",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "--",
      avgScore: "70%",
    },
    {
      key: "2",
      title: "C++ Developer",
      company: "Estrresoft",
      type: "Onsite",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "3",
      title: "Solidity Developer",
      company: "NetSQL",
      type: "Onsite",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "4",
      title: "Front-end developer",
      company: "Devsinc",
      type: "Remote",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "5",
      title: "Kotlin developer",
      company: "NetSQL",
      type: "Onsite",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "text",
    },
    {
      key: "6",
      title: "Swift developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "7",
      title: "UI Developer",
      company: "Meta",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "--",
      avgScore: "70%",
    },
    {
      key: "8",
      title: "React developer",
      company: "Technologix",
      type: "Hybrid",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "--",
      avgScore: "70%",
    },
    {
      key: "9",
      title: "Backend Nodejs",
      company: "Conira",
      type: "Onsite",
      date: "22-09-25",
      status: "Approved",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "10",
      title: "Three.js developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
  ];

  const appliedData = [
    {
      key: "1",
      title: "Java developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "2",
      title: "UI Designer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "3",
      title: "C++ Developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "4",
      title: "Java Full Stack developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "5",
      title: "Solidity Developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "6",
      title: "Kotlin developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "7",
      title: "UI Developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "8",
      title: "Swift developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "9",
      title: "Backend Nodejs",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "10",
      title: "Three.js developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Applied",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
  ];

  const underReviewData = [
    {
      key: "1",
      title: "Java developer",
      company: "ArtixStudio",
      type: "Remote",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "2",
      title: "UI Designer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "3",
      title: "C++ Developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "4",
      title: "Java Full Stack developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "5",
      title: "Solidity Developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "6",
      title: "Kotlin developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "7",
      title: "UI Developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "8",
      title: "Swift developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "9",
      title: "Backend Nodejs",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "10",
      title: "Three.js developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Under review",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
  ];

  const rejectedData = [
    {
      key: "1",
      title: "Java developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "2",
      title: "UI Designer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "3",
      title: "C++ Developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "4",
      title: "Java Full Stack developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "5",
      title: "Solidity Developer",
      company: "Systems",
      type: "Onsite",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "6",
      title: "Kotlin developer",
      company: "Technologix",
      type: "Hybrid",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "7",
      title: "UI Developer",
      company: "Technologix",
      type: "Hybrid",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "8",
      title: "Swift developer",
      company: "Technologix",
      type: "Hybrid",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "9",
      title: "Backend Nodejs",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "10",
      title: "Three.js developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Rejected",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
  ];

  const savedData = [
    {
      key: "1",
      title: "Java developer",
      company: "Estrresoft",
      type: "Onsite",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "2",
      title: "UI Designer",
      company: "Estrresoft",
      type: "Onsite",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "3",
      title: "C++ Developer",
      company: "Estrresoft",
      type: "Onsite",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "4",
      title: "Java Full Stack developer",
      company: "Technologix",
      type: "Hybrid",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "5",
      title: "Solidity Developer",
      company: "Technologix",
      type: "Hybrid",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "6",
      title: "Kotlin developer",
      company: "Technologix",
      type: "Hybrid",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "7",
      title: "UI Developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "8",
      title: "Swift developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "9",
      title: "Backend Nodejs",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
    {
      key: "10",
      title: "Three.js developer",
      company: "Anima Studios",
      type: "Hybrid",
      date: "22-09-25",
      status: "Scheduled",
      quizScore: "70%",
      interviewScore: "70%",
      avgScore: "70%",
    },
  ];

  const getDataByTab = () => {
    switch (activeTab) {
      case "applied":
        return appliedData;
      case "under-review":
        return underReviewData;
      case "rejected":
        return rejectedData;
      case "saved":
        return savedData;
      default:
        return allJobsData;
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      Applied: { color: "#fa8c16" },
      Scheduled: { color: "#1890ff" },
      "Under review": { color: "#722ed1" },
      Rejected: { color: "#f5222d" },
      Approved: { color: "#52c41a" },
    };

    const config = statusConfig[status] || { color: "#666" };

    return (
      <span className="text-sm text-gray-700">
        <span style={{ color: config.color }}>•</span> {status}
      </span>
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <a className="text-blue-600 hover:text-blue-700">{text}</a>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Quiz Score",
      dataIndex: "quizScore",
      key: "quizScore",
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
    },
    {
      title: "Title",
      key: "actions",
      render: () => (
        <div className="flex gap-2">
          <a className="text-blue-600 hover:text-blue-700 text-sm">Details</a>
          <a className="text-red-600 hover:text-red-700 text-sm">Delete</a>
        </div>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: "All jobs" },
    { key: "applied", label: "Applied" },
    { key: "under-review", label: "Under review" },
    { key: "rejected", label: "Rejected" },
    { key: "saved", label: "Saved" },
  ];

  return (
    <div className="bg-white p-6">
      <Title>Applications</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-4"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Results: <span className="font-semibold text-gray-900">19,476</span>{" "}
          Jobs
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Status" },
                { key: "2", label: "Date" },
                { key: "3", label: "Company" },
              ],
            }}
          >
            <Button icon={<FilterOutlined />}>Filter jobs</Button>
          </Dropdown>
          <Input
            placeholder="Input search text"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-48"
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Add New
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={getDataByTab()}
        pagination={{
          current: 6,
          total: 100,
          pageSize: 10,
          showSizeChanger: false,
          className: "flex justify-end",
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return <Button size="small">&lt;</Button>;
            }
            if (type === "next") {
              return <Button size="small">&gt;</Button>;
            }
            if (type === "jump-prev" || type === "jump-next") {
              return <span className="px-2">...</span>;
            }
            return originalElement;
          },
        }}
        className="border border-gray-200 rounded-lg"
      />

      <div className="flex justify-end items-center gap-4 mt-4">
        <Dropdown
          menu={{
            items: [
              { key: "10", label: "10/page" },
              { key: "20", label: "20/page" },
              { key: "50", label: "50/page" },
            ],
          }}
        >
          <Button size="small">10/page</Button>
        </Dropdown>
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "Go to page 1" },
              { key: "2", label: "Go to page 2" },
              { key: "3", label: "Go to page 3" },
            ],
          }}
        >
          <Button size="small">Go to</Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default JobApplicationsTable;
