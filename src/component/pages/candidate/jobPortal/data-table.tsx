"use client";

import { useState } from "react";
import { Table, Button, Badge, Tabs, Space, Input, Tooltip } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface DataRecord {
  key: string;
  name: string;
  role: string;
  status: string;
  date: string;
  type: string;
  progress: string;
  completion: string;
}

const appliedData: DataRecord[] = [
  {
    key: "1",
    name: "Jess developer",
    role: "Architect",
    status: "Applied",
    date: "22-05-25",
    type: "Applied",
    progress: "75%",
    completion: "75%",
  },
  {
    key: "2",
    name: "Kathy Reinger",
    role: "Analyst",
    status: "Applied",
    date: "22-05-25",
    type: "Applied",
    progress: "75%",
    completion: "75%",
  },
  {
    key: "3",
    name: "Kathy Developer",
    role: "Analyst",
    status: "Applied",
    date: "22-05-25",
    type: "Applied",
    progress: "75%",
    completion: "75%",
  },
  {
    key: "4",
    name: "Kathy Developer",
    role: "Analyst",
    status: "Applied",
    date: "22-05-25",
    type: "Applied",
    progress: "75%",
    completion: "75%",
  },
  {
    key: "5",
    name: "Kathy Developer",
    role: "Analyst",
    status: "Applied",
    date: "22-05-25",
    type: "Applied",
    progress: "75%",
    completion: "75%",
  },
];

const underReviewData: DataRecord[] = [
  {
    key: "6",
    name: "John Smith",
    role: "Developer",
    status: "Under review",
    date: "21-05-25",
    type: "Under review",
    progress: "50%",
    completion: "50%",
  },
  {
    key: "7",
    name: "Sarah Johnson",
    role: "Designer",
    status: "Under review",
    date: "21-05-25",
    type: "Under review",
    progress: "50%",
    completion: "50%",
  },
  {
    key: "8",
    name: "Mike Wilson",
    role: "Manager",
    status: "Under review",
    date: "20-05-25",
    type: "Under review",
    progress: "50%",
    completion: "50%",
  },
  {
    key: "9",
    name: "Emily Brown",
    role: "Analyst",
    status: "Under review",
    date: "20-05-25",
    type: "Under review",
    progress: "50%",
    completion: "50%",
  },
];

const rejectedData: DataRecord[] = [
  {
    key: "10",
    name: "David Lee",
    role: "Architect",
    status: "Rejected",
    date: "19-05-25",
    type: "Rejected",
    progress: "0%",
    completion: "0%",
  },
  {
    key: "11",
    name: "Lisa Anderson",
    role: "Developer",
    status: "Rejected",
    date: "19-05-25",
    type: "Rejected",
    progress: "0%",
    completion: "0%",
  },
  {
    key: "12",
    name: "Robert Taylor",
    role: "Analyst",
    status: "Rejected",
    date: "18-05-25",
    type: "Rejected",
    progress: "0%",
    completion: "0%",
  },
  {
    key: "13",
    name: "Jennifer White",
    role: "Designer",
    status: "Rejected",
    date: "18-05-25",
    type: "Rejected",
    progress: "0%",
    completion: "0%",
  },
];

const savedData: DataRecord[] = [
  {
    key: "14",
    name: "Thomas Martin",
    role: "Developer",
    status: "Saved",
    date: "17-05-25",
    type: "Saved",
    progress: "100%",
    completion: "100%",
  },
  {
    key: "15",
    name: "Patricia Garcia",
    role: "Architect",
    status: "Saved",
    date: "17-05-25",
    type: "Saved",
    progress: "100%",
    completion: "100%",
  },
  {
    key: "16",
    name: "Christopher Lee",
    role: "Manager",
    status: "Saved",
    date: "16-05-25",
    type: "Saved",
    progress: "100%",
    completion: "100%",
  },
  {
    key: "17",
    name: "Nancy Rodriguez",
    role: "Analyst",
    status: "Saved",
    date: "16-05-25",
    type: "Saved",
    progress: "100%",
    completion: "100%",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Applied":
      return "success";
    case "Under review":
      return "processing";
    case "Rejected":
      return "error";
    case "Saved":
      return "default";
    default:
      return "default";
  }
};

const columns: ColumnsType<DataRecord> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 150,
    render: (text) => <span className="font-medium text-gray-900">{text}</span>,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status) => (
      <Badge
        status={getStatusColor(status)}
        text={status}
        className="text-gray-700"
      />
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 100,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 100,
  },
  {
    title: "Progress",
    dataIndex: "progress",
    key: "progress",
    width: 80,
    render: (progress) => <span className="text-gray-600">{progress}</span>,
  },
  {
    title: "Completion",
    dataIndex: "completion",
    key: "completion",
    width: 100,
    render: (completion) => <span className="text-gray-600">{completion}</span>,
  },
  {
    title: "Action",
    key: "action",
    width: 150,
    render: () => (
      <Space size="small">
        <Tooltip title="View details">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            className="text-blue-500 hover:text-blue-700"
          >
            Details
          </Button>
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </Tooltip>
      </Space>
    ),
  },
];

export default function DataTable() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const tabItems = [
    { label: "All", key: "all" },
    { label: "Applied", key: "applied" },
    { label: "Under review", key: "under-review" },
    { label: "Rejected", key: "rejected" },
    { label: "Saved", key: "saved" },
  ];

  const getTableData = () => {
    switch (activeTab) {
      case "applied":
        return appliedData;
      case "under-review":
        return underReviewData;
      case "rejected":
        return rejectedData;
      case "saved":
        return savedData;
      case "all":
      default:
        return [
          ...appliedData,
          ...underReviewData,
          ...rejectedData,
          ...savedData,
        ];
    }
  };

  const filteredData = getTableData().filter((record) =>
    record.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Records</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add New
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search records..."
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
  );
}
