"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  List,
  Avatar,
  Tag,
  Typography,
  Row,
  Col,
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
  HeartOutlined,
  HeartFilled,
  // ShareAltOutlined,
  // WarningOutlined,
  UserOutlined,
} from "@ant-design/icons";

import UiButton from "@/component/common/CustomButton";
import IconWrapper from "@/icons/IconWrapper";

import {
  getAllJobsWithScrollingApi,
  getAllSaveJobsApi,
  getRecommendedJobsApi,
  saveJobApi,
  SavedJobs,
  unSaveJobApi,
  RecommendedJob,
} from "@/app/api/candidate/jobs.api";

import dayjs, { Dayjs } from "dayjs";
import { scheduleInterviewApi } from "@/app/api/candidate/interview.api";
import { JobResponse } from "@/constants/Interfaces/Types/Jobs.interface";
import toast from "react-hot-toast";

const { Title, Paragraph } = Typography;
const { Search } = Input;

// ─── Shared job detail content ───────────────────────────────────────────────
function JobDetailContent({ selectedJob }: { selectedJob: JobResponse }) {
  return (
    <>
      <div className="mt-4">
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
            icon={<NotificationFilled className="!text-[#1890FF]" />}
            bgColorIcon="white"
          />
          <div className="ml-4">
            <div className="text-sm text-gray-400">Deadline</div>
            <div className="font-semibold">
              {selectedJob.deadline
                ? new Date(selectedJob.deadline).toLocaleDateString()
                : "N/A"}
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
            <div className="font-semibold">{selectedJob.workMode}</div>
          </div>
        </div>

        <div className="my-4 items-center flex">
          <IconWrapper
            icon={<EnvironmentOutlined className="!text-[#1890FF]" />}
            bgColorIcon="white"
          />
          <div className="ml-4">
            <div className="text-sm text-gray-400">Location</div>
            <div className="font-semibold">
              {selectedJob.location.city}, {selectedJob.location.country}
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
            <div className="font-semibold">{selectedJob.experienceLevel}</div>
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
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function JobDashboard() {
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
  const [jobList, setJobList] = useState<JobResponse[]>([]);
  const [filteredJobList, setFilteredJobList] = useState<JobResponse[]>([]);
  const [recommendedJobList, setRecommendedJobList] = useState<
    RecommendedJob[]
  >([]);
  const [savedJobsList, setSavedJobsList] = useState<SavedJobs[]>([]);
  const [savingJobId, setSavingJobId] = useState<string | null>(null);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "recommended" | "saved">(
    "all",
  );

  // NEW: controls mobile drawer visibility
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const firstLoadRef = useRef(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string | undefined>();

  const [filteredSavedJobsList, setFilteredSavedJobsList] = useState<
    SavedJobs[]
  >([]);
  const [filteredRecommendedJobList, setFilteredRecommendedJobList] = useState<
    RecommendedJob[]
  >([]);

  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ---------------------------------------------
  // Check if job is saved using isSaved field
  // ---------------------------------------------
  const isJobSaved = (jobId: string) => {
    const job = jobList.find((j) => j._id === jobId);
    if (job) return job.isSaved;
    return savedJobsList.some((saved) => saved.jobId._id === jobId);
  };

  // ---------------------------------------------
  // Get saved job ID for unsaving
  // ---------------------------------------------
  const getSavedJobId = (jobId: string): string | null => {
    const savedJob = savedJobsList.find((saved) => saved.jobId._id === jobId);
    return savedJob ? savedJob._id : null;
  };

  // ---------------------------------------------
  // Handle Save/Unsave Job
  // ---------------------------------------------
  const handleSaveJob = async (jobId: string) => {
    const isSaved = isJobSaved(jobId);
    try {
      setSavingJobId(jobId);
      if (isSaved) {
        const savedJobId = getSavedJobId(jobId);
        if (savedJobId) {
          await unSaveJobApi(savedJobId);
          toast.success("Job unsaved successfully");
          setJobList((prev) =>
            prev.map((job) =>
              job._id === jobId ? { ...job, isSaved: false } : job,
            ),
          );
          if (selectedJob?._id === jobId) {
            setSelectedJob({ ...selectedJob, isSaved: false });
          }
        }
      } else {
        await saveJobApi(jobId);
        toast.success("Job saved successfully");
        setJobList((prev) =>
          prev.map((job) =>
            job._id === jobId ? { ...job, isSaved: true } : job,
          ),
        );
        if (selectedJob?._id === jobId) {
          setSelectedJob({ ...selectedJob, isSaved: true });
        }
      }
      await fetchSavedJobs();
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      toast.error(isSaved ? "Failed to unsave job" : "Failed to save job");
    } finally {
      setSavingJobId(null);
    }
  };

  // ---------------------------------------------
  // Handle Dropdown Menu Actions
  // ---------------------------------------------
  const handleMenuClick = (key: string, jobId: string) => {
    switch (key) {
      case "save":
        handleSaveJob(jobId);
        break;
      // case "share":
      //   navigator.clipboard.writeText(window.location.href);
      //   toast.success("Job link copied to clipboard");
      //   break;
      // case "report":
      //   toast.success("Report functionality coming soon");
      //   break;
      case "view_profile": {
        const companyId =
          selectedJob?.companyId?._id || selectedJob?.company?._id;
        if (companyId) {
          window.open(`http://localhost:3000/auth/view/${companyId}`, "_blank");
        }
        break;
      }
    }
  };

  // ---------------------------------------------
  // Get dropdown items based on save status
  // ---------------------------------------------
  const getDropdownItems = (jobId: string) => {
    const isSaved = isJobSaved(jobId);
    return [
      {
        label: isSaved ? "Unsave Job" : "Save Job",
        key: "save",
        icon: isSaved ? (
          <HeartFilled style={{ color: "#ff4d4f" }} />
        ) : (
          <HeartOutlined />
        ),
      },
      // { label: "Share", key: "share", icon: <ShareAltOutlined /> },
      { type: "divider" as const },
      // {
      //   label: "Report",
      //   key: "report",
      //   icon: <WarningOutlined />,
      //   danger: true,
      // },
      { label: "View Profile", key: "view_profile", icon: <UserOutlined /> },
    ];
  };

  // ---------------------------------------------
  // Fetch Saved Jobs
  // ---------------------------------------------
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllSaveJobsApi({ limit: 100, page: 1 });
      console.log("✅ Saved Jobs API Response:", res);
      if (!res || !res.data) return;
      setSavedJobsList(res.data.savedJobs || []);
    } catch (error) {
      console.error("❌ Error fetching saved jobs:", error);
      toast.error("Failed to fetch saved jobs");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Fetch Recommended Jobs
  // ---------------------------------------------
  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      const res = await getRecommendedJobsApi();
      if (!res?.data?.recommendedJobs?.recommendedJobs) return;
      setRecommendedJobList(res.data.recommendedJobs.recommendedJobs || []);
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
      toast.error("Failed to fetch recommended jobs");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Fetch Jobs with Scrolling
  // ---------------------------------------------
  const fetchJobs = React.useCallback(
    async (lastId?: string) => {
      if (loading || !hasMore) return;
      if (firstLoadRef.current && !lastId) {
        firstLoadRef.current = false;
      } else if (!lastId) {
        return;
      }
      try {
        setLoading(true);
        const res = await getAllJobsWithScrollingApi({
          limit: 10,
          lastId: lastId || undefined,
        });
        if (!res || !res.data || !res.meta) {
          setHasMore(false);
          return;
        }
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
        toast.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, selectedJob],
  );

  // ---------------------------------------------
  // Filters
  // ---------------------------------------------
  useEffect(() => {
    let filtered = [...jobList];
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyId?.companyName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          job.role?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (workModeFilter.length > 0) {
      filtered = filtered.filter(
        (job) =>
          job.workMode && workModeFilter.includes(job.workMode.toLowerCase()),
      );
    }
    if (experienceFilter.length > 0) {
      filtered = filtered.filter(
        (job) =>
          job.experienceLevel &&
          experienceFilter.includes(job.experienceLevel.toLowerCase()),
      );
    }
    if (countryFilter) {
      filtered = filtered.filter(
        (job) =>
          job.location.country.toLowerCase() === countryFilter.toLowerCase(),
      );
    }
    setFilteredJobList(filtered);
  }, [jobList, searchQuery, workModeFilter, experienceFilter, countryFilter]);

  // Filter Saved Jobs
  useEffect(() => {
    let filtered = [...savedJobsList];
    if (searchQuery) {
      filtered = filtered.filter((savedJob) => {
        const job = savedJob.jobId;
        return (
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.companyName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          job.role?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
    if (workModeFilter.length > 0) {
      filtered = filtered.filter(
        (savedJob) =>
          savedJob.jobId.workMode &&
          workModeFilter.includes(savedJob.jobId.workMode.toLowerCase()),
      );
    }
    if (experienceFilter.length > 0) {
      filtered = filtered.filter(
        (savedJob) =>
          savedJob.jobId.experienceLevel &&
          experienceFilter.includes(
            savedJob.jobId.experienceLevel.toLowerCase(),
          ),
      );
    }
    if (countryFilter) {
      filtered = filtered.filter(
        (savedJob) =>
          savedJob.jobId.location?.country?.toLowerCase() ===
          countryFilter.toLowerCase(),
      );
    }
    setFilteredSavedJobsList(filtered);
  }, [
    savedJobsList,
    searchQuery,
    workModeFilter,
    experienceFilter,
    countryFilter,
  ]);

  // Filter Recommended Jobs
  useEffect(() => {
    let filtered = [...recommendedJobList];
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.companyName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (workModeFilter.length > 0) {
      filtered = filtered.filter(
        (item) =>
          item.workMode && workModeFilter.includes(item.workMode.toLowerCase()),
      );
    }
    if (experienceFilter.length > 0) {
      filtered = filtered.filter(
        (item) =>
          item.experienceLevel &&
          experienceFilter.includes(item.experienceLevel.toLowerCase()),
      );
    }
    setFilteredRecommendedJobList(filtered);
  }, [recommendedJobList, searchQuery, workModeFilter, experienceFilter]);

  // ---------------------------------------------
  // Initial fetch
  // ---------------------------------------------
  useEffect(() => {
    if (activeTab === "all") {
      fetchJobs();
      fetchSavedJobs();
    } else if (activeTab === "saved") {
      fetchSavedJobs();
    } else if (activeTab === "recommended") {
      fetchRecommendedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ---------------------------------------------
  // Infinite Scroll Observer
  // ---------------------------------------------
  useEffect(() => {
    if (activeTab !== "all") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && nextCursor) {
          fetchJobs(nextCursor);
        }
      },
      { threshold: 0.2 },
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

  const handleSchedule = async () => {
    if (selectedDate && selectedJob) {
      const isoString = new Date(selectedDate.toISOString()).toLocaleDateString(
        "en-CA",
      );
      console.log("ISO STRING", isoString);
      setLoadingButton(true);
      const res = await scheduleInterviewApi({
        jobId: selectedJob._id,
        scheduledDate: isoString,
      });
      if (!res) {
        handleModalClose();
        setLoadingButton(false);
        return;
      }
      if (res.status === "Failed") {
        console.log("Failed", res.message);
        toast.error(res.message || "Error Interview scheduling....");
        handleModalClose();
        setLoadingButton(false);
        return;
      }

      toast.success(res.message || "Interview scheduled successfully");
      jobList.forEach((job) => {
        if (job._id === selectedJob._id) {
          job.isApplied = true;
        }
      });
      setSelectedJob({ ...selectedJob, isApplied: true });
      handleModalClose();
      setLoadingButton(false);
    }
  };

  const disabledDate = (current: Dayjs) => {
    if (!selectedJob) return true;
    const today = dayjs().startOf("day");
    const deadline = dayjs(selectedJob.deadline).endOf("day");
    return current < today || current > deadline;
  };

  // ---------------------------------------------
  // Convert JobData to JobInterface for display
  // ---------------------------------------------
  const convertToJobInterface = (
    jobData: Partial<JobResponse>,
  ): JobResponse => {
    return {
      ...jobData,
      companyId: {
        _id: typeof jobData.companyId === "string" ? jobData.companyId : "",
        companyName: "Company",
        logoUrl: "",
      },
      isSaved: false,
    } as JobResponse;
  };

  // ---------------------------------------------
  // JSX UI
  // ---------------------------------------------
  return (
    <div className="bg-gray-50 h-[calc(100vh-100px)] overflow-hidden relative">
      {/* ── Two-column layout ───────────────────────────────────────────── */}
      <div className="flex gap-4 h-full">
        {/* ── LEFT: Sidebar ─────────────────────────────────────────────── */}
        <div className="flex flex-col bg-white rounded-2xl overflow-hidden w-full lg:w-[420px] lg:flex-shrink-0 h-full">
          {/* Filters — never scrolls */}
          <div className="flex-shrink-0 p-4">
            <Row gutter={[8, 8]}>
              <Col xs={24} md={24}>
                <Search
                  placeholder="Search jobs, companies, roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
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
                <UiButton
                  className={`w-full ${activeTab === "saved"
                    ? "!text-blue-600 !bg-blue-50"
                    : "!text-gray-400"
                    }`}
                  onClick={() => setActiveTab("saved")}
                >
                  Saved ({savedJobsList.length})
                </UiButton>
              </Col>
              <Col xs={12}>
                <UiButton
                  className={`w-full ${activeTab === "recommended"
                    ? "!text-blue-600 !bg-blue-50"
                    : "!text-gray-400"
                    }`}
                  onClick={() => setActiveTab("recommended")}
                >
                  Recommended
                </UiButton>
              </Col>
              <Col xs={24}>
                <UiButton
                  className={`w-full ${activeTab === "all"
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

          {/* Job list — scrolls independently */}
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {activeTab === "all" ? (
              <>
                <List
                  itemLayout="horizontal"
                  dataSource={filteredJobList}
                  renderItem={(item) => (
                    <List.Item
                      className={`cursor-pointer hover:bg-blue-50/30 transition-all border-b border-gray-100 px-6 py-5 ${selectedJob?._id === item._id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "border-l-4 border-l-transparent"
                        }`}
                      onClick={() => {
                        setSelectedJob(item);
                        setIsDetailOpen(true);
                      }}
                    >
                      <div className="flex w-full items-start gap-4 p-1">
                        {/* Left: Company Logo */}
                        <div className="relative flex-shrink-0">
                          <Avatar
                            src={item.company?.logoUrl}
                            shape="square"
                            size={64}
                            className="rounded-lg border border-gray-100 shadow-sm"
                          />
                          {item.isSaved && (
                            <div className="absolute -bottom-1 -right-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm text-amber-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3.5 h-3.5"
                              >
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.924-2.438 7.11-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Middle: Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
                              {item.title}
                            </h3>
                            {item.isApplied && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                                Applied
                              </span>
                            )}
                          </div>

                          <div className="flex items-center text-gray-600 mb-3 italic">
                            <span className="font-medium text-blue-600 not-italic">
                              {item.company?.companyName}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm">
                              {item.location?.city}, {item.location?.country}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Tag className="m-0 border-none bg-blue-50 text-blue-700 font-medium px-2 rounded">
                              {item.workMode}
                            </Tag>
                            <Tag className="m-0 border-none bg-purple-50 text-purple-700 font-medium px-2 rounded capitalize">
                              {item.experienceLevel}
                            </Tag>
                            <Tag className="m-0 border-none bg-orange-50 text-orange-700 font-medium px-2 rounded">
                              {item.salaryRange?.currency}{" "}
                              {item.salaryRange?.min.toLocaleString()} -{" "}
                              {item.salaryRange?.max.toLocaleString()}
                            </Tag>
                          </div>

                          {/* Quick Stats/Summary Footer */}
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                            <div className="flex gap-4">
                              <span>
                                Posted:{" "}
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              <span>
                                Deadline:{" "}
                                {new Date(item.deadline).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="font-medium text-blue-500">
                              View Details →
                            </div>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
                {loading && (
                  <div className="p-5 text-center">
                    <Spin />
                  </div>
                )}
                <div ref={observerTarget} className="h-8" />
                {!hasMore && jobList.length > 0 && (
                  <div className="p-5 text-center text-gray-400">
                    No more jobs
                  </div>
                )}
              </>
            ) : activeTab === "saved" ? (
              <>
                {loading ? (
                  <div className="p-5 text-center">
                    <Spin />
                  </div>
                ) : filteredSavedJobsList.length === 0 ? (
                  <div className="py-10 px-5 text-center">
                    <div className="text-gray-400 text-lg mb-2">
                      {savedJobsList.length === 0
                        ? "No saved jobs yet"
                        : "No saved jobs match your search"}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {savedJobsList.length === 0
                        ? "Start saving jobs to view them here"
                        : "Try adjusting your filters"}
                    </div>
                  </div>
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredSavedJobsList}
                    renderItem={(savedJob) => {
                      const job = savedJob.jobId;
                      return (
                        <List.Item
                          className={`cursor-pointer hover:bg-blue-50/30 transition-all border-b border-gray-100 px-6 py-5 ${selectedJob?._id === job._id
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : "border-l-4 border-l-transparent"
                            }`}
                          onClick={() => {
                            const fullJob = convertToJobInterface(job);
                            fullJob.isSaved = true;
                            setSelectedJob(fullJob);
                            setIsDetailOpen(true);
                          }}
                        >
                          <div className="flex w-full items-start gap-4 p-1">
                            {/* Left: Company Logo */}
                            <div className="relative flex-shrink-0">
                              <Avatar
                                src={job.company?.logoUrl}
                                shape="square"
                                size={64}
                                className="rounded-lg border border-gray-100 shadow-sm"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm text-amber-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-3.5 h-3.5"
                                >
                                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.924-2.438 7.11-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                              </div>
                            </div>

                            {/* Middle: Main Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
                                  {job.title}
                                </h3>
                                {job.isApplied && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                                    Applied
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center text-gray-600 mb-3 italic">
                                <span className="font-medium text-blue-600 not-italic">
                                  {job.company?.companyName}
                                </span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-sm">
                                  {job.location?.city}, {job.location?.country}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <Tag className="m-0 border-none bg-blue-50 text-blue-700 font-medium px-2 rounded">
                                  {job.workMode}
                                </Tag>
                                <Tag className="m-0 border-none bg-purple-50 text-purple-700 font-medium px-2 rounded capitalize">
                                  {job.experienceLevel}
                                </Tag>
                                <Tag className="m-0 border-none bg-orange-50 text-orange-700 font-medium px-2 rounded">
                                  {job.salaryRange?.currency}{" "}
                                  {job.salaryRange?.min.toLocaleString()} -{" "}
                                  {job.salaryRange?.max.toLocaleString()}
                                </Tag>
                              </div>

                              {/* Quick Stats/Summary Footer */}
                              <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                                <div className="flex gap-4">
                                  <span>
                                    Posted:{" "}
                                    {new Date(
                                      job.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span>
                                    Deadline:{" "}
                                    {new Date(
                                      job.deadline,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="font-medium text-blue-500">
                                  View Details →
                                </div>
                              </div>
                            </div>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {loading ? (
                  <div className="p-5 text-center">
                    <Spin />
                  </div>
                ) : filteredRecommendedJobList.length === 0 ? (
                  <div className="py-10 px-5 text-center">
                    <div className="text-gray-400 text-lg mb-2">
                      {recommendedJobList.length === 0
                        ? "No recommendations yet"
                        : "No recommendations match your search"}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {recommendedJobList.length === 0
                        ? "We will recommend jobs based on your profile"
                        : "Try adjusting your filters"}
                    </div>
                  </div>
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredRecommendedJobList}
                    renderItem={(item) => {
                      const fullJob = jobList.find((j) => j._id === item.jobId);
                      return (
                        <List.Item
                          className={`cursor-pointer hover:bg-blue-50/30 transition-all border-b border-gray-100 px-6 py-5 ${selectedJob?._id === item.jobId
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : "border-l-4 border-l-transparent"
                            }`}
                          onClick={() => {
                            if (fullJob) {
                              setSelectedJob(fullJob);
                              setIsDetailOpen(true);
                            }
                          }}
                        >
                          <div className="flex w-full items-start gap-4 p-1">
                            {/* Left: Company Logo */}
                            <div className="relative flex-shrink-0">
                              <Avatar
                                src={item.companyLogo}
                                shape="square"
                                size={64}
                                className="rounded-lg border border-gray-100 shadow-sm"
                              />
                            </div>

                            {/* Middle: Main Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
                                  {item.title}
                                </h3>
                                {fullJob?.isApplied && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                                    Applied
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center text-gray-600 mb-3 italic">
                                <span className="font-medium text-blue-600 not-italic">
                                  {item.companyName}
                                </span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-sm">
                                  {fullJob?.location?.city},{" "}
                                  {fullJob?.location?.country}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <Tag className="m-0 border-none bg-blue-50 text-blue-700 font-medium px-2 rounded">
                                  {item.workMode}
                                </Tag>
                                {item.experienceLevel && (
                                  <Tag className="m-0 border-none bg-purple-50 text-purple-700 font-medium px-2 rounded capitalize">
                                    {item.experienceLevel}
                                  </Tag>
                                )}
                                {fullJob?.salaryRange && (
                                  <Tag className="m-0 border-none bg-orange-50 text-orange-700 font-medium px-2 rounded">
                                    {fullJob.salaryRange.currency}{" "}
                                    {fullJob.salaryRange.min.toLocaleString()} -{" "}
                                    {fullJob.salaryRange.max.toLocaleString()}
                                  </Tag>
                                )}
                              </div>

                              {/* Quick Stats/Summary Footer */}
                              <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                                <div className="flex gap-4">
                                  <span>
                                    Posted:{" "}
                                    {fullJob
                                      ? new Date(
                                        fullJob.createdAt,
                                      ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                  <span>
                                    Deadline:{" "}
                                    {fullJob
                                      ? new Date(
                                        fullJob.deadline,
                                      ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="font-medium text-blue-500">
                                  View Details →
                                </div>
                              </div>
                            </div>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
        {/* end sidebar */}

        {/* ── RIGHT: Detail panel — desktop only ────────────────────────── */}
        <div className="hidden lg:flex flex-col flex-1 h-full bg-white rounded-2xl shadow-md overflow-hidden">
          {selectedJob ? (
            <>
              {/* Header — stays put */}
              <div className="flex-shrink-0 px-6 pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    {/* Professional Logo Container */}
                    <div className="">
                      {selectedJob.company?.logoUrl ? (
                        <Avatar
                          src={selectedJob.company?.logoUrl}
                          shape="square"
                          size={64}
                          className="rounded-lg border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <span className="text-blue-600 font-bold text-xl uppercase">
                          {selectedJob.company?.companyName?.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Title and Metadata */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                          {selectedJob.company?.companyName}
                        </h2>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                          <span>
                            {selectedJob.location?.city},{" "}
                            {selectedJob.location?.country}
                          </span>
                        </div>
                        <span className="text-gray-300 hidden sm:block">|</span>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {selectedJob.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    {selectedJob.isApplied ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                        <svg
                          className="-ml-0.5 mr-1.5 h-2 w-2 text-teal-400"
                          fill="currentColor"
                          viewBox="0 0 8 8"
                        >
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Applied
                      </span>
                    ) : (
                      <UiButton
                        type="primary"
                        className="!rounded-full"
                        onClick={handleApplyNow}
                      >
                        Apply Now
                      </UiButton>
                    )}
                    <Dropdown
                      menu={{
                        items: getDropdownItems(selectedJob._id),
                        onClick: ({ key }) =>
                          handleMenuClick(key, selectedJob._id),
                      }}
                      trigger={["click"]}
                    >
                      <span onClick={(e) => e.preventDefault()}>
                        <UiButton
                          className="!rounded-full w-8 h-8"
                          loading={savingJobId === selectedJob._id}
                        >
                          {savingJobId === selectedJob._id ? null : (
                            <EllipsisOutlined />
                          )}
                        </UiButton>
                      </span>
                    </Dropdown>
                  </div>
                </div>
                <Divider />
              </div>

              {/* Body — scrolls independently */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <JobDetailContent selectedJob={selectedJob} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Spin size="large" />
            </div>
          )}
        </div>
        {/* end desktop detail panel */}
      </div>
      {/* end two-column */}

      {/* ──────────────────────────────────────────────────────────────────
          MOBILE DRAWER — only rendered below lg breakpoint.
          Dark backdrop + slide-up sheet, driven by `isDetailOpen`.
      ────────────────────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black transition-opacity duration-300 ${isDetailOpen
          ? "opacity-50 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsDetailOpen(false)}
      />

      {/* Slide-up sheet */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 mx-auto right-0 z-50 flex flex-col bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 w-[90%] max-[400px]:w-[99%] ease-out ${isDetailOpen ? "translate-y-0" : "translate-y-full"
          }`}
        style={{ height: "90vh" }}
      >
        {/* Handle bar + close button */}
        <div className="relative flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-2">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />
          <button
            onClick={() => setIsDetailOpen(false)}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 text-sm font-semibold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {selectedJob && (
          <>
            {/* Sheet header — stays put */}
            <div className="flex-shrink-0 px-5 pb-3 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  {/* Professional Logo Container */}
                  <div className="">
                    {selectedJob.company?.logoUrl ? (
                      <Avatar
                        src={selectedJob.company?.logoUrl}
                        shape="square"
                        size={64}
                        className="rounded-lg border border-gray-100 shadow-sm"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-xl uppercase">
                        {selectedJob.company?.companyName?.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Title and Metadata */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {selectedJob.company?.companyName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                        <span>
                          {selectedJob.location?.city},{" "}
                          {selectedJob.location?.country}
                        </span>
                      </div>
                      <span className="text-gray-300 hidden sm:block">|</span>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        {selectedJob.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {selectedJob.isApplied ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                      <svg
                        className="-ml-0.5 mr-1.5 h-2 w-2 text-teal-400"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Applied
                    </span>
                  ) : (
                    <UiButton
                      type="primary"
                      className="!rounded-full"
                      onClick={handleApplyNow}
                    >
                      Apply Now
                    </UiButton>
                  )}
                  <Dropdown
                    menu={{
                      items: getDropdownItems(selectedJob._id),
                      onClick: ({ key }) =>
                        handleMenuClick(key, selectedJob._id),
                    }}
                    trigger={["click"]}
                  >
                    <span onClick={(e) => e.preventDefault()}>
                      <UiButton
                        className="!rounded-full w-8 h-8"
                        loading={savingJobId === selectedJob._id}
                      >
                        {savingJobId === selectedJob._id ? null : (
                          <EllipsisOutlined />
                        )}
                      </UiButton>
                    </span>
                  </Dropdown>
                </div>
              </div>
            </div>

            {/* Sheet body — scrolls */}
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              <JobDetailContent selectedJob={selectedJob} />
            </div>
          </>
        )}
      </div>
      {/* end mobile drawer */}

      {/* ── Modal — unchanged ─────────────────────────────────────────── */}
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
