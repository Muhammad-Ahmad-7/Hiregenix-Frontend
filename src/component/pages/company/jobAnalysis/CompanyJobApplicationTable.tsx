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
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobApi,
  getCompanyClosedJobsApi,
  getCompanyOpenJobsApi,
} from "@/app/api/company/jobs.api";
import {
  appendClosedJobs,
  appendOpenJobs,
  setCompanyClosedJobs,
  setCompanyOpenJobs,
  setLoading,
} from "@/redux/slices/company/companyJobSlice";
import { RootState } from "@/redux/store";
import { Job_Interface } from "@/constants/Interfaces/Types/Jobs.interface";

const { Title } = Typography;

const MyJobsTable = () => {
  const dispatch = useDispatch();

  const { openJobs, closedJobs, openMeta, closedMeta, loading } = useSelector(
    (state: RootState) => state.companyJob
  );

  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [search, setSearch] = useState("");

  // -----------------------
  // Fetch Jobs API
  // -----------------------
  const fetchOpenJobs = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const res = await getCompanyOpenJobsApi(page);

      const jobs: Job_Interface[] = res?.data?.findActiveJobs || [];
      const meta = res.meta;

      if (page === 1) {
        dispatch(setCompanyOpenJobs({ jobs, meta }));
      } else {
        dispatch(appendOpenJobs({ jobs, meta }));
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch open jobs");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchClosedJobs = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const res = await getCompanyClosedJobsApi(page);

      const jobs: Job_Interface[] = res?.data?.findClosedJobs || [];
      const meta = res.meta;

      if (page === 1) {
        dispatch(setCompanyClosedJobs({ jobs, meta }));
      } else {
        dispatch(appendClosedJobs({ jobs, meta }));
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch closed jobs");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // -----------------------
  // Initial fetch
  // -----------------------
  useEffect(() => {
    if (openJobs === null && closedJobs === null) {
      if (activeTab === "open") {
        fetchOpenJobs();
      } else {
        fetchClosedJobs();
      }
    }
  }, [activeTab]);

  // -----------------------
  // Filtered Jobs for Table
  // -----------------------
  const filteredJobs =
    (activeTab === "open" ? openJobs : closedJobs)?.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

  // -----------------------
  // Table Columns
  // -----------------------
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
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
      render: (_: unknown, record: Job_Interface) => (
        <span>
          {record.location?.city}, {record.location?.country}
        </span>
      ),
    },
    {
      title: "Work Mode",
      dataIndex: "workMode",
      key: "workMode",
      render: (text: string) => (
        <span className="capitalize">{text || "N/A"}</span>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experienceLevel",
      key: "experienceLevel",
      render: (text: string) => <span className="capitalize">{text}</span>,
    },
    {
      title: "Salary",
      key: "salaryRange",
      render: (_: unknown, record: Job_Interface) => {
        const salary = record.salaryRange;
        if (!salary) return "—";
        return `${salary.min} - ${salary.max} ${salary.currency}`;
      },
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      title: "Details",
      key: "details",
      render: (_: unknown, record: Job_Interface) => (
        <Button
          type="link"
          className="p-0"
          onClick={() => {
            message.info(`Viewing details for ${record.title}`);
            deleteJobApi({ jobId: record._id }).then((res) => {
              console.log("Delete response:", res);
            });
          }}
        >
          View
        </Button>
      ),
    },
  ];

  // -----------------------
  // Dropdown Filter (future)
  // -----------------------
  const filterMenu = {
    items: [
      { key: "1", label: "All" },
      { key: "2", label: "Internship" },
      { key: "3", label: "Full-time" },
      { key: "4", label: "Part-time" },
    ],
  };

  // -----------------------
  // Load More Button
  // -----------------------
  const loadMoreJobs = () => {
    if (activeTab === "open" && openMeta) {
      const nextPage = openMeta.page + 1;
      if (nextPage <= openMeta.totalPages) fetchOpenJobs(nextPage);
    } else if (activeTab === "closed" && closedMeta) {
      const nextPage = closedMeta.page + 1;
      if (nextPage <= closedMeta.totalPages) fetchClosedJobs(nextPage);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm p-6">
      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as "open" | "closed")}
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
        <>
          <Table
            columns={columns}
            dataSource={filteredJobs.map((job) => ({ ...job, key: job._id }))}
            pagination={false} // Using Load More
            bordered
            className="rounded-lg overflow-hidden"
          />
          {/* Load More */}
          {(activeTab === "open" ? openMeta : closedMeta)?.page <
            (activeTab === "open"
              ? openMeta?.totalPages
              : closedMeta?.totalPages) && (
            <div className="flex justify-center mt-4">
              <Button onClick={loadMoreJobs} type="dashed">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default MyJobsTable;
