"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, Tabs, Modal, Avatar, DatePicker, Button, Descriptions, Tag, GetProps, Spin } from "antd";
import { getAllInterviewsApi, scheduleInterviewApi } from "@/app/api/candidate/interview.api";
import { ScheduledInterview } from "@/constants/Interfaces/Types/Jobs.interface";
import { EyeFilled } from "@ant-design/icons";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import TableSkeleton from "@/component/Skeletons/TableSkeleton";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

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
  rejected: "rejected",
  hired: "hired",
  ended: "ended",
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

  // States
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ScheduledInterview | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState<Date | null>(null); // store ISO string
  const [loadingButton, setLoadingButton] = useState(false);

  // Open job modal
  const openJobModal = (job: ScheduledInterview) => {
    setSelectedJob(job);
    setJobModalOpen(true);
  };

  // Open reschedule modal
  const handleRescheduleClick = () => {
    setRescheduleModalOpen(true);
    setNewDate(null);
  };

  // Handle date change
  const handleDateChange = (dateString: Date) => {
    setNewDate(dateString);
  };

  // Submit reschedule
  const submitReschedule = async () => {
    setLoadingButton(true)
    if (!selectedJob || !newDate) {
      toast.error("Please select a valid date.");
      return;
    }
    console.log("Rescheduling job:", selectedJob._id, "to", newDate);
    const date = new Date(newDate.toISOString()).toLocaleDateString('en-CA')
    console.log("date", date)
    const res = await scheduleInterviewApi({
      jobId: selectedJob.job._id,
      scheduledDate: date,
    });
    if (!res) {
      setRescheduleModalOpen(false);
      setJobModalOpen(false);
      setLoadingButton(false);
      return;
    }
    if (res.status === "Failed") {
      console.log("Failed", res.message);
      toast.error(res.message || "Error Interview scheduling....");
      setRescheduleModalOpen(false);
      setJobModalOpen(false);
      setLoadingButton(false);
      return;
    }

    toast.success(res.message || "Interview rescheduled successfully");
    setRescheduleModalOpen(false);
    setJobModalOpen(false);
    setLoadingButton(false);
    // fetchInterviews();
    interviews.map((interview) => {
      if (interview._id === selectedJob._id) {
        interview.scheduledDate = date;
      }
      return interview;
    });
    setInterviews([...interviews]);
  };

  // Disable dates before today or after deadline
  const disableDates: RangePickerProps["disabledDate"] = (current) => {
    if (!selectedJob) return true;

    const selectedDate = DateTime.fromJSDate(current.toDate());
    const today = DateTime.now().startOf("day");
    const deadline = DateTime.fromISO(selectedJob.job.deadline).endOf("day");

    return selectedDate < today || selectedDate > deadline;
  };

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
    const statusConfig: Record<
      string,
      { color: string; background: string; border?: string; text?: string }
    > = {
      scheduled: { color: "#096dd9", background: "#e6f7ff", text: "Scheduled" }, // blue
      completed: { color: "#391085", background: "#f3e6ff", text: "Completed" }, // purple
      cancelled: { color: "#a8071a", background: "#fff1f0", text: "Rejected" }, // red
      pending: { color: "#ad8b00", background: "#fffbe6", text: "Pending" }, // yellow
    };

    const config = statusConfig[status] || { color: "#666", background: "#f0f0f0", text: status };

    return (
      <Tag
        style={{
          color: config.color,
          backgroundColor: config.background,
          border: config.border || "none",
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      >
        {config.text}
      </Tag>
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
      render: (text: string, record: ReturnType<typeof getTableData>[number]) => (
        <a
          className="text-blue-600 hover:text-blue-700 cursor-pointer"
          onClick={() => openJobModal(record._raw)}
        >
          {text}
        </a>
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
          <span className="capitalize">{companyName}</span>
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
      title: "Scheduled Date",
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
    { key: "hired", label: "Hired" },
    { key: "rejected", label: "Rejected" },
    { key: "ended", label: "Ended" },
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

        {
          loading ? (
            <TableSkeleton />
          ) : (
            <Table
              columns={columns}
              dataSource={tableData}
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
          )
        }
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
      {/* Job Detail Modal */}
      <Modal
        open={jobModalOpen}
        onCancel={() => setJobModalOpen(false)}
        footer={
          <Button type="primary" onClick={handleRescheduleClick} disabled={selectedJob?.status !== "scheduled"}>
            Reschedule Interview
          </Button>
        }
        width={800}
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{selectedJob?.job.title}</span>
          </div>
        }
      >
        {selectedJob && (
          <Descriptions
            bordered
            column={1}
            size="middle"
            layout="vertical"
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="Role">{selectedJob.job.role}</Descriptions.Item>
            <Descriptions.Item label="Experience Level">{selectedJob.job.experienceLevel}</Descriptions.Item>
            <Descriptions.Item label="Work Mode">
              <Tag color={selectedJob.job.workMode === "remote" ? "green" : "blue"}>
                {selectedJob.job.workMode.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedJob.job.location.city}, {selectedJob.job.location.country}
            </Descriptions.Item>
            <Descriptions.Item label="Salary">
              {selectedJob.job.salaryRange.min} - {selectedJob.job.salaryRange.max} {selectedJob.job.salaryRange.currency}
            </Descriptions.Item>
            <Descriptions.Item label="Deadline">
              {formatDate(selectedJob.job.deadline!)}
            </Descriptions.Item>
            <Descriptions.Item label="Required Skills">
              <div className="flex flex-wrap gap-2">
                {selectedJob.job.requiredSkills.map((skill, i) => (
                  <Tag color="blue" key={i} style={{ marginBottom: 4 }}>
                    {skill}
                  </Tag>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal >

      {/* Reschedule Modal */}
      < Modal
        open={rescheduleModalOpen}
        title="Select a New Interview Date"
        onCancel={() => setRescheduleModalOpen(false)}
        footer={
          [
            <Button key="submit" type="primary" onClick={submitReschedule} disabled={!newDate}>
              {loadingButton ? (
                <Spin size="small" />
              ) : (
                "Submit"
              )}
            </Button>,
          ]}
      >
        <DatePicker
          value={newDate}
          onChange={handleDateChange}
          disabledDate={disableDates}
          style={{ width: "100%" }}
        />
      </ Modal>
    </>
  );
};

export default JobApplicationsTable;