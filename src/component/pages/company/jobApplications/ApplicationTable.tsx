// ==================== ApplicationTable.tsx ====================
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
  Tag,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  MoreOutlined,
  UserOutlined,
  EyeFilled,
  MailOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";
import toast from "react-hot-toast";

const { Title } = Typography;

export interface CandidateInfo {
  _id: string;
  fullName: string;
  profilePictureUrl?: string;
}

export interface AIResult {
  strengths: string[];
  improvements: string[];
}

export interface InterviewRecord {
  _id: string;
  candidateId: CandidateInfo;
  companyId: string;
  jobId: string;
  type: string;
  scheduledDate: string;
  status: string;
  report: {
    overallInterviewScore: number;
    communicationScore?: number;
    confidenceScore?: number;
    contentScore?: number;
    fluencyScore?: number;
    pdfUrl?: string;
  }
  createdAt: string;
  updatedAt: string;
  aiResult?: AIResult;
  applicationScore?: number;
  interviewScore?: number;
  [key: string]: unknown;
}

interface ApplicationTableProps {
  data?: InterviewRecord[];
  loading?: boolean;
  pagination?: TablePaginationConfig;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  data = [],
  loading = false,
  pagination,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("date");

  // Calculate average score based on AI results
  const calculateAvgScore = (record: InterviewRecord) => {
    const report = record?.report;

    if (!report) return 0;

    const scores = [
      report?.communicationScore,
      report?.confidenceScore,
      report?.contentScore,
      report?.fluencyScore
    ].filter((score) => typeof score === "number");

    if (scores.length === 0) return 0;

    const total = scores.reduce((sum, score) => {
      if (score !== undefined && sum !== undefined) {
        return sum + score;
      }
      return 0;
    });

    if (total === undefined) return 0;

    return Math.round(total / scores.length);
  };

  // Get color based on score
  const getAvgColor = (value: number) => {
    if (value >= 85) return "bg-purple-200";
    if (value >= 80) return "bg-green-200";
    if (value >= 70) return "bg-yellow-200";
    return "bg-red-200";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // Get status tag color
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "passed":
        return "success";
      case "failed":
      case "cancelled":
        return "error";
      case "scheduled":
        return "warning";
      case "in-progress":
        return "processing";
      default:
        return "default";
    }
  };

  // Get interview type tag
  const getInterviewTypeTag = (type: string) => {
    return type === "live" ? (
      <Tag color="blue">Live</Tag>
    ) : (
      <Tag color="cyan">Recorded</Tag>
    );
  };

  const columns = [
    {
      title: "Candidate",
      dataIndex: "candidate",
      key: "candidate",
      render: (candidate: CandidateInfo) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={candidate?.profilePictureUrl}
            icon={<UserOutlined />}
            size={40}
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">
              {candidate?.fullName || "N/A"}
            </span>
            {/* <span className="text-gray-500 text-xs">ID: {candidate?._id}</span> */}
          </div>
        </div>
      ),
    },
    {
      title: "Interview Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => getInterviewTypeTag(type),
    },
    {
      title: "Scheduled Date",
      dataIndex: "scheduledDate",
      key: "scheduledDate",
      render: (date: string) => (
        <div className="flex flex-col">
          <span>{formatDate(date)}</span>
          <span className="text-xs text-gray-500">
            {new Date(date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },
    {
      title: "Interview Score",
      key: "interviewScore",
      render: (record: InterviewRecord) => {
        const score = record.report?.overallInterviewScore;
        return score !== undefined ? (
          <div
            className={`text-center rounded-md py-1 font-medium ${getAvgColor(
              score
            )}`}
          >
            {score}%
          </div>
        ) : (
          <div
            className={`text-center rounded-md py-1 font-medium ${getAvgColor(
              score
            )}`}
          >
            {0}%
          </div>
        );
      },
    },
    {
      title: "Avg Score",
      key: "avgScore",
      render: (_: unknown, record: InterviewRecord) => {
        const avgScore = calculateAvgScore(record);
        return (
          <div
            className={`text-center rounded-md py-1 font-medium ${getAvgColor(
              avgScore
            )}`}
          >
            {avgScore}%
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase() || "PENDING"}
        </Tag>
      ),
    },
    {
      title: "AI Report",
      key: "aiResult",
      render: (_: unknown, record: InterviewRecord) => {
        if (!record.report) return <span className="text-gray-400">N/A</span>;

        const pdfUrl = record.report?.pdfUrl;

        return (
          <div className="">
            {pdfUrl ? (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <EyeFilled /> Report
              </a>
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: "sendHiringEmail", label: "Send Hiring Email", icon: <MailOutlined />, onClick: () => handleHiringEmail() },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="hover:bg-gray-100 rounded-full"
          />
        </Dropdown>
      ),
    },
  ];

  const handleHiringEmail = () => {
    //TODO: Implement hiring email logic here
    toast.success("Hiring email sent!");
  };

  // Filter data based on active tab
  const getFilteredData = () => {
    let filtered = data;

    // Filter by tab
    if (activeTab === "best") {
      filtered = filtered.filter((item) => {
        const avgScore = calculateAvgScore(item);
        return avgScore >= 60;
      });
    } else if (activeTab === "failed") {
      filtered = filtered.filter(
        (item) =>
          item.status?.toLowerCase() === "failed" ||
          item.status?.toLowerCase() === "cancelled"
      );
    } else if (activeTab === "scheduled") {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === "scheduled"
      );
    } else if (activeTab === "completed") {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === "completed"
      );
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter((item) =>
        item.candidateId?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  };

  // Sort data
  const getSortedData = (filteredData: InterviewRecord[]) => {
    const sorted = [...filteredData];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) =>
          (a.candidateId?.fullName || "").localeCompare(
            b.candidateId?.fullName || ""
          )
        );
      case "score":
        return sorted.sort((a, b) => {
          const scoreA = calculateAvgScore(a);
          const scoreB = calculateAvgScore(b);
          return scoreB - scoreA;
        });
      case "date":
        return sorted.sort(
          (a, b) =>
            new Date(b.scheduledDate).getTime() -
            new Date(a.scheduledDate).getTime()
        );
      default:
        return sorted;
    }
  };

  const filteredData = getFilteredData();
  const sortedData = getSortedData(filteredData);

  const filterMenu = {
    items: [
      { key: "name", label: "Sort by Name" },
      { key: "score", label: "Sort by Score" },
      { key: "date", label: "Sort by Date" },
    ],
    onClick: ({ key }: { key: string }) => setSortBy(key),
  };

  return (
    <Card className="rounded-2xl shadow-sm w-full">
      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "all", label: "All Interviews" },
          { key: "best", label: "Best Matches" },
          // { key: "failed", label: "Failed" },
          { key: "scheduled", label: "Scheduled" },
          { key: "completed", label: "Completed" },
        ]}
        className="mb-4"
      />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <Title level={5} className="!m-0 font-medium text-gray-700">
          Results: {sortedData.length} Interviews
        </Title>

        <Space>
          <Dropdown menu={filterMenu} trigger={["click"]}>
            <Button>
              Sort by <DownOutlined />
            </Button>
          </Dropdown>
          <Input
            placeholder="Search by candidate name"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={sortedData.map((item) => ({ ...item, key: item._id }))}
        loading={loading}
        pagination={
          pagination || {
            position: ["bottomCenter"],
            pageSize: 10,
          }
        }
        bordered
        className="rounded-lg overflow-hidden"
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default ApplicationTable;
