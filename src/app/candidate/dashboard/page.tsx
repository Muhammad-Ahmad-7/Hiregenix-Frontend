"use client";

import React, { useEffect } from "react";
import {
  Card,
  Table,
  List,
  Avatar,
  Button,
  Dropdown,
  Row,
  Col,
  Calendar,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  MoreOutlined,
  ContainerFilled,
  StarFilled,
  MessageFilled,
  ArrowUpOutlined,
} from "@ant-design/icons";
import UiButton from "@/component/common/CustomButton";
import { ROUTES } from "@/constants/routes";
import StatsCard from "@/component/pages/dashboard/StatsCard";
import { JobPortalMapCard } from "@/component/pages/candidate/dashboard/JobPortalMapCard";
import { getCandidateStatsApi } from "@/app/api/candidate/dashboard.api";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { CandidateDashboardResponse } from "@/constants/Interfaces/Types/Dashboard.interface";

// Type definitions
interface JobData {
  key: string | number;
  title: string;
  applications: number;
  views: number;
  matches: number;
}

interface MessageItem {
  name: string;
  text: string;
  time: string;
  avatar: string;
  unread: boolean;
}

interface TopIconAndNavigationProps {
  icon: React.ReactNode;
  title: string;
  arrow?: { shown?: boolean; href?: string };
  bgColorIcon?: string;
}

