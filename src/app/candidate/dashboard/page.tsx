"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, Table, Button, Row, Col, Tag, Spin } from "antd";
import {
  ContainerFilled,
  StarFilled,
  CalendarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ArrowUpOutlined,
} from "@ant-design/icons";
import StatsCard from "@/component/pages/dashboard/StatsCard";
import { getCandidateStatsApi } from "@/app/api/candidate/dashboard.api";
import { CandidateDashboardResponse } from "@/constants/Interfaces/Types/Dashboard.interface";
import UiButton from "@/component/common/CustomButton";


interface TopIconAndNavigationProps {
  icon: React.ReactNode;
  title: string;
  arrow?: { shown?: boolean; href?: string };
  bgColorIcon?: string;
}

export default function Dashboard() {
  const [candidateStats, setCandidateStats] =
    useState<CandidateDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const statsRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCandidateStatsApi()
      .then((res) => {
        if (!res || !res.data) return;
        setCandidateStats(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  // Recent applied jobs table
  const appliedJobsData =
    candidateStats?.recentAppliedJobs?.map((app) => ({
      key: app._id,
      title: app.jobId?.title || "N/A",
      role: app.jobId?.role || "",
      workMode: app.jobId?.workMode || "",
      status: app.status,
      deadline: new Date(app.jobId?.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      deadlineRaw: new Date(app.jobId?.deadline),
    })) || [];

  const isExpiringSoon = (date: Date) => {
    const diffDays = Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 1;
  };

  const appliedJobsColumns = [
    {
      title: "Position",
      key: "position",
      render: (record: (typeof appliedJobsData)[0]) => (
        <div style={{ minWidth: 0 }}>
          <p className="font-medium text-sm text-gray-800 m-0 truncate">
            {record.role}
          </p>
          <p className="text-xs text-gray-400 m-0 truncate">{record.title}</p>
        </div>
      ),
    },
    {
      title: "Mode",
      dataIndex: "workMode",
      key: "workMode",
      width: 95,
      render: (mode: string) => (
        <Tag
          color={
            mode === "remote" ? "blue" : mode === "full-time" ? "green" : "gold"
          }
          className="text-xs capitalize m-0"
        >
          {mode}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 105,
      render: (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode }> =
        {
          ended: { color: "red", icon: <CloseCircleFilled /> },
          scheduled: { color: "orange", icon: <CheckCircleFilled /> },
          completed: { color: "green", icon: <CheckCircleFilled /> },
        };
        const cfg = config[status] || { color: "default", icon: null };
        return (
          <Tag
            color={cfg.color}
            icon={cfg.icon}
            className="text-xs capitalize m-0"
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Due",
      key: "deadline",
      width: 58,
      render: (record: (typeof appliedJobsData)[0]) => (
        <span
          className={`text-xs font-medium ${isExpiringSoon(record.deadlineRaw) ? "text-red-500" : "text-gray-500"
            }`}
        >
          {record.deadline}
        </span>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: "#f9fafb",
      }}
    >
      {/* Stats Row */}
      <div ref={statsRowRef} style={{ flexShrink: 0 }}>
        <Row gutter={[12, 12]}>
          <StatsCard
            arrow={{ shown: true, href: "/candidate/job-portal" }}
            icon={<ContainerFilled style={{ color: "white" }} />}
            title="Applied Jobs"
            number={candidateStats?.userAppliedJobsCount || 0}
            badgeText="Total applied"
            badgeColor="green"
          />
          <StatsCard
            arrow={{ shown: true, href: "/candidate/profile" }}
            icon={<StarFilled className="!text-white" />}
            title="Resume Score"
            number={candidateStats?.resumeScore || 0}
            badgeText="Profile strength"
            badgeColor="green"
          />
          <StatsCard
            arrow={{ shown: true, href: "/candidate/job-portal" }}
            icon={<StarFilled className="!text-white" />}
            title="Matched Jobs"
            number={candidateStats?.matchedJobsCounts || 0}
            badgeText="AI matched"
            badgeColor="orange"
          />
          <StatsCard
            arrow={{ shown: true, href: "/candidate/interview-section" }}
            icon={<StarFilled className="!text-white" />}
            title="Active Jobs"
            number={candidateStats?.userActiveJobsCount || 0}
            badgeText="In progress"
            badgeColor="orange"
          />
        </Row>
      </div>

      {/* Main Content Row */}
      <Row gutter={[12, 0]} style={{ flex: 1, minHeight: 0 }}>
        {/* Left: Recent Applied Jobs */}
        <Col
          xs={24}
          lg={16}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Card
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            styles={{
              body: {
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                padding: "0 16px 12px",
              },
            }}
            title={
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Recent Applied Jobs
              </span>
            }
            extra={
              <Button
                type="link"
                size="small"
                href="/candidate/job-portal"
                style={{ fontSize: 12, padding: 0 }}
              >
                View all →
              </Button>
            }
          >
            <Table
              dataSource={appliedJobsData.splice(0, 4)}
              columns={appliedJobsColumns}
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>

        {/* Right: Calendar + Today's Interviews */}
        <Col
          xs={24}
          lg={8}
          style={{ height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}
        >

          {/* Today's Interviews */}
          <Card
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            styles={{
              body: {
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                padding: "12px 16px",
              },
            }}
            title={
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Today&apos;s interviews
              </span>
            }
            extra={
              <CalendarOutlined
                className="text-blue-500"
                style={{ fontSize: 15 }}
              />
            }
          >
            {candidateStats?.getTodaysInterview?.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {candidateStats.getTodaysInterview.map((interview) => (
                  <div
                    key={interview._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      background: "#e4f5e7",
                      borderRadius: 8,
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#52c41a",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p
                          className="font-semibold text-sm m-0 truncate"
                          style={{ color: "#1a1a1a" }}
                        >
                          {interview.jobId?.title}
                        </p>
                        <p className="text-xs text-gray-500 m-0 truncate">
                          {interview.companyId?.companyName}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                    >
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--color-text-secondary)",
                  padding: "24px 0",
                  fontSize: 13,
                }}
              >
                No interviews scheduled today
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

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