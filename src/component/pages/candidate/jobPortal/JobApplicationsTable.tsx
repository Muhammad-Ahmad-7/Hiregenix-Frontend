"use client";

import React, { useState, useEffect } from "react";
import { Table, Tabs, Button, Input, Dropdown } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { getAllInterviewsApi } from "@/app/api/candidate/interview.api";

interface Interview {
  _id: string;
  candidateId: string;
  companyId: {
    _id: string;
    companyName: string;
  };
  jobId: {
    _id: string;
    title: string;
    workMode: string;
    deadline: string;
  };
  type: string;
  scheduledDate: string;
  status: "scheduled" | "under review" | "rejected";
  aiResult: {
    strengths: string[];
    improvements: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const JobApplicationsTable = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // ⭐ NEW: Work Mode filter state
  const [workModeFilter, setWorkModeFilter] = useState<string | null>(null);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await getAllInterviewsApi({ page: 1, limit: 50 });
        setInterviews(res.data.interviews || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setInterviews([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const getDataByTab = () => {
    let filteredData = interviews;

    // ⭐ Apply Work Mode Filter
    if (workModeFilter) {
      filteredData = filteredData.filter(
        (item) =>
          item.jobId?.workMode?.toLowerCase() === workModeFilter.toLowerCase()
      );
    }

    // Filter by tab
    switch (activeTab) {
      case "scheduled":
        filteredData = filteredData.filter(
          (item) => item.status === "scheduled"
        );
        break;
      case "under review":
        filteredData = filteredData.filter(
          (item) => item.status === "under review"
        );
        break;
      case "rejected":
        filteredData = filteredData.filter(
          (item) => item.status === "rejected"
        );
        break;
      default:
        break;
    }

    // Search filter
    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.jobId?.title?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Map to table format
    return filteredData.map((interview) => ({
      key: interview._id,
      title: interview.jobId?.title || "N/A",
      company: interview.companyId?.companyName || "N/A",
      type: interview.jobId?.workMode || "N/A",
      date: formatDate(interview.scheduledDate),
      status: interview.status,
      quizScore: "--",
      interviewScore: "--",
      avgScore: "--",
    }));
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      scheduled: { color: "#1890ff" },
      "under review": { color: "#722ed1" },
      rejected: { color: "#f5222d" },
    };

    const config = statusConfig[status] || { color: "#666" };

    return (
      <span className="text-sm text-gray-700">
        <span style={{ color: config.color }}>•</span>{" "}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
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
      render: (status: string) => getStatusTag(status),
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
      title: "Actions",
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
    { key: "scheduled", label: "Scheduled" },
    { key: "under review", label: "Under review" },
    { key: "rejected", label: "Rejected" },
  ];

  const tableData = getDataByTab();

  return (
    <div className="bg-white p-6">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-4"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Results:{" "}
          <span className="font-semibold text-gray-900">
            {meta?.total || tableData.length}
          </span>{" "}
          Jobs
        </div>

        <div className="flex items-center gap-2">
          {/* ⭐ UPDATED WORK MODE FILTER DROPDOWN */}
          <Dropdown
            menu={{
              onClick: ({ key }) =>
                setWorkModeFilter(key === "all" ? null : key),
              items: [
                { key: "all", label: "All Work Modes" },
                { key: "remote", label: "Remote" },
                { key: "full-time", label: "Full Time" },
                { key: "part-time", label: "Part Time" },
              ],
            }}
          >
            <Button icon={<FilterOutlined />}>
              {workModeFilter ? `Mode: ${workModeFilter}` : "Filter jobs"}
            </Button>
          </Dropdown>

          <Input
            placeholder="Search title"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-48"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={{
          current: meta?.page || 1,
          total: meta?.total || tableData.length,
          pageSize: meta?.limit || 10,
          showSizeChanger: false,
          className: "flex justify-end",
          itemRender: (page, type, originalElement) => {
            if (type === "prev") return <Button size="small">&lt;</Button>;
            if (type === "next") return <Button size="small">&gt;</Button>;
            if (type === "jump-prev" || type === "jump-next")
              return <span className="px-2">...</span>;
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
          <Button size="small">{meta?.limit || 10}/page</Button>
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
