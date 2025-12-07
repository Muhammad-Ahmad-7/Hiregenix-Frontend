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
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";

const { Title } = Typography;

interface CandidateInfo {
  _id: string;
  fullName: string;
  profilePictureUrl?: string;
}

interface AIResult {
  strengths: string[];
  improvements: string[];
}

interface InterviewRecord {
  _id: string;
  candidateId: CandidateInfo;
  companyId: string;
  jobId: string;
  type: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  aiResult?: AIResult;
  applicationScore?: number;
  interviewScore?: number;
  [key: string]: any;
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
    if (
      record.applicationScore !== undefined &&
      record.interviewScore !== undefined
    ) {
      return Math.round((record.applicationScore + record.interviewScore) / 2);
    }
    if (record.applicationScore !== undefined) return record.applicationScore;
    if (record.interviewScore !== undefined) return record.interviewScore;

    // Fallback: Calculate based on AI results if available
    if (record.aiResult) {
      const strengthCount = record.aiResult.strengths?.length || 0;
      const improvementCount = record.aiResult.improvements?.length || 0;
      const total = strengthCount + improvementCount;
      if (total > 0) {
        return Math.round((strengthCount / total) * 100);
      }
    }
    return 0;
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
      dataIndex: "candidateId",
      key: "candidateId",
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
      title: "Application Score",
      dataIndex: "applicationScore",
      key: "applicationScore",
      render: (score?: number) => (score !== undefined ? `${score}%` : "N/A"),
    },
    {
      title: "Interview Score",
      dataIndex: "interviewScore",
      key: "interviewScore",
      render: (score?: number) => (score !== undefined ? `${score}%` : "N/A"),
    },
    {
      title: "Avg Score",
      key: "avgScore",
      render: (_: any, record: InterviewRecord) => {
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
      title: "AI Analysis",
      key: "aiResult",
      render: (_: any, record: InterviewRecord) => {
        if (!record.aiResult) return <span className="text-gray-400">N/A</span>;

        const strengthCount = record.aiResult.strengths?.length || 0;
        const improvementCount = record.aiResult.improvements?.length || 0;

        return (
          <div className="flex gap-2">
            <Tag color="green">{strengthCount} Strengths</Tag>
            <Tag color="orange">{improvementCount} Areas</Tag>
          </div>
        );
      },
    },
    {
      title: "",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: InterviewRecord) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "View Details" },
              { key: "reschedule", label: "Reschedule Interview" },
              { key: "cancel", label: "Cancel Interview", danger: true },
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

  // Filter data based on active tab
  const getFilteredData = () => {
    let filtered = data;

    // Filter by tab
    if (activeTab === "best") {
      filtered = filtered.filter((item) => {
        const avgScore = calculateAvgScore(item);
        return avgScore >= 80;
      });
    } else if (activeTab === "failed") {
      filtered = filtered.filter(
        (item) =>
          item.status?.toLowerCase() === "failed" ||
          item.status?.toLowerCase() === "cancelled"
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
    <Card className="rounded-2xl shadow-sm p-6">
      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "all", label: "All Interviews" },
          { key: "best", label: "Best Matches" },
          { key: "failed", label: "Failed" },
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
