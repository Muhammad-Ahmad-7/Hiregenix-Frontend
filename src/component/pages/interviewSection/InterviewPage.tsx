"use client";

import { useEffect, useState } from "react";
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
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import InterviewCard from "./InterviewCard";
import {
  getAllInterviewsApi,
  getAllTodaysInterviewsApi,
} from "@/app/api/candidate/interview.api";

// Interfaces
export interface Interview {
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
  status: string;
  aiResult: {
    strengths: string[];
    improvements: string[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface InterviewTableRecord {
  key: string;
  name: string;
  company: string;
  type: string;
  role: string;
  date: string;
  interviewStatus: string;
}

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [searchText, setSearchText] = useState("");
  const [todaysInterviews, setTodaysInterviews] = useState<Interview[]>([]);
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [allInterviewsMeta, setAllInterviewsMeta] =
    useState<PaginationMeta | null>(null);
  {
    console.log(allInterviewsMeta);
  }
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchAllInterviews = async () => {
      try {
        setLoading(true);
        const res = await getAllInterviewsApi({ page: 1, limit: 50 });
        setAllInterviews(res.data.interviews || []);
        setAllInterviewsMeta(res.meta || null);
      } catch (err) {
        console.error("Error fetching all interviews:", err);
        setAllInterviews([]);
        setAllInterviewsMeta(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchTodaysInterviews = async () => {
      try {
        setLoading(true);
        const res = await getAllTodaysInterviewsApi();
        setTodaysInterviews(res.data.interviews || []);
      } catch (err) {
        console.error("Error fetching today's interviews:", err);
        setTodaysInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllInterviews();
    fetchTodaysInterviews();
  }, []);

  // Map API data to table format
  const mapInterviewsToTable = (
    interviews: Interview[]
  ): InterviewTableRecord[] =>
    interviews.map((i) => ({
      key: i._id,
      name: i.jobId?.title || "N/A",
      company: i.companyId?.companyName || "N/A",
      type: i.type || "N/A",
      role: i.jobId?.workMode || "N/A",
      date: formatDate(i.scheduledDate),
      interviewStatus: i.status,
    }));

  const filteredAllInterviews = mapInterviewsToTable(allInterviews).filter(
    (i) => i.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Columns for Table
  const columns: ColumnsType<InterviewTableRecord> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-blue-600 cursor-pointer hover:underline">
          {text}
        </span>
      ),
    },
    { title: "Company", dataIndex: "company", key: "company" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const colors: Record<string, string> = {
          Onsite: "cyan",
          Task: "purple",
          Phone: "blue",
        };
        return <Badge color={colors[type] || "default"} text={type} />;
      },
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Interview Status",
      dataIndex: "interviewStatus",
      key: "interviewStatus",
      render: (status) => {
        const color =
          status === "scheduled"
            ? "processing"
            : status === "completed"
            ? "success"
            : "error";
        return (
          <Badge
            status={color}
            text={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space>
          <Tooltip title="Reschedule">
            <Button
              type="link"
              className="text-blue-500 hover:text-blue-700"
              size="small"
            >
              Reschedule
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              year: "numeric",
            })}
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : todaysInterviews.length > 0 ? (
          <Row gutter={[16, 16]}>
            {todaysInterviews.map((interview) => (
              <Col xs={24} sm={12} lg={8} key={interview._id}>
                <InterviewCard
                  title={interview.jobId?.title || "N/A"}
                  company={interview.companyId?.companyName || "N/A"}
                  type={interview.type}
                  deadline={formatDate(
                    interview.jobId?.deadline || interview.scheduledDate
                  )}
                  logo="/logo.png"
                  onJoin={() =>
                    alert(`Joining interview for ${interview.jobId?.title}`)
                  }
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">
              No interviews scheduled for today
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later or schedule a new interview
            </p>
          </div>
        )}
      </div>

      {/* Interviews Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interviews Analytics
        </h2>

        {/* Search */}
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
          items={[
            { label: "Schedule", key: "schedule" },
            { label: "History", key: "history" },
          ]}
          className="mb-6"
        />

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredAllInterviews}
          pagination={{
            pageSize: 5,
            total: filteredAllInterviews.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1200 }}
          rowClassName="hover:bg-gray-50"
        />
      </div>
    </div>
  );
}
