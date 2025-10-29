"use client";

import type React from "react";
import { useState } from "react";
import { Select, Card, Row, Col, Statistic, Avatar } from "antd";
import { DownOutlined } from "@ant-design/icons";

interface JobRole {
  value: string;
  label: string;
  icon?: string;
}

interface StatsData {
  totalApplications: number;
  totalViews: number;
  bestMatches: number;
}

interface JobApplicationStatsProps {
  jobRoles?: JobRole[];
  statsData?: Record<string, StatsData>;
  onJobRoleChange?: (value: string) => void;
}

const defaultJobRoles: JobRole[] = [
  { value: "frontend", label: "Frontend Developer" },
  { value: "backend", label: "Backend Developer" },
  { value: "fullstack", label: "Full Stack Developer" },
  { value: "devops", label: "DevOps Engineer" },
];

const defaultStatsData: Record<string, StatsData> = {
  frontend: {
    totalApplications: 128,
    totalViews: 596,
    bestMatches: 2,
  },
  backend: {
    totalApplications: 95,
    totalViews: 420,
    bestMatches: 1,
  },
  fullstack: {
    totalApplications: 156,
    totalViews: 712,
    bestMatches: 3,
  },
  devops: {
    totalApplications: 42,
    totalViews: 189,
    bestMatches: 0,
  },
};

export const JobApplicationStats: React.FC<JobApplicationStatsProps> = ({
  jobRoles = defaultJobRoles,
  statsData = defaultStatsData,
  onJobRoleChange,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("frontend");

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    onJobRoleChange?.(value);
  };

  const currentStats = statsData[selectedRole] || defaultStatsData.frontend;
  const selectedRoleLabel =
    jobRoles.find((role) => role.value === selectedRole)?.label ||
    "Frontend Developer";

  return (
    <div className="w-full py-2 mb-2 rounded-lg">
      {/* Job Role Selector */}

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        {/* <Col xs={24} sm={12} lg={6}>
          <div className="mb-8 flex items-center gap-4">
            <Avatar
              size={40}
              style={{
                backgroundColor: "#FF6B35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<span style={{ fontSize: "20px" }}>👨‍💻</span>}
            />
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              style={{ width: 200 }}
              suffixIcon={<DownOutlined />}
              options={jobRoles.map((role) => ({
                label: role.label,
                value: role.value,
              }))}
            />
          </div>
        </Col> */}
        <Col xs={24} sm={12} lg={6}>
          <div
            bordered={false}
            className="p-4 py-[34] bg-white rounded-2xl shadow-sm flex justify-between items-center"
          >
            <Avatar
              size={40}
              style={{
                backgroundColor: "#FF6B35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<span style={{ fontSize: "20px" }}>👨‍💻</span>}
            />
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              style={{ width: 200 }}
              suffixIcon={<DownOutlined />}
              options={jobRoles.map((role) => ({
                label: role.label,
                value: role.value,
              }))}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div bordered={false} className="p-4 bg-white rounded-2xl shadow-sm">
            <Statistic
              title="Total applications"
              value={currentStats.totalApplications}
              valueStyle={{
                color: "#000",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div bordered={false} className="p-4 bg-white rounded-2xl shadow-sm">
            <Statistic
              title="Total applications"
              value={currentStats.totalApplications}
              valueStyle={{
                color: "#000",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div bordered={false} className="p-4 bg-white rounded-2xl shadow-sm">
            <Statistic
              title="Total applications"
              value={currentStats.totalApplications}
              valueStyle={{
                color: "#000",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default JobApplicationStats;
