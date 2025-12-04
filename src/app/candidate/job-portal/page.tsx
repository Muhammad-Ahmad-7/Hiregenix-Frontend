"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  List,
  Avatar,
  Tag,
  Typography,
  Row,
  Col,
  Image,
  Dropdown,
  Divider,
  Spin,
  Select,
  Input,
  Modal,
  DatePicker,
} from "antd";
import {
  EnvironmentOutlined,
  LaptopOutlined,
  EllipsisOutlined,
  NotificationFilled,
  BuildFilled,
  CalendarFilled,
  SearchOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import UiButton from "@/component/common/CustomButton";
import { TopIconAndNavigation } from "../dashboard/page";
import IconWrapper from "@/icons/IconWrapper";

import {
  getAllJobsWithScrollingApi,
  getRecommendedJobsApi,
} from "@/app/api/candidate/jobs.api";

import dayjs, { Dayjs } from "dayjs";
import { scheduleInterviewApi } from "@/app/api/candidate/interview.api";

const { Title, Paragraph } = Typography;
const { Search } = Input;

const items = [
  { label: "Save Job", key: "0" },
  { label: "Share", key: "1" },
  { type: "divider" },
  { label: "Report", key: "3" },
];

export interface JobInterface {
  location: { city: string; country: string };
  salaryRange: { min: number; max: number; currency: string };
  _id: string;
  companyId: {
    _id: string;
    companyName: string;
    logoUrl: string;
    website: string;
  };
  title: string;
  role: string;
  interviewGuideline: string;
  experienceLevel: string;
  description: string;
  requiredSkills: string[];
  requirements: string[];
  workMode: string;
  deadline: string;
  aiSummary: string;
  embeddingSynced: boolean;
  qdrantId: string | null;
  isDeleted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface JobApplication {
  _id: string;
  jobId: string;
  title: string;
  role: string;
  companyName: string;
  companyLogo: string;
  workMode: string;
  aiSummary: string;
  createdAt: string;
  updatedAt: string;
  experienceLevel?: string;
}

export default function JobDashboard() {
  const [selectedJob, setSelectedJob] = useState<JobInterface | null>(null);
  const [jobList, setJobList] = useState<JobInterface[]>([]);
  const [filteredJobList, setFilteredJobList] = useState<JobInterface[]>([]);
  const [recommendedJobList, setRecommendedJobList] = useState<
    JobApplication[]
  >([]);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "recommended">("all");

  // Fix double fetch
  const firstLoadRef = useRef(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string | undefined>();

  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ---------------------------------------------
  // Fetch Recommended Jobs
  // ---------------------------------------------
  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      const res = await getRecommendedJobsApi();
      setRecommendedJobList(res.data.recommendedJobs.recommendedJobs || []);
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // FIXED FETCH JOBS
  // ---------------------------------------------
  // const fetchJobs = async (lastId?: string) => {
  //   if (loading || !hasMore) return;

  //   // 🔥 Prevent duplicate first fetch
  //   if (firstLoadRef.current && !lastId) {
  //     firstLoadRef.current = false; // allow only first call
  //   } else if (!lastId) {
  //     return; // block second unwanted call
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await getAllJobsWithScrollingApi({
  //       limit: 10,
  //       lastId: lastId || null,
  //     });

  //     const newJobs = res.data.jobs || [];

  //     setNextCursor(res.meta.nextCursor || null);

  //     if (newJobs.length === 0) {
  //       setHasMore(false);
  //       return;
  //     }

  //     setJobList((prev) => [...prev, ...newJobs]);

  //     if (!selectedJob && newJobs.length > 0) {
  //       setSelectedJob(newJobs[0]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching jobs:", error);
  //     setHasMore(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ---------------------------------------------
  // FIXED FETCH JOBS
  // ---------------------------------------------
  const fetchJobs = React.useCallback(
    async (lastId?: string) => {
      if (loading || !hasMore) return;

      // 🔥 Prevent duplicate first fetch
      if (firstLoadRef.current && !lastId) {
        firstLoadRef.current = false; // allow only first call
      } else if (!lastId) {
        return; // block second unwanted call
      }

      try {
        setLoading(true);

        const res = await getAllJobsWithScrollingApi({
          limit: 10,
          lastId: lastId || null,
        });

        const newJobs = res.data.jobs || [];

        setNextCursor(res.meta.nextCursor || null);

        if (newJobs.length === 0) {
          setHasMore(false);
          return;
        }

        setJobList((prev) => [...prev, ...newJobs]);

        if (!selectedJob && newJobs.length > 0) {
          setSelectedJob(newJobs[0]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, selectedJob]
  );

  // ---------------------------------------------
  // Filters — Search, Experience, Work Mode, Country
  // ---------------------------------------------
  useEffect(() => {
    let filtered = [...jobList];

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyId.companyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          job.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (workModeFilter.length > 0) {
      filtered = filtered.filter((job) =>
        workModeFilter.includes(job.workMode.toLowerCase())
      );
    }

    if (experienceFilter.length > 0) {
      filtered = filtered.filter((job) =>
        experienceFilter.includes(job.experienceLevel.toLowerCase())
      );
    }

    if (countryFilter) {
      filtered = filtered.filter(
        (job) =>
          job.location.country.toLowerCase() === countryFilter.toLowerCase()
      );
    }

    setFilteredJobList(filtered);
  }, [jobList, searchQuery, workModeFilter, experienceFilter, countryFilter]);

  // ---------------------------------------------
  // Initial fetch
  // ---------------------------------------------
  useEffect(() => {
    if (activeTab === "all") {
      fetchJobs();
    }
  }, [activeTab, fetchJobs]);

  // ---------------------------------------------
  // Infinite Scroll Observer — FIXED
  // ---------------------------------------------
  useEffect(() => {
    if (activeTab !== "all") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && nextCursor) {
          fetchJobs(nextCursor);
        }
      },
      { threshold: 0.2 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, loading, nextCursor, activeTab, fetchJobs]);

  // ---------------------------------------------
  // Clear Filters
  // ---------------------------------------------
  const clearFilters = () => {
    setSearchQuery("");
    setWorkModeFilter([]);
    setExperienceFilter([]);
    setCountryFilter(undefined);
  };

  // ---------------------------------------------
  // Modal Logic
  // ---------------------------------------------
  const handleApplyNow = () => {
    setIsModalOpen(true);
    setSelectedDate(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSchedule = () => {
    if (selectedDate && selectedJob) {
      const isoString = selectedDate.toISOString();
      setLoadingButton(true);

      scheduleInterviewApi({
        jobId: selectedJob._id,
        scheduledDate: isoString,
      }).finally(() => {
        setLoadingButton(false);
        handleModalClose();
      });
    }
  };

  const disabledDate = (current: Dayjs) => {
    if (!selectedJob) return true;

    const today = dayjs().startOf("day");
    const deadline = dayjs(selectedJob.deadline).endOf("day");

    return current < today || current > deadline;
  };

  // ---------------------------------------------
  // JSX UI
  // ---------------------------------------------
  return (
    <div
      className="bg-gray-50"
      style={{
        height: "calc(100vh - 100px)",
        overflow: "hidden",
        padding: "16px",
      }}
    >
      <Row gutter={[16, 16]} className="flex gap-10" style={{ height: "100%" }}>
        {/* --------------------------- */}
        {/* Sidebar */}
        {/* --------------------------- */}
        <Col xs={24} lg={11} style={{ height: "100%" }}>
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div
              className="h-full bg-white rounded-2xl"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Search + Filters */}
              <div className="p-4" style={{ flexShrink: 0 }}>
                <Row gutter={[8, 8]}>
                  <Col xs={24} md={18}>
                    <Search
                      placeholder="Search jobs, companies, roles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      prefix={<SearchOutlined />}
                      allowClear
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <Select
                      placeholder="Country"
                      allowClear
                      style={{ width: "100%" }}
                      value={countryFilter}
                      onChange={setCountryFilter}
                      options={[
                        { label: "USA", value: "USA" },
                        { label: "UK", value: "UK" },
                        { label: "Germany", value: "Germany" },
                        { label: "Japan", value: "Japan" },
                      ]}
                    />
                  </Col>
                </Row>

                <Row gutter={[8, 8]} className="my-2">
                  <Col xs={8}>
                    <Select
                      mode="multiple"
                      placeholder="Work Mode"
                      style={{ width: "100%" }}
                      value={workModeFilter}
                      onChange={setWorkModeFilter}
                      maxTagCount="responsive"
                      options={[
                        { label: "Remote", value: "remote" },
                        { label: "Part-time", value: "part-time" },
                        { label: "Full-time", value: "full-time" },
                        { label: "Hybrid", value: "hybrid" },
                      ]}
                    />
                  </Col>

                  <Col xs={8}>
                    <Select
                      mode="multiple"
                      placeholder="Experience"
                      style={{ width: "100%" }}
                      value={experienceFilter}
                      onChange={setExperienceFilter}
                      maxTagCount="responsive"
                      options={[
                        { label: "Junior", value: "junior" },
                        { label: "Mid-level", value: "mid-level" },
                        { label: "Senior", value: "senior" },
                      ]}
                    />
                  </Col>

                  <Col xs={8}>
                    <UiButton onClick={clearFilters} className="w-full">
                      Clear
                    </UiButton>
                  </Col>

                  <Col xs={12}>
                    <UiButton className="w-full !text-gray-400">Saved</UiButton>
                  </Col>

                  <Col xs={12}>
                    <UiButton
                      className={`w-full ${
                        activeTab === "recommended"
                          ? "!text-blue-600 !bg-blue-50"
                          : "!text-gray-400"
                      }`}
                      onClick={() => {
                        setActiveTab("recommended");
                        if (recommendedJobList.length === 0) {
                          fetchRecommendedJobs();
                        }
                      }}
                    >
                      Recommended
                    </UiButton>
                  </Col>

                  <Col xs={24}>
                    <UiButton
                      className={`w-full ${
                        activeTab === "all"
                          ? "!text-blue-600 !bg-blue-50"
                          : "!text-gray-400"
                      }`}
                      onClick={() => setActiveTab("all")}
                    >
                      All Jobs ({filteredJobList.length})
                    </UiButton>
                  </Col>
                </Row>
              </div>

              {/* Jobs List */}
              <div ref={listRef} style={{ flex: 1, overflow: "auto" }}>
                {activeTab === "all" ? (
                  <>
                    <List
                      itemLayout="horizontal"
                      dataSource={filteredJobList}
                      renderItem={(item) => (
                        <List.Item
                          className={`cursor-pointer hover:bg-gray-100 transition ${
                            selectedJob?._id === item._id ? "bg-gray-100" : ""
                          }`}
                          onClick={() => setSelectedJob(item)}
                        >
                          <List.Item.Meta
                            avatar={
                              <div className="px-4">
                                <Avatar
                                  src={item.companyId?.logoUrl}
                                  size={50}
                                />
                                <div className="mt-2">
                                  <div className="text-blue-600 font-semibold">
                                    {item.title}
                                  </div>

                                  <div className="text-gray-500 text-sm">
                                    {item.companyId?.companyName}
                                  </div>

                                  <div className="flex gap-2 mt-1">
                                    <Tag color="blue">{item.workMode}</Tag>
                                    <Tag color="green">
                                      {item.experienceLevel}
                                    </Tag>
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />

                    {loading && (
                      <div style={{ padding: "20px", textAlign: "center" }}>
                        <Spin />
                      </div>
                    )}

                    <div ref={observerTarget} style={{ height: "30px" }} />

                    {!hasMore && jobList.length > 0 && (
                      <div
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#888",
                        }}
                      >
                        No more jobs
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Recommended Jobs */}
                    <List
                      itemLayout="horizontal"
                      dataSource={recommendedJobList}
                      renderItem={(item) => (
                        <List.Item
                          className={`cursor-pointer hover:bg-gray-100 transition`}
                          onClick={() => {
                            const fullJob = jobList.find(
                              (j) => j._id === item.jobId
                            );

                            if (fullJob) setSelectedJob(fullJob);
                          }}
                        >
                          <List.Item.Meta
                            avatar={
                              <div className="px-4">
                                <Avatar src={item.companyLogo} size={50} />
                                <div className="mt-2">
                                  <div className="text-blue-600 font-semibold">
                                    {item.title}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    {item.companyName}
                                  </div>

                                  <div className="flex gap-2 mt-1">
                                    <Tag color="blue">{item.workMode}</Tag>
                                    {item.experienceLevel && (
                                      <Tag color="green">
                                        {item.experienceLevel}
                                      </Tag>
                                    )}
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </Col>

        {/* --------------------------- */}
        {/* Job Details */}
        {/* --------------------------- */}
        <Col xs={24} lg={12} style={{ height: "100%" }}>
          <Card
            className="shadow-md rounded-2xl"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            bodyStyle={{
              height: "100%",
              padding: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {selectedJob ? (
              <>
                <div style={{ padding: "24px", flexShrink: 0 }}>
                  <div className="text-2xl flex justify-between items-center">
                    <TopIconAndNavigation
                      icon={
                        <Image src={selectedJob.companyId?.logoUrl} alt="" />
                      }
                      title={selectedJob.companyId?.companyName}
                      arrow={{ shown: false }}
                    />

                    <div className="flex gap-4 items-center">
                      <UiButton
                        type="primary"
                        className="!rounded-full"
                        onClick={handleApplyNow}
                      >
                        Apply Now
                      </UiButton>

                      <Dropdown menu={{ items }} trigger={["click"]}>
                        <span onClick={(e) => e.preventDefault()}>
                          <UiButton className="!rounded-full w-8 h-8">
                            <EllipsisOutlined />
                          </UiButton>
                        </span>
                      </Dropdown>
                    </div>
                  </div>

                  <Divider />
                </div>

                <div
                  style={{ flex: 1, overflow: "auto", padding: "0 24px 24px" }}
                >
                  <div>
                    <span className="text-lg text-gray-400">Job Title</span>
                    <Title className="!text-3xl">{selectedJob.title}</Title>
                  </div>

                  {/* Job Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <div className="my-4 items-center flex">
                      <IconWrapper
                        icon={<BuildFilled className="!text-[#1890FF]" />}
                        bgColorIcon="white"
                      />
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Posted</div>
                        <div className="font-semibold">
                          {new Date(selectedJob.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="my-4 items-center flex">
                      <IconWrapper
                        icon={
                          <NotificationFilled className="!text-[#1890FF]" />
                        }
                        bgColorIcon="white"
                      />
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Deadline</div>
                        <div className="font-semibold">
                          {new Date(selectedJob.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="my-4 items-center flex">
                      <IconWrapper
                        icon={<CalendarFilled className="!text-[#1890FF]" />}
                        bgColorIcon="white"
                      />
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Work Mode</div>
                        <div className="font-semibold">
                          {selectedJob.workMode}
                        </div>
                      </div>
                    </div>

                    <div className="my-4 items-center flex">
                      <IconWrapper
                        icon={
                          <EnvironmentOutlined className="!text-[#1890FF]" />
                        }
                        bgColorIcon="white"
                      />
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Location</div>
                        <div className="font-semibold">
                          {selectedJob.location.city},{" "}
                          {selectedJob.location.country}
                        </div>
                      </div>
                    </div>

                    <div className="my-4 items-center flex">
                      <IconWrapper
                        icon={<LaptopOutlined className="!text-[#1890FF]" />}
                        bgColorIcon="white"
                      />
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Experience</div>
                        <div className="font-semibold">
                          {selectedJob.experienceLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <Title level={5}>Job Description</Title>
                    <Paragraph className="text-gray-700 whitespace-pre-line">
                      {selectedJob.description}
                    </Paragraph>
                  </div>

                  {/* Skills */}
                  {selectedJob.requiredSkills?.length > 0 && (
                    <div className="mt-6">
                      <Title level={5}>Required Skills</Title>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.requiredSkills.map((skill, i) => (
                          <Tag key={i} color="blue">
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedJob.requirements?.length > 0 && (
                    <div className="mt-6">
                      <Title level={5}>Requirements</Title>
                      <ul className="list-disc pl-5">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i} className="text-gray-700">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal
        title={
          <span className="text-xl font-semibold">Schedule Application</span>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        closeIcon={<CloseOutlined />}
        footer={[
          <UiButton
            key="schedule"
            type="primary"
            disabled={!selectedDate}
            loading={loadingButton}
            onClick={handleSchedule}
          >
            Schedule
          </UiButton>,
        ]}
        width={500}
      >
        <div className="py-4">
          <Title level={5}>{selectedJob?.title}</Title>
          <Paragraph className="text-gray-500">
            {selectedJob?.companyId.companyName}
          </Paragraph>

          <Divider />

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Application Date
          </label>

          <DatePicker
            style={{ width: "100%" }}
            size="large"
            value={selectedDate}
            onChange={setSelectedDate}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            placeholder="Choose a date"
          />

          {selectedDate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div>
                <strong>Selected Date:</strong>{" "}
                {selectedDate.format("MMMM D, YYYY")}
              </div>
              <div>
                <strong>Deadline:</strong>{" "}
                {selectedJob
                  ? dayjs(selectedJob.deadline).format("MMMM D, YYYY")
                  : "N/A"}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
