"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Tabs,
  Input,
  Button,
  Dropdown,
  Space,
  Typography,
  Card,
  Spin,
  message,
} from "antd";
import { PlusOutlined, SearchOutlined, DownOutlined } from "@ant-design/icons";
import { getAllJobsApi } from "@/app/api/job/jobs.api";

const { Title } = Typography;

const MyJobsTable = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobsApi();
      setJobs(res?.data?.jobs || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Filter by active tab & search
  const filteredJobs = jobs
    .filter((job) => job.status === activeTab)
    .filter((job) => job.title.toLowerCase().includes(search.toLowerCase()));

  // ✅ Define table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <span>
          {record.location?.city}, {record.location?.country}
        </span>
      ),
    },
    {
      title: "Work Mode",
      dataIndex: "workMode",
      key: "workMode",
      render: (text) => <span className="capitalize">{text || "N/A"}</span>,
    },
    {
      title: "Experience",
      dataIndex: "experienceLevel",
      key: "experienceLevel",
      render: (text) => <span className="capitalize">{text}</span>,
    },
    {
      title: "Salary",
      key: "salaryRange",
      render: (_, record) => {
        const salary = record.salaryRange;
        if (!salary) return "—";
        return `${salary.min} - ${salary.max} ${salary.currency}`;
      },
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <Button
          type="link"
          className="p-0"
          onClick={() => message.info(`Viewing details for ${record.title}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // ✅ Dropdown Filter Menu (future feature)
  const filterMenu = {
    items: [
      { key: "1", label: "All" },
      { key: "2", label: "Internship" },
      { key: "3", label: "Full-time" },
      { key: "4", label: "Part-time" },
    ],
  };

  return (
    <Card className="rounded-2xl shadow-sm p-6">
      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarGutter={40}
        items={[
          { key: "open", label: "Open Jobs" },
          { key: "closed", label: "Closed Jobs" },
        ]}
        className="mb-4 font-semibold"
      />

      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <Title level={5} className="!m-0 text-blue-600 font-semibold">
          Results: {filteredJobs.length} jobs found
        </Title>

        <Space>
          <Dropdown menu={filterMenu} trigger={["click"]}>
            <Button>
              Filter <DownOutlined />
            </Button>
          </Dropdown>

          <Input
            placeholder="Search jobs..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />

          <Button type="primary" icon={<PlusOutlined />}>
            Add New
          </Button>
        </Space>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredJobs.map((job) => ({ ...job, key: job._id }))}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 5,
            showSizeChanger: false,
          }}
          bordered
          className="rounded-lg overflow-hidden"
        />
      )}
    </Card>
  );
};

export default MyJobsTable;
