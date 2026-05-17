"use client";

import { Card, Table, Row, Col, Tag } from "antd";
import {
  ContainerFilled,
  StarFilled,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import StatsCard from "@/component/pages/dashboard/StatsCard";
import DashboardSkeleton from "@/component/Skeletons/DashboardSkeleton";
import { useEffect, useRef, useState } from "react";
import { getCompanyStatsApi } from "@/app/api/company/dashboard.api";
import { CompanyDashboardResponse } from "@/constants/Interfaces/Types/Dashboard.interface";
import Link from "next/link";

export default function Dashboard() {
  const [companyStats, setCompanyStats] =
    useState<CompanyDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  const statsRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScrollY = () => {
      const lg = window.innerWidth >= 992; // Ant Design lg breakpoint
      setIsLargeScreen(lg);
    };

    calculateScrollY();
    window.addEventListener("resize", calculateScrollY);
    return () => window.removeEventListener("resize", calculateScrollY);
  }, []);

  useEffect(() => {
    setLoading(true);
    getCompanyStatsApi()
      .then((res) => {
        if (!res || !res.data) return;
        setCompanyStats(res.data);
      })
      .catch((error) => {
        console.error("Error fetching company stats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const isExpiringSoon = (date: Date) => {
    const diffDays = Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 1;
  };

  const jobData =
    companyStats?.activeJobs?.map((job) => ({
      key: job._id,
      role: job.role,
      subtitle: `${job.title} · ${job.experienceLevel}`,
      workMode: job.workMode,
      deadline: new Date(job.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      deadlineRaw: new Date(job.deadline),
    })) || [];

  const jobColumns = [
    {
      title: "Role",
      key: "role",
      render: (record: (typeof jobData)[0]) => (
        <div style={{ minWidth: 0 }}>
          <p className="font-medium text-sm text-gray-800 m-0 truncate">
            {record.role}
          </p>
          <p className="text-xs text-gray-400 m-0 truncate">{record.subtitle}</p>
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
      title: "Due",
      key: "deadline",
      width: 58,
      render: (record: (typeof jobData)[0]) => (
        <span
          className={`text-xs font-medium ${isExpiringSoon(record.deadlineRaw) ? "text-red-500" : "text-gray-500"
            }`}
        >
          {record.deadline}
        </span>
      ),
    },
  ];

  const applicationData =
    companyStats?.recentApplications?.map((app) => ({
      key: app._id,
      candidateName: app.candidateId?.fullName || "Unknown",
      avatarInitials: app.candidateId?.fullName
        ? app.candidateId.fullName
          .split(" ")
          .slice(0, 2)
          .map((n: string) => n[0])
          .join("")
        : "?",
      jobTitle: app.jobId?.title || "N/A",
      status: app.status,
    })) || [];

  const applicationColumns = [
    {
      title: "Candidate",
      key: "candidate",
      render: (record: (typeof applicationData)[0]) => (
        <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
            {record.avatarInitials}
          </div>
          <span className="text-sm font-medium text-gray-800 truncate">
            {record.candidateName}
          </span>
        </div>
      ),
    },
    {
      title: "Position",
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (title: string) => (
        <span className="text-xs text-gray-500 truncate block">{title}</span>
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
  ];

  // On large screens: fixed full-height layout with internal scroll
  // On mobile/medium: natural flow layout, outer container scrolls
  const lgCardStyle = isLargeScreen
    ? {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
    }
    : {};

  const lgCardBodyStyle = isLargeScreen
    ? {
      flex: 1,
      minHeight: 0,
      overflow: "hidden",
      padding: "0 16px 12px",
    }
    : { padding: "0 16px 12px" };

  const lgColStyle = isLargeScreen
    ? { height: "100%", display: "flex", flexDirection: "column" as const }
    : { marginBottom: 12 };

  if (loading) {
    return <DashboardSkeleton variant="company" />;
  }

  return (
    <div
      style={{
        // On large screens: fixed viewport height, no scroll (tables scroll internally)
        // On mobile/medium: auto height, outer div scrolls
        height: isLargeScreen ? "100vh" : "auto",
        minHeight: "100vh",
        overflow: isLargeScreen ? "hidden" : "visible",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* Stats Row */}
      <div ref={statsRowRef} style={{ flexShrink: 0 }}>
        <Row gutter={[12, 12]}>
          <StatsCard
            arrow={{ shown: true, href: "/company/job-analytics" }}
            icon={<ContainerFilled style={{ color: "white" }} />}
            title="Jobs Posted"
            number={companyStats?.postedJobsCount || 0}
            badgeText="Total listings"
            badgeColor="green"
          />
          <StatsCard
            arrow={{ shown: true, href: "/company/job-analytics" }}
            icon={<StarFilled className="!text-white" />}
            title="Active Jobs"
            number={companyStats?.activeJobsCount || 0}
            badgeText="Currently open"
            badgeColor="green"
          />
          <StatsCard
            arrow={{ shown: true, href: "/company/job-applications" }}
            icon={<StarFilled className="!text-white" />}
            title="Applications"
            number={companyStats?.appliedJobsCount || 0}
            badgeText="In review"
            badgeColor="orange"
          />
          <StatsCard
            arrow={{ shown: true, href: "/company/job-analytics" }}
            icon={<StarFilled className="!text-white" />}
            title="Closed Jobs"
            number={companyStats?.closedJobsCount || 0}
            badgeText="Filled / expired"
            badgeColor="green"
          />
        </Row>
      </div>

      {/* Tables Row */}
      <Row
        gutter={[12, 12]}
        style={isLargeScreen ? { flex: 1, minHeight: 0 } : {}}
      >
        <Col xs={24} lg={12} style={lgColStyle}>
          <Card
            style={lgCardStyle}
            styles={{ body: lgCardBodyStyle }}
            title={
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Active Job Listings
              </span>
            }
            extra={
              <Link
                type="link"
                href="/company/job-analytics"
                style={{ fontSize: 12, padding: 0 }}
              >
                View all →
              </Link>
            }
          >
            <Table
              dataSource={jobData.slice(0, 4)}
              columns={jobColumns}
              pagination={false}
              size="small"
              loading={loading}
              scroll={{ x: '100%' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12} style={lgColStyle}>
          <Card
            style={lgCardStyle}
            styles={{ body: lgCardBodyStyle }}
            title={
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Recent Applications
              </span>
            }
            extra={
              <Link
                type="link"
                href="/company/job-applications"
                style={{ fontSize: 12, padding: 0 }}
              >
                View all →
              </Link>
            }
            loading={loading}
          >
            <Table
              dataSource={applicationData.slice(0, 5)}
              columns={applicationColumns}
              pagination={false}
              size="large"
              scroll={{ x: "100%" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}