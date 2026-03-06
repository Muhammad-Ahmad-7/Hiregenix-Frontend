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
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getAllInterviewsApi,
  getAllTodaysInterviewsApi,
} from "@/app/api/candidate/interview.api";
import { ScheduledInterview } from "@/constants/Interfaces/Types/Jobs.interface";
import { useRouter } from "next/navigation";

// Interfaces
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

interface InterviewCardProps {
  title: string;
  company: string;
  type: string;
  deadline: string;
  logo?: string;
  onJoin: () => void;
}

const InterviewCard = ({
  title,
  company,
  type,
  deadline,
  //  logo,
  onJoin,
}: InterviewCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-gray-400">
            {company?.charAt(0) || "C"}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{company}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <Badge color="blue" text={type} />
          <div className="mt-1">{deadline}</div>
        </div>
        <Button
          type="primary"
          size="small"
          onClick={onJoin}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Join
        </Button>
      </div>
    </div>
  );
};

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [searchText, setSearchText] = useState("");
  const [todaysInterviews, setTodaysInterviews] =
    useState<ScheduledInterview[]>([]);
  const [allInterviews, setAllInterviews] = useState<ScheduledInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [allInterviewsMeta, setAllInterviewsMeta] =
    useState<PaginationMeta | null>(null);

  const router = useRouter();

  // Format date helper
  const formatDate = (dateString: string) => {
    console.log(allInterviewsMeta);
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
        // Replace with your actual API call
        const res = await getAllInterviewsApi({ page: 1, limit: 50, status: "scheduled" });
        if (!res || !res.data) {
          setAllInterviews([]);
          setAllInterviewsMeta(null);
          return;
        }
        setAllInterviews(res.data.interviews || []);
        setAllInterviewsMeta(res.meta || null);

        // Mock data
        // setAllInterviews([]);
        // setAllInterviewsMeta(null);
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
        // Replace with your actual API call
        const res = await getAllTodaysInterviewsApi();
        if (!res || !res.data) {
          setTodaysInterviews([]);
          return;
        }
        setTodaysInterviews(res.data.interviews || []);

        // Mock data
        // setTodaysInterviews([]);
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

  // Filter only scheduled interviews
  const scheduledInterviews = allInterviews.filter(
    (interview) => interview.status === "scheduled"
  );

  // Map API data to table format
  const mapInterviewsToTable = (
    interviews: ScheduledInterview[]
  ): InterviewTableRecord[] =>
    interviews.map((i) => ({
      key: i._id,
      name: i.job?.title || "N/A",
      company: i.company?.companyName || "N/A",
      type: i.type || "N/A",
      role: i.job?.workMode || "N/A",
      date: formatDate(i.scheduledDate),
      interviewStatus: i.status,
    }));

  const filteredAllInterviews = mapInterviewsToTable(
    scheduledInterviews
  ).filter((i) => i.name.toLowerCase().includes(searchText.toLowerCase()));

  const handleJoinInterview = (interviewId: string) => () => {
    // Implement join interview logic here
    router.push(`/candidate/interview-section/${interviewId}`);
  }

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
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-8">
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
      </div> */}

      {/* Interviews Today Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold   text-gray-900 ">
          Interviews Today -
        </h2>
        <p className="text-sm text-gray-600 ">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : todaysInterviews.length > 0 ? (
          <Row gutter={[16, 16]}>
            {todaysInterviews.map((interview) => (
              <Col xs={24} sm={12} lg={8} key={interview._id}>
                <InterviewCard
                  title={interview.job?.title || "N/A"}
                  company={interview.company?.companyName || "N/A"}
                  type={interview.type}
                  deadline={formatDate(
                    interview.job?.deadline || interview.scheduledDate
                  )}
                  logo="/logo.png"
                  onJoin={handleJoinInterview(interview._id)}
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
          All Interviews Analytics
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
          items={[{ label: "Schedule", key: "schedule" }]}
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
