"use client";
import { Card, Table, List, Avatar, Button, Row, Col, Dropdown } from "antd";
import {
  CalendarOutlined,
  RiseOutlined,
  ContainerFilled,
  StarFilled,
  MessageFilled,
  MoreOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import StatsCard from "@/component/pages/dashboard/StatsCard";
import { TopIconAndNavigation } from "@/app/candidate/dashboard/page";
import UiButton from "@/component/common/CustomButton";
import { ROUTES } from "@/constants/routes";
import { useEffect, useState } from "react";
import { getCompanyStatsApi } from "@/app/api/company/dashboard.api";

export interface CompanyDashboardResponse {
  postedJobsCount: number;
  activeJobsCount: number;
  appliedJobsCount: number;
  closedJobsCount: number;

  activeJobs: {
    _id: string;
    companyId: string;
    title: string;
    role: string;
    interviewGuideline: string;
    experienceLevel: "junior" | "mid" | "senior";
    description: string;
    requiredSkills: string[];
    requirements: string[];
    workMode: string;
    deadline: string;
    aiSummary: string;
    embeddingSynced: boolean;
    qdrantId: string | null;
    isDeleted: boolean;
    status: "open" | "closed";
    createdAt: string;
    updatedAt: string;
    __v: number;

    location: {
      city: string;
      country: string;
    };

    salaryRange: {
      min: number;
      max: number;
      currency: string;
    };
  }[];

  recentApplications: {
    _id: string;
    companyId: string;
    type: string;
    scheduledDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;

    aiResult: {
      strengths: string[];
      improvements: string[];
    };

    candidateId: {
      _id: string;
      userId: string;
      fullName: string;
      dateOfBirth: string;
      gender: string;
      country: string;
      city: string;
      contactNumber: string;
      profilePictureUrl: string;
      githubUrl: string;
      linkedinUrl: string;
      portfolioUrl: string;
      skills: string[];
      bio: string;
      tagline: string;
      resumeId: string;
      isProfileCompleted: boolean;
      isDeleted: string;
      aiDescription: string;
      embeddingSync: boolean;
      qdrantId: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };

    jobId: {
      _id: string;
      companyId: string;
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

      location: {
        city: string;
        country: string;
      };

      salaryRange: {
        min: number;
        max: number;
        currency: string;
      };
    };
  }[];
}

export default function Dashboard() {
  const [companyStats, setCompanyStats] =
    useState<CompanyDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanyStatsApi()
      .then((res) => {
        console.log("Company Dashboard Stats:", res.data);
        setCompanyStats(res.data);
      })
      .catch((error) => {
        console.error("Error fetching company stats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Transform active jobs data for table
  const jobData =
    companyStats?.activeJobs?.map((job, index) => ({
      key: job._id,
      title: job.title,
      applications: 0, // You may need to add this to your API response
      views: 0, // You may need to add this to your API response
      matches: 0, // You may need to add this to your API response
    })) || [];

  const jobColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
    },
    {
      title: "Applications",
      dataIndex: "applications",
      key: "applications",
      align: "center" as const,
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      align: "center" as const,
    },
    {
      title: "AI matches",
      dataIndex: "matches",
      key: "matches",
      align: "center" as const,
    },
    {
      title: "",
      key: "action",
      render: () => (
        <Button type="link" className="text-blue-500 p-0">
          View details
        </Button>
      ),
    },
  ];

  // Messages Data (keep as is per your request)
  const messages = [
    {
      name: "Alexa",
      text: "Hey Adam! Interested in tex...",
      time: "3m",
      avatar: "A",
      unread: true,
    },
    {
      name: "Donald",
      text: "Hey Adam! Interested in tex...",
      time: "10m",
      avatar: "D",
      unread: true,
    },
    {
      name: "James Drew",
      text: "Hey Adam! Interested in tex...",
      time: "30m",
      avatar: "J",
      unread: false,
    },
    {
      name: "Alexa",
      text: "Hey Adam! Is Load more...",
      time: "30m",
      avatar: "A",
      unread: false,
    },
  ];

  // Chart data for applications per week (keep as is per your request)
  const weeklyData = [
    { day: "Mon", value: 5 },
    { day: "Tue", value: 9 },
    { day: "Wed", value: 5 },
    { day: "Thu", value: 12 },
    { day: "Fri", value: 6 },
    { day: "Sat", value: 7 },
    { day: "Sun", value: 6 },
  ];

  // Get the most recent application
  const recentApplication = companyStats?.recentApplications?.[0];

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* First Row */}
      <Row gutter={[8, 8]} className="sm:gutter-[16] md:gutter-[16]">
        {/* (1,1) nested 2x2 grid */}
        <Col xs={24} sm={24} md={24} lg={12}>
          <Row gutter={[8, 8]} className="sm:gutter-[16] md:gutter-[16]">
            <StatsCard
              arrow={{ shown: true, href: "/company/job-analytics" }}
              icon={<ContainerFilled style={{ color: "white" }} />}
              title="Jobs Posted"
              number={companyStats?.postedJobsCount || 0}
              badgeText="45%+ in last 30 days"
              badgeColor="green"
            />
            <StatsCard
              arrow={{ shown: true, href: "/company/job-applications" }}
              icon={<StarFilled className="!text-white" />}
              title="Jobs Applications"
              number={companyStats?.activeJobsCount || 0}
              badgeText="45%+ in last 30 days"
              badgeColor="orange"
            />
            <StatsCard
              arrow={{ shown: true, href: "/company/job-analytics" }}
              title="Applied Jobs"
              icon={<StarFilled className="!text-white" />}
              number={companyStats?.appliedJobsCount || 0}
              badgeText="45%+ in last 30 days"
              badgeColor="orange"
            />
            <StatsCard
              arrow={{ shown: true, href: "/company/job-analytics" }}
              icon={<StarFilled className="!text-white" />}
              title="Closed Jobs"
              number={companyStats?.closedJobsCount || 0}
              badgeText="45%+ in last 30 days"
              badgeColor="orange"
            />
          </Row>
        </Col>

        {/* (1,2) applications chart */}
        <Col xs={24} sm={24} md={24} lg={12}>
          <Card
            title="Applications received per week"
            className="h-full"
            extra={
              <span className="text-xs sm:text-sm text-gray-400">
                September 29 - October 6
              </span>
            }
          >
            <div className="flex items-end justify-between h-30 px-2 sm:px-4 mt-4 gap-1 sm:gap-2">
              {weeklyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-400 mb-1">{item.value}</div>
                  <div
                    className="bg-blue-500 rounded-t w-full max-w-6 flex items-end justify-center"
                    style={{ height: `${(item.value / 12) * 100}px` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2">{item.day}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Second Row */}
      <Row
        gutter={[8, 8]}
        className="mt-4 sm:mt-6 sm:gutter-[16] md:gutter-[16]"
      >
        {/* (2,1) Active Jobs Table */}
        <Col xs={24} sm={24} md={24} lg={12}>
          <Card
            style={{ height: "340px", maxHeight: "340px", overflowY: "auto" }}
            // className="scrollbar-hide"
            title="Active Jobs"
            extra={
              <UiButton
                href={"/company/job-analytics"}
                className="group !w-8 !h-8 !rounded-full flex items-center justify-center bg-white border border-gray-300 transition-all duration-300 hover:!bg-blue-500"
              >
                <ArrowUpOutlined className="text-gray-600 transform rotate-45 transition-all duration-300 ease-in-out group-hover:!text-white group-hover:rotate-90" />
              </UiButton>
            }
          >
            <Table
              dataSource={jobData}
              columns={jobColumns}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
              loading={loading}
            />
          </Card>
        </Col>

        {/* (2,2) Messages + Interview Schedule */}
        <Col xs={24} sm={24} md={24} lg={12}>
          <Row gutter={[8, 8]} className="sm:gutter-[16] md:gutter-[16]">
            <Col xs={24} lg={12}>
              <div className="h-84 bg-white hover-gray-50 relative rounded-lg">
                <div className="flex gap-2 font-bold text-md px-4 items-center py-2">
                  <TopIconAndNavigation
                    icon={
                      <MessageFilled size={36} style={{ color: "white" }} />
                    }
                    title="Messages"
                    arrow={{ shown: false }}
                  />
                </div>

                <List
                  itemLayout="horizontal"
                  dataSource={messages}
                  className="cursor-pointer !pb-9"
                  renderItem={(item) => (
                    <List.Item
                      className="hover:bg-gray-50 hover:w-full !px-4 rounded"
                      actions={[
                        <div className="flex items-center gap-2" key="actions">
                          {!item.time ? (
                            <div className="bg-[#FF4D4F] w-5 h-5 flex justify-center items-center rounded-full text-white text-xs">
                              5
                            </div>
                          ) : (
                            <span className="text-xs text-[#202020]">
                              {item.time}
                            </span>
                          )}
                          <Dropdown menu={{ item }} trigger={["click"]}>
                            <MoreOutlined className="!text-[#202020] cursor-pointer" />
                          </Dropdown>
                        </div>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <Avatar size={34} className="bg-gray-300 text-sm">
                                {item.avatar}
                              </Avatar>
                              {item.unread && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-600 border border-white"></div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-500 line-clamp-1">
                                {item.text}
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div className="absolute -bottom-0 right-1.5 flex justify-center w-[96%] py-3 bg-gradient-to-t from-gray-50 to-transparent rounded-b-lg">
                  <UiButton className="!rounded-2xl" href={ROUTES.DASHBOARD}>
                    Load More
                  </UiButton>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12}>
              <Card
                title="Recent Applications"
                extra={
                  <CalendarOutlined
                    className="text-blue-500"
                    style={{ fontSize: "16px" }}
                  />
                }
                className="h-full"
                loading={loading}
              >
                <p className="mb-3 font-medium text-sm text-gray-500">Today</p>
                {recentApplication ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-sm">
                          {recentApplication.jobId?.title || "N/A"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {recentApplication.candidateId?.fullName || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      className="bg-orange-500 border-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                    >
                      View Details
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No recent applications
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
