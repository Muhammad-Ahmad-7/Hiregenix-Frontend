"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Tabs, Modal, Avatar } from "antd";
import { getAllInterviewsApi } from "@/app/api/candidate/interview.api";
import { ScheduledInterview } from "@/constants/Interfaces/Types/Jobs.interface";
import { EyeFilled } from "@ant-design/icons";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AIReport {
  topStrengths: string[];
  topWeaknesses: string[];
  overallImprovementSuggestions: string[];
}

// Tab key → API status value mapping
const TAB_STATUS_MAP: Record<string, string | undefined> = {
  all: undefined,
  scheduled: "scheduled",
  completed: "completed",
  rejected: "cancelled",
};

const JobApplicationsTable = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // AI Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  const PAGE_SIZE = 5;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllInterviewsApi({
        page: currentPage,
        limit: PAGE_SIZE,
        status: TAB_STATUS_MAP[activeTab] as string,
      });
      if (!res || !res.data || !res.data.interviews) {
        setInterviews([]);
        setMeta(null);
        return;
      }
      setInterviews(res.data.interviews || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setInterviews([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const getTableData = () =>
    interviews.map((interview) => ({
      key: interview._id,
      title: interview.job?.title || "N/A",
      company: interview.company?.companyName || "N/A",
      logoUrl: interview.company?.logoUrl || null,
      type: interview.job?.workMode || "N/A",
      date: formatDate(interview.scheduledDate),
      status: interview.status,
      report: interview.report || null,
      _raw: interview,
    }));

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string }> = {
      scheduled: { color: "#1890ff" },
      completed: { color: "#722ed1" },
      cancelled: { color: "#f5222d" },
    };
    const config = statusConfig[status] || { color: "#666" };
    return (
      <span className="text-sm text-gray-700">
        <span style={{ color: config.color }}>•</span>{" "}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const openReportModal = (report: AIReport, jobTitle: string) => {
    setSelectedReport(report);
    setSelectedJobTitle(jobTitle);
    setReportModalOpen(true);
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
      render: (companyName: string, record: ReturnType<typeof getTableData>[number]) => (
        <div className="flex items-center gap-2">
          {record.logoUrl && (
            <Avatar shape="square" size={32} src={record.logoUrl} />
          )}
          {/* 
          <Avatar
            src={candidate?.profilePictureUrl}
            icon={<UserOutlined />}
            size={40}
          /> */}
          <a className="text-blue-600 hover:text-blue-700">{companyName}</a>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <span className="capitalize">{type}</span>,
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
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ReturnType<typeof getTableData>[number]) => (
        <div className="flex gap-2 flex-wrap">
          {record.report ? (
            <a
              className="text-purple-600 hover:text-purple-700 text-sm whitespace-nowrap"
              onClick={() => openReportModal(record.report as AIReport, record.title)}
            >
              <EyeFilled /> AI Report
            </a>
          ) : (
            <span className="text-gray-400 text-sm">No Actions</span>
          )}
        </div>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: "All jobs" },
    { key: "scheduled", label: "Scheduled" },
    { key: "completed", label: "Completed" },
    { key: "rejected", label: "Rejected" },
  ];

  const tableData = getTableData();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Job Applications</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm w-full">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-4"
        />

        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            Results:{" "}
            <span className="font-semibold text-gray-900">
              {meta?.total ?? tableData.length}
            </span>{" "}
            Jobs
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={{
            current: currentPage,
            total: meta?.total ?? tableData.length,
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
            className: "flex justify-end",
            itemRender: (page, type, originalElement) => {
              if (type === "jump-prev" || type === "jump-next")
                return <span className="px-2">...</span>;
              return originalElement;
            },
          }}
          className="border border-gray-200 rounded-lg overflow-x-auto"
        />
      </div>

      {/* AI Report Modal */}
      <Modal
        open={reportModalOpen}
        onCancel={() => setReportModalOpen(false)}
        footer={null}
        width={680}
        title={
          <div className="flex items-center gap-2">
            <span className="text-purple-600 text-lg">✦</span>
            <span className="text-base font-semibold text-gray-900">
              AI Interview Report
            </span>
            {selectedJobTitle && (
              <span className="text-sm font-normal text-gray-500">
                — {selectedJobTitle}
              </span>
            )}
          </div>
        }
      >
        {selectedReport && (
          <div className="flex flex-col gap-5 pt-2">

            {/* Strengths */}
            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-3">
                <span className="text-base">💪</span> Top Strengths
              </h3>
              <ul className="flex flex-col gap-2">
                {selectedReport.topStrengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-lg border border-red-100 bg-red-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-3">
                <span className="text-base">⚠️</span> Top Weaknesses
              </h3>
              <ul className="flex flex-col gap-2">
                {selectedReport.topWeaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Suggestions */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-3">
                <span className="text-base">🚀</span> Improvement Suggestions
              </h3>
              <ul className="flex flex-col gap-2">
                {selectedReport.overallImprovementSuggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </Modal>
    </>
  );
};

export default JobApplicationsTable;