export default function Dashboard() {
  const [candidateStats, setCandidateStats] =
    React.useState<CandidateDashboardResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    getCandidateStatsApi()
      .then((res) => {
        if (!res || !res.data) return;
        setCandidateStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const jobData: JobData[] = [
    {
      key: 2,
      title: "Kotlin developer",
      applications: 45,
      views: 2345,
      matches: 12,
    },
    {
      key: 3,
      title: "Swift developer",
      applications: 63,
      views: 1443,
      matches: 23,
    },
    {
      key: 4,
      title: "UI Developer",
      applications: 79,
      views: 1563,
      matches: 14,
    },
    {
      key: 5,
      title: "React developer",
      applications: 67,
      views: 945,
      matches: 25,
    },
    {
      key: 6,
      title: "Backend NodeJs",
      applications: 105,
      views: 1254,
      matches: 43,
    },
  ];

  // 🔥 Final merged table data
  const activeJobsToShow: JobData[] =
    candidateStats?.recentAppliedJobs &&
      candidateStats.recentAppliedJobs.length > 0
      ? candidateStats.recentAppliedJobs.map((job, idx: number) => ({
        key: job._id || idx,
        title: job.jobId.title,
        applications: 0, // Only mapped because API doesn't provide counts
        views: 0,
        matches: 0,
      }))
      : jobData;

  const jobColumns: ColumnsType<JobData> = [
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

  const messages: MessageItem[] = [
    {
      name: "Donald",
      text: "Hey Adam! Interested in tex hoas asdo ashdoas hasdha asdoash haoshdoas haosdhaoshd ",
      time: "",
      avatar: "D",
      unread: true,
    },
    {
      name: "James Drew",
      text: "Hey Adam! Interested in tex...",
      time: "",
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

  const items: MenuProps["items"] = [
    { label: <a href="#">1st menu item</a>, key: "0" },
    { label: <a href="#">2nd menu item</a>, key: "1" },
    { type: "divider" },
    { label: "3rd menu item", key: "3" },
  ];

  if (loading)
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Left Section */}
      <div className="w-full lg:w-[72%]">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Row gutter={[16, 16]}>
              <StatsCard
                arrow={{ shown: true, href: "/candidate/job-analytics" }}
                icon={<ContainerFilled style={{ color: "white" }} />}
                title="Applied Jobs"
                number={candidateStats?.userAppliedJobsCount || 0}
                badgeText="45%+ in last 30 days"
                badgeColor="green"
              />
              <StatsCard
                arrow={{ shown: true, href: "/candidate/profile" }}
                icon={<ContainerFilled style={{ color: "white" }} />}
                title="Resume Score"
                number={candidateStats?.resumeScore || 0}
                badgeText="45%+ in last 30 days"
                badgeColor="green"
              />
              <StatsCard
                arrow={{ shown: true, href: "/candidate/job-portal" }}
                title="Matched Jobs"
                icon={<StarFilled className="!text-white" />}
                number={candidateStats?.matchedJobsCounts || 0}
                badgeText="45%+ in last 30 days"
                badgeColor="orange"
              />

              <StatsCard
                arrow={{ shown: true, href: "/candidate/interview-section" }}
                icon={<StarFilled className="!text-white" />}
                title="Active Jobs"
                number={candidateStats?.userActiveJobsCount || 0}
                badgeText="45%+ in last 30 days"
                badgeColor="orange"
              />
            </Row>
          </Col>

          {/* Messages Section */}
          <Col xs={24} lg={10}>
            <div className="h-64 bg-white hover-gray-50 relative rounded-lg">
              <div className="flex gap-2 font-bold text-md px-4 items-center py-2">
                <TopIconAndNavigation
                  icon={<MessageFilled style={{ color: "white" }} />}
                  title="Messages"
                  arrow={{ shown: true, href: "/candidate/chat" }}
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
                        <Dropdown menu={{ items }} trigger={["click"]}>
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

              <div className="absolute bottom-0 right-1.5 flex justify-center w-[96%] py-3 bg-gradient-to-t from-gray-50 to-transparent rounded-b-lg">
                <UiButton className="!rounded-2xl" href={ROUTES.DASHBOARD}>
                  Load More
                </UiButton>
              </div>
            </div>
          </Col>
        </Row>

        {/* Active Jobs + Map */}
        <Row gutter={[16, 16]} className="mt-2">
          <Col xs={24} lg={14}>
            <Card
              title="Active Jobs"
              extra={
                <UiButton
                  href={"/candidate/job-portal"}
                  className="group !w-8 !h-8 !rounded-full flex items-center justify-center bg-white border border-gray-300 transition-all duration-300 hover:!bg-blue-500"
                >
                  <ArrowUpOutlined className="text-gray-600 transform rotate-45 transition-all duration-300 ease-in-out group-hover:!text-white group-hover:rotate-90" />
                </UiButton>
              }
            >
              <Table
                dataSource={activeJobsToShow}
                columns={jobColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <div className="bg-white p-4 h-full">
              <TopIconAndNavigation
                icon={<ContainerFilled style={{ color: "white" }} />}
                title="Jobs"
              />
              <JobPortalMapCard />
              <div className="flex justify-center items-start">
                <div className="flex items-center justify-between w-full flex-wrap gap-4">
                  {jobsStats.map((data, index) => (
                    <div key={index} className="text-left">
                      <div className="text-gray-400 text-sm">{data.title}</div>
                      <div className="text-xl font-semibold text-gray-900 tracking-tight">
                        {data.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Right Side - Calendar + Interviews */}
      <div className="w-full lg:w-[28%] bg-white">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Calendar fullscreen={false} className="min-h-[200px] w-full" />
          </Col>

          <Col span={24}>
            <Card
              title="Interviews schedule"
              extra={
                <CalendarOutlined
                  className="text-blue-500"
                  style={{ fontSize: "16px" }}
                />
              }
              className="h-full"
            >
              <p className="mb-3 font-medium text-sm text-gray-500">Today</p>
              <div
                style={{ maxHeight: "180px", overflowY: "auto" }}
                className="scrollbar-hide"
              >
                {(candidateStats?.getTodaysInterview || []).map((interview) => (
                  <div
                    key={interview._id}
                    className="flex items-center mb-2 justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-sm">
                          {interview.jobId.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {interview.companyId.companyName}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      size="small"
                      className="bg-orange-500 border-orange-500 hover:bg-orange-600"
                    >
                      Join now
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

const jobsStats = [
  { title: "Total jobs", value: 85357 },
  { title: "New Jobs", value: 240 },
  { title: "Recommended", value: 12450 },
];

export const TopIconAndNavigation: React.FC<TopIconAndNavigationProps> = ({
  icon,
  title,
  arrow = { shown: true, href: "" },
  bgColorIcon = "#1890FF",
}) => {
  return (
    <div className="flex items-center justify-between w-full mb-2">
      <div className="flex gap-3 items-center">
        <div
          className="w-8 h-8 flex justify-center items-center rounded-full"
          style={{ backgroundColor: bgColorIcon }}
        >
          {icon}
        </div>
        <div className="text-black font-semibold">{title}</div>
      </div>

      {arrow.shown && (
        <UiButton
          href={arrow.href}
          className="group !w-8 !h-8 !rounded-full flex items-center justify-center bg-white border border-gray-300 transition-all duration-300 hover:!bg-blue-500"
        >
          <ArrowUpOutlined className="text-gray-600 transform rotate-45 transition-all duration-300 ease-in-out group-hover:!text-white group-hover:rotate-90" />
        </UiButton>
      )}
    </div>
  );
};
