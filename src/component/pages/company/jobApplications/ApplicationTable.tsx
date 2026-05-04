// ==================== ApplicationTable.tsx ====================
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Tabs,
  Dropdown,
  Button,
  Space,
  Typography,
  Card,
  Tag,
  Avatar,
  Modal,
  Tooltip,
} from "antd";
import {
  MoreOutlined,
  UserOutlined,
  MessageOutlined,
  ProfileOutlined,
  EyeFilled,
  MailOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";
import toast from "react-hot-toast";
import TextArea from "antd/es/input/TextArea";
import { sendHiringEmailApi, sendRejectionEmailApi } from "@/app/api/company/jobs.api";
import TableSkeleton from "@/component/Skeletons/TableSkeleton";
import { useRouter } from "next/navigation";
import { getCandidateProfileWithIdApi } from "@/app/api/general/general.api";
import { createChatApi } from "@/app/api/chat/chats.api";

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
  candidate: CandidateInfo;
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
  rank: number;
  [key: string]: unknown;
}

interface ApplicationTableProps {
  data?: InterviewRecord[];
  scheduledInterviews?: number;
  loading?: boolean;
  pagination?: TablePaginationConfig;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  data = [],
  scheduledInterviews = 0,
  loading = false,
  pagination,
  activeTab = "all",
  onTabChange,
}) => {
  const [sortBy, setSortBy] = useState<string>("backend");

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
    if (value >= 85) return "score-badge score-badge--excellent";
    if (value >= 80) return "score-badge score-badge--good";
    if (value >= 70) return "score-badge score-badge--fair";
    return "score-badge score-badge--low";
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
      case "hired":
        return "green";
      case "rejected":
        return "red";
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

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailQuery, setEmailQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<InterviewRecord | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionRecord, setRejectionRecord] = useState<InterviewRecord | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // 1. Add local state for the data
  const [localData, setLocalData] = useState<InterviewRecord[]>(data);

  // 2. Sync if parent data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleHiringEmail = (record: InterviewRecord) => {
    setSelectedRecord(record);
    setIsEmailModalOpen(true);
  };

  const handleEmailSubmit = async () => {
    setLoadingEmail(true);
    console.log("Email Query:", emailQuery);
    console.log("Record:", selectedRecord);
    const res = await sendHiringEmailApi(selectedRecord?._id || "", emailQuery);
    setLoadingEmail(false);
    if (!res || res.status === "Failed") {
      toast.error("Failed to send offer letter email. Please try again.");
      setIsEmailModalOpen(false);
      setEmailQuery("");
      setSelectedRecord(null);
      return;
    }
    if (res.status === "Success") {
      toast.success("Offer letter email sent successfully!");
    }
    setIsEmailModalOpen(false);
    setEmailQuery("");
    setSelectedRecord(null);
    setLocalData((prev) =>
      prev.map((item) =>
        item._id === selectedRecord?._id ? { ...item, status: "hired" } : item
      )
    );
  };

  const handleEmailModalClose = () => {
    setIsEmailModalOpen(false);
    setEmailQuery("");
    setSelectedRecord(null);
  };


  const handleRejectionClick = (record: InterviewRecord) => {
    console.log("z:", record)
    setRejectionRecord(record);
    setIsRejectionModalOpen(true);
  };

  const handleRejectionConfirm = async () => {
    if (!rejectionRecord) return;

    try {
      setIsRejecting(true);

      // Call API to send rejection email
      const res = await sendRejectionEmailApi(rejectionRecord._id);

      if (!res || res.status === "Failed") {
        toast.error("Failed to send rejection email. Please try again.");
        setIsRejectionModalOpen(false);
        setRejectionRecord(null);
        return;
      }

      if (res.status === "Success") {
        toast.success("Rejection email sent successfully!");
      }


      setIsRejectionModalOpen(false);
      setRejectionRecord(null);
      setLocalData((prev) =>
        prev.map((item) =>
          item._id === rejectionRecord._id ? { ...item, status: "rejected" } : item
        )
      );
    } catch (error) {
      console.error("Failed to send rejection email:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRejectionCancel = () => {
    if (isRejecting) return; // prevent close while loading
    setIsRejectionModalOpen(false);
    setRejectionRecord(null);
  };

  const handleChat = async (record: InterviewRecord) => {
    try {
      const candidateProfileId =
        (record)?.candidate?._id ?? record?.candidate?._id;

      if (!candidateProfileId) {
        toast.error("Invalid candidate");
        return;
      }

      const candidateRes = await getCandidateProfileWithIdApi(candidateProfileId);
      const participantUserId = candidateRes?.data?.candidate?.userId?._id;

      if (!participantUserId) {
        toast.error("Candidate user not found");
        return;
      }

      const chatRes = await createChatApi(participantUserId);
      const chatId = chatRes?.data?.chat?._id;

      if (chatId) {
        router.push(`/company/chat?participantId=${participantUserId}&chatId=${chatId}`);
      } else {
        router.push(`/company/chat?participantId=${participantUserId}`);
      }
    } catch (error) {
      console.error("Failed to open chat:", error);
      toast.error("Failed to open chat");
    }
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
      title: "Rank",
      key: "rank",
      render: (_: unknown, record: InterviewRecord) => {
        return (
          <div
            className="text-center rounded-md py-1 font-medium"
          >
            {record.rank !== undefined ? record.rank : "N/A"}
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
      render: (_: unknown, record: InterviewRecord) => {
        const hasScheduledInterviews = scheduledInterviews > 0;
        const hireRejectDisabled = hasScheduledInterviews;
        const disabledMessage =
          "You can not hire/reject when the interviews are still in scheduled. Wait for all the interviews to be completed before hiring someone.";

        const hiringLabel = hireRejectDisabled ? (
          <Tooltip title={disabledMessage} placement="left">
            <span>Send Offer Letter Email</span>
          </Tooltip>
        ) : (
          "Send Offer Letter Email"
        );

        const rejectionLabel = hireRejectDisabled ? (
          <Tooltip title={disabledMessage} placement="left">
            <span>Send Rejection Email</span>
          </Tooltip>
        ) : (
          "Send Rejection Email"
        );

        const actionButton = (
          <Button
            type="text"
            icon={<MoreOutlined />}
            disabled={record.status?.toLowerCase() === "rejected" || record.status?.toLowerCase() === "hired"}
            className="hover:bg-gray-100 rounded-full"
          />
        );

        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: "sendHiringEmail",
                  label: hiringLabel,
                  icon: <MailOutlined />,
                  disabled: hireRejectDisabled,
                  onClick: () => handleHiringEmail(record),
                },
                {
                  key: "sendRejectionEmail",
                  label: rejectionLabel,
                  icon: <MailOutlined />,
                  disabled: hireRejectDisabled,
                  onClick: () => handleRejectionClick(record),
                },
                {
                  key: "viewProfile",
                  label: "View Profile",
                  icon: <ProfileOutlined />,
                  onClick: () => {
                    console.log("record", record)
                    const id =
                      (record)?.candidate?._id ?? record?.candidate?._id;
                    if (!id) return toast.error("Invalid candidate");


                    router.push(`/company/view-profile/${id}`);
                  },
                },
                {
                  key: "chat",
                  label: "Chat",
                  icon: <MessageOutlined />,
                  onClick: () => handleChat(record),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Space>
              {hasScheduledInterviews ? (
                <Tooltip title={""} placement="top">
                  <span>{actionButton}</span>
                </Tooltip>
              ) : (
                actionButton
              )}
            </Space>
          </Dropdown>
        );
      },
    },
  ];

  const router = useRouter()
  // Sort data
  const getSortedData = (inputData: InterviewRecord[]) => {
    const sorted = [...inputData];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) =>
          (a.candidate?.fullName || "").localeCompare(
            b.candidate?.fullName || ""
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

  const sortedData = getSortedData(localData);

  const filterMenu = {
    items: [
      { key: "backend", label: "Backend Order" },
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
        onChange={(tab) => onTabChange?.(tab)}
        items={[
          { key: "all", label: "All Interviews" },
          { key: "best", label: "Best Matches" },
          // { key: "failed", label: "Failed" },
          { key: "scheduled", label: "Scheduled" },
          { key: "completed", label: "Completed" },
          // { key: "hired", label: "Hired" },
          // { key: "rejected", label: "Rejected" },
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
            {/* <Button>
              Sort by <DownOutlined />
            </Button> */}
          </Dropdown>
          {/* <Input
            placeholder="Search by candidate name"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          /> */}
        </Space>
      </div>

      {/* Table */}
      {
        loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <Table
            columns={columns}
            dataSource={sortedData.map((item) => ({ ...item, key: item._id }))}
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
        )
      }
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MailOutlined className="text-blue-500" />
            <span>Send Offer Letter Email</span>
          </div>
        }
        open={isEmailModalOpen}
        onCancel={handleEmailModalClose}
        footer={[
          <Button key="cancel" onClick={handleEmailModalClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={!emailQuery.trim()}
            onClick={handleEmailSubmit}
          >
            {loadingEmail ? "Submitting..." : "Submit"}
          </Button>,
        ]}
        width={520}
      >
        <div className="py-4 flex flex-col gap-3">
          <p className="text-gray-500 text-sm">
            Describe the role, requirements, joining date, or any specific details you&apos;d like
            included in the offer letter email.
          </p>

          <TextArea
            rows={5}
            placeholder="e.g. Senior React Developer, 5+ years experience, remote position, competitive salary..."
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            className="resize-none"
            maxLength={500}
            showCount
          />
        </div>
      </Modal>

      <Modal
        open={isRejectionModalOpen}
        onCancel={handleRejectionCancel}
        closable={!isRejecting}
        maskClosable={!isRejecting}
        footer={[
          <Button
            key="cancel"
            onClick={handleRejectionCancel}
            disabled={isRejecting}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            danger
            type="primary"
            loading={isRejecting}
            onClick={handleRejectionConfirm}
          >
            Yes, Send Rejection
          </Button>,
        ]}
        width={440}
      >
        <div className="flex items-start gap-4 py-4">
          <ExclamationCircleOutlined className="text-red-500 text-2xl mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-gray-800 font-semibold text-base m-0">
              Send Rejection Email?
            </p>
            <p className="text-gray-500 text-sm m-0">
              You are about to send a rejection email. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default ApplicationTable;
