"use client";

import { useCallback, useEffect, useState } from "react";
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
  Modal,
  DatePicker,
  GetProps,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getAllInterviewsApi,
  getAllTodaysInterviewsApi,
  scheduleInterviewApi,
} from "@/app/api/candidate/interview.api";
import { ScheduledInterview, TodayInterviews } from "@/constants/Interfaces/Types/Jobs.interface";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { DateTime } from "luxon";
import TableSkeleton from "@/component/Skeletons/TableSkeleton";
import CardSkeleton from "@/component/Skeletons/CardSkeleton";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

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
  status: string;
  logo?: string;
  onStart: () => void;
}

const InterviewCard = ({
  title,
  company,
  type,
  deadline,
  status,
  logo,
  onStart,
}: InterviewCardProps & { onStart: () => void }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          {logo ? (
            <Image
              src={logo}
              alt={`${company} logo`}
              width={48}
              height={48}
              className="object-cover w-full h-full rounded-xl"
            />
          ) : (
            <div className="text-gray-400 text-sm">No Logo</div>
          )}
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

        {status === "scheduled" ? (
          <Button
            type="primary"
            size="small"
            onClick={onStart}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Start
          </Button>
        ) : (
          <Tag color="success">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        )}
      </div>
    </div>
  );
};

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [searchText, setSearchText] = useState("");
  const [todaysInterviews, setTodaysInterviews] =
    useState<TodayInterviews[]>([]);
  const [allInterviews, setAllInterviews] = useState<ScheduledInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayInterviewsLoading, setTodayInterviewsLoading] = useState(true);
  const [allInterviewsMeta, setAllInterviewsMeta] =
    useState<PaginationMeta | null>(null);

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState<Date | null>(null); // store ISO string
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ScheduledInterview | null>(null);
  // const [dateFilter, setDateFilter] = useState<"week" | "month" | null>(null);

  const [guidelineModalOpen, setGuidelineModalOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

  const router = useRouter();

  // Handle date change
  const handleDateChange = (dateString: Date) => {
    setNewDate(dateString);
  };

  // Submit reschedule
  const submitReschedule = async () => {
    if (!selectedJob || !newDate) {
      toast.error("Please select a valid date.");
      return;
    }
    setLoadingButton(true)
    console.log("Rescheduling job:", selectedJob._id, "to", newDate);
    const date = new Date(newDate.toISOString()).toLocaleDateString('en-CA')
    console.log("date", date)
    const res = await scheduleInterviewApi({
      jobId: selectedJob.job._id,
      scheduledDate: date,
    });
    if (!res) {
      setRescheduleModalOpen(false);
      setLoadingButton(false);
      return;
    }
    if (res.status === "Failed") {
      console.log("Failed", res.message);
      toast.error(res.message || "Error Interview scheduling....");
      setRescheduleModalOpen(false);
      setLoadingButton(false);
      return;
    }

    toast.success(res.message || "Interview rescheduled successfully");
    setRescheduleModalOpen(false);
    setLoadingButton(false);
    // fetchInterviews();
    allInterviews.map((interview) => {
      if (interview._id === selectedJob._id) {
        interview.scheduledDate = date;
      }
      return interview;
    });
    setAllInterviews([...allInterviews]);
  };

  // Disable dates before today or after deadline
  const disableDates: RangePickerProps["disabledDate"] = (current) => {
    if (!selectedJob) return true;

    const selectedDate = DateTime.fromJSDate(current.toDate());
    const today = DateTime.now().startOf("day");
    const deadline = DateTime.fromISO(selectedJob?.job?.deadline).endOf("day");

    return selectedDate < today || selectedDate > deadline;
  };

  const handleRescheduleClick = (data: ScheduledInterview) => {
    console.log("data", data);
    setSelectedJob(data._raw)
    setRescheduleModalOpen(true);
    setNewDate(null);
  };


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

  const fetchTodaysInterviews = useCallback(async () => {
    try {
      setTodayInterviewsLoading(true);
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
      setTodayInterviewsLoading(false);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    fetchTodaysInterviews();
  }, [fetchTodaysInterviews]);



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
    fetchAllInterviews();
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
      deadline: i.job.deadline,
      _raw: i,
    }));

  const filteredAllInterviews = mapInterviewsToTable(
    scheduledInterviews
  ).filter((i) => i.name.toLowerCase().includes(searchText.toLowerCase()));

  // const handleJoinInterview = (interviewId: string) => () => {
  //   // Implement join interview logic here
  //   router.push(`/candidate/interview-section/${interviewId}`);
  // }

  const handleStartInterview = (id: string) => {
    setSelectedInterviewId(id);
    setGuidelineModalOpen(true);
  };

  // Columns for Table
  const columns: ColumnsType<InterviewTableRecord> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium cursor-pointer hover:underline">
          {text}
        </span>
      ),
    },
    { title: "Company", dataIndex: "company", key: "company" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
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
      render: (status: string) => {
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
      render: (raw) => (
        <Space>
          <Tooltip title="Reschedule">
            <Button
              type="link"
              className="text-blue-500 hover:text-blue-700"
              size="small"
              onClick={() => handleRescheduleClick(raw)}
            >
              Reschedule
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen flex flex-col gap-6">
      {/* Interviews Today Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Interviews Today
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {todayInterviewsLoading ? (
          <CardSkeleton />
        ) : todaysInterviews.length > 0 ? (
          <Row gutter={[16, 16]}>
            {todaysInterviews.map((interview) => (
              <Col xs={24} sm={12} lg={8} key={interview._id}>
                <InterviewCard
                  title={interview.jobId?.title || "N/A"}
                  company={interview.companyId?.companyName || "N/A"}
                  status={interview.status}
                  type={interview.type}
                  deadline={formatDate(
                    interview.jobId?.deadline || interview.scheduledDate
                  )}
                  logo={interview.companyId?.logoUrl || ""}
                  onStart={() => handleStartInterview(interview._id)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
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
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            All Interviews Analytics
          </h2>
        </div>

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

        <div className="flex flex-wrap gap-2 mb-4">
          {/* <Button
            type={dateFilter === "week" ? "primary" : "default"}
            onClick={() => setDateFilter("week")}
          >
            Last 7 Days
          </Button> */}

          {/* <Button
            type={dateFilter === "month" ? "primary" : "default"}
            onClick={() => setDateFilter("month")}
          >
            Last 1 Month
          </Button> */}

          {/* <Button
            onClick={() => setDateFilter(null)}
          >
            Reset
          </Button> */}
        </div>

        {/* Table */}
        {
          loading ? (
            <TableSkeleton />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredAllInterviews}
              pagination={{
                pageSize: 5,
                total: filteredAllInterviews.length,
                showTotal: (total) => `Total ${total} items`,
              }}
              scroll={{ x: 1200 }}
              rowClassName="hover:bg-gray-50"
            />
          )

        }
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
        <Modal
          open={guidelineModalOpen}
          title="Before You Start the Interview"
          onCancel={() => setGuidelineModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setGuidelineModalOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="next"
              type="primary"
              onClick={() => {
                if (selectedInterviewId) {
                  router.push(
                    `/candidate/interview-section/${selectedInterviewId}`
                  );
                }
              }}
            >
              I Understand, Continue
            </Button>,
          ]}
        >
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Do not switch tabs during the interview</li>
            <li>Sit in a well-lit environment</li>
            <li>Ensure your face is clearly visible</li>
            <li>Check camera & microphone before starting</li>
            <li>Maintain stable internet connection</li>
            <li>Avoid background noise and distractions</li>
          </ul>
        </Modal>
      </div>
    </div>
  );
}
