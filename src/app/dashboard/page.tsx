"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, List, Avatar, Button, Row, Col } from "antd";
import {
  MessageOutlined,
  CalendarOutlined,
  RiseOutlined,
  ContainerFilled,
  StarFilled,
} from "@ant-design/icons";
import StatsCard from "@/component/pages/dashboard/StatsCard";
import { getCompanyStatsApi } from "../api/company/dashboard.api";

// ---------------------
// Interfaces
// ---------------------
export interface Location {
  city: string;
  country: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  _id: string;
  companyId: string;

  title: string;
  role: string;

  location: Location;
  salaryRange: SalaryRange;

  interviewGuideline: string;
  experienceLevel: "junior" | "mid" | "senior" | string;
  description: string;

  requiredSkills: string[];
  requirements: string[];

  workMode: "remote" | "onsite" | "hybrid" | "full-time" | string;

  deadline: string;
  aiSummary: string;

  embeddingSynced: boolean;
  qdrantId: string | null;

  isDeleted: boolean;
  status: "open" | "closed" | string;

  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AiResult {
  strengths: string[];
  improvements: string[];
}

export interface RecentApplication {
  _id: string;
  candidateId: string;
  companyId: string;
  jobId: string;

  type: "live" | "screening" | string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled" | string;

  aiResult: AiResult;

  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CompanyDashboardResponse {
  postedJobsCount: number;
  activeJobsCount: number;
  appliedJobsCount: number;
  closedJobsCount: number;

  activeJobs: Job[];
  recentApplications: RecentApplication[];
}

// ---------------------
// Component
// ---------------------

export default function Dashboard() {
  const [stats, setStats] = useState<CompanyDashboardResponse | null>(null);

  useEffect(() => {
    getCompanyStatsApi().then((res) => {
      console.log("API Stats:", res);
      setStats(res?.data || res);
    });
  }, []);

  // Table Columns
  const jobColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
    },
    {
      title: "Location",
      key: "location",
      render: (_: any, job: Job) =>
        `${job.location.city}, ${job.location.country}`,
      align: "center",
    },
    {
      title: "Salary",
      key: "salaryRange",
      render: (_: any, job: Job) =>
        `${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency}`,
      align: "center",
    },
    {
      title: "Experience",
      dataIndex: "experienceLevel",
      key: "experienceLevel",
      align: "center",
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

  const todayInterviews =
    stats?.recentApplications.filter((i) => i.status === "scheduled") || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* FIRST ROW -------------------------------- */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <StatsCard
              icon={<ContainerFilled style={{ color: "white" }} />}
              title="Jobs Posted"
              number={stats?.postedJobsCount || 0}
              badgeText="Total jobs posted"
              badgeColor="green"
            />

            <StatsCard
              icon={<StarFilled className="!text-white" />}
              title="Active Jobs"
              number={stats?.activeJobsCount || 0}
              badgeText="Jobs currently open"
              badgeColor="orange"
            />

            <StatsCard
              icon={<StarFilled className="!text-white" />}
              title="Closed Jobs"
              number={stats?.closedJobsCount || 0}
              badgeText="Jobs closed"
              badgeColor="orange"
            />

            <StatsCard
              icon={<StarFilled className="!text-white" />}
              title="Total Applications"
              number={stats?.appliedJobsCount || 0}
              badgeText="Candidate applications"
              badgeColor="orange"
            />
          </Row>
        </Col>

        {/* Right: Weekly Chart */}
        <Col span={12}>
          <Card
            title="Applications received per week"
            className="h-full"
            extra={<span className="text-sm text-gray-400">Weekly Stats</span>}
          >
            <div className="flex items-end justify-between h-40 px-4 mt-4">
              {[5, 9, 5, 12, 6, 7, 6].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-400 mb-1">{value}</div>
                  <div
                    className="bg-blue-500 rounded-t w-6"
                    style={{ height: `${(value / 12) * 100}px` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* SECOND ROW -------------------------------- */}
      <Row gutter={[16, 16]} className="mt-6">
        {/* ACTIVE JOBS TABLE */}
        <Col span={12}>
          <Card
            title="Active Jobs"
            extra={<RiseOutlined className="text-gray-400" />}
          >
            <Table
              dataSource={stats?.activeJobs || []}
              columns={jobColumns}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* INTERVIEW SCHEDULE */}
        <Col span={12}>
          <Card
            title="Interviews schedule"
            extra={<CalendarOutlined className="text-blue-500" />}
            className="h-full"
          >
            <p className="mb-3 font-medium text-sm text-gray-500">Upcoming</p>

            {todayInterviews.length === 0 && (
              <p className="text-gray-400 text-sm">No interviews scheduled.</p>
            )}

            {todayInterviews.map((i) => (
              <div
                key={i._id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-2"
              >
                <div>
                  <p className="font-semibold text-sm">Job ID: {i.jobId}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(i.scheduledDate).toLocaleString()}
                  </p>
                </div>
                <Button
                  type="primary"
                  size="small"
                  className="bg-blue-500 border-blue-500"
                >
                  Join now
                </Button>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
