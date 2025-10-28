"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Badge,
  Tabs,
  Space,
  Input,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import InterviewCard from "./InterviewCard";

interface InterviewRecord {
  key: string;
  name: string;
  company: string;
  type: string;
  role: string;
  date: string;
  interviewStatus: string;
}

const scheduleData: InterviewRecord[] = [
  {
    key: "1",
    name: "Jess developer",
    company: "Architect",
    type: "Onsite",
    role: "22-05-25",
    date: "75%",
    interviewStatus: "Scheduled",
  },
  {
    key: "2",
    name: "Kathy Reinger",
    company: "Analyst",
    type: "Task",
    role: "22-05-25",
    date: "75%",
    interviewStatus: "Scheduled",
  },
  {
    key: "3",
    name: "Kathy Developer",
    company: "Analyst",
    type: "Phone",
    role: "22-05-25",
    date: "75%",
    interviewStatus: "Scheduled",
  },
  {
    key: "4",
    name: "Kathy Developer",
    company: "Analyst",
    type: "Onsite",
    role: "22-05-25",
    date: "75%",
    interviewStatus: "Scheduled",
  },
  {
    key: "5",
    name: "Kathy Developer",
    company: "Analyst",
    type: "Task",
    role: "22-05-25",
    date: "75%",
    interviewStatus: "Scheduled",
  },
];

const historyData: InterviewRecord[] = [
  {
    key: "6",
    name: "John Smith",
    company: "Developer",
    type: "Onsite",
    role: "21-05-25",
    date: "50%",
    interviewStatus: "Completed",
  },
  {
    key: "7",
    name: "Sarah Johnson",
    company: "Designer",
    type: "Task",
    role: "21-05-25",
    date: "50%",
    interviewStatus: "Completed",
  },
  {
    key: "8",
    name: "Mike Wilson",
    company: "Manager",
    type: "Phone",
    role: "20-05-25",
    date: "50%",
    interviewStatus: "Completed",
  },
  {
    key: "9",
    name: "Emily Brown",
    company: "Analyst",
    type: "Onsite",
    role: "20-05-25",
    date: "50%",
    interviewStatus: "Completed",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "processing";
    case "Completed":
      return "success";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const columns: ColumnsType<InterviewRecord> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 150,
    render: (text) => (
      <span className="font-medium text-blue-600 cursor-pointer hover:underline">
        {text}
      </span>
    ),
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    width: 120,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 100,
    render: (type) => {
      const colors: Record<string, string> = {
        Onsite: "cyan",
        Task: "purple",
        Phone: "blue",
      };
      return <Badge color={colors[type] || "default"} text={type} />;
    },
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 100,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 100,
  },
  {
    title: "Interview Status",
    dataIndex: "interviewStatus",
    key: "interviewStatus",
    width: 120,
    render: (status) => <Badge status={getStatusColor(status)} text={status} />,
  },
  {
    title: "Action",
    key: "action",
    width: 150,
    render: () => (
      <Space size="small">
        <Tooltip title="Reschedule">
          <Button
            type="link"
            size="small"
            className="text-blue-500 hover:text-blue-700"
          >
            Reschedule
          </Button>
        </Tooltip>
      </Space>
    ),
  },
];

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [searchText, setSearchText] = useState("");

  const tabItems = [
    { label: "Schedule", key: "schedule" },
    { label: "History", key: "history" },
  ];

  const getTableData = () => {
    switch (activeTab) {
      case "history":
        return historyData;
      case "schedule":
      default:
        return scheduleData;
    }
  };

  const filteredData = getTableData().filter((record) =>
    record.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            Sunday 23, 2025 • Kathryn Ott time
          </p>
        </div>
        <Space>
          <Button type="default" icon={<CalendarOutlined />}>
            Schedule
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Schedule Interview
          </Button>
        </Space>
      </div>

      {/* Interviews Today Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interviews Today
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <InterviewCard
              name="Frontend Developer"
              role="UI/UX Designer"
              interviewType="Task"
              date="August 25, 2025"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend"
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <InterviewCard
              name="Frontend Developer"
              role="Senior Developer"
              interviewType="Onsite"
              date="August 25, 2025"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Developer"
            />
          </Col>
        </Row>
      </div>

      {/* Interviews Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interviews Analytics
        </h2>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            placeholder="Search interviews..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-xs"
            style={{ borderRadius: "6px" }}
          />
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            total: filteredData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1200 }}
          className="bg-white"
          rowClassName="hover:bg-gray-50"
        />
      </div>
    </div>
  );
}
