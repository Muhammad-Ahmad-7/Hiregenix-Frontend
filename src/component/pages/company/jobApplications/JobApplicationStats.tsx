"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Select, Row, Col, Statistic, Avatar } from "antd";
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
  totalApplications: number;
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
  totalApplications,
  // statsData = defaultStatsData,
  onJobRoleChange,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Initialize with first job role when data is available
  useEffect(() => {
    if (jobRoles.length > 0 && !selectedRole) {
      setSelectedRole(jobRoles[0].value);
    }
  }, [jobRoles, selectedRole]);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    onJobRoleChange?.(value);
  };

  // const currentStats = statsData[selectedRole] || {
  //   totalApplications: 0,
  //   totalViews: 0,
  //   bestMatches: 0,
  // };

  return (
    <div className="w-full py-2 mb-2 rounded-lg">
      <Row gutter={[24, 24]}>
        {/* Job Role Selector */}
        <Col xs={24} sm={12} lg={6}>
          <div className="p-4 py-[34px] bg-white rounded-2xl shadow-sm flex justify-between items-center">
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
              value={selectedRole || undefined}
              onChange={handleRoleChange}
              style={{ width: 200 }}
              suffixIcon={<DownOutlined />}
              placeholder="Select Job Role"
              options={jobRoles.map((role) => ({
                label: role.label,
                value: role.value,
              }))}
            />
          </div>
        </Col>

        {/* Total Applications */}
        <Col xs={24} sm={12} lg={6}>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <Statistic
              title="Total applications"
              value={totalApplications | 0}
              valueStyle={{
                color: "#000",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            />
          </div>
        </Col>

        {/* Total Views */}
        {/* <Col xs={24} sm={12} lg={6}>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <Statistic
              title="Total Views"
              value={currentStats.totalViews}
              valueStyle={{
                color: "#000",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            />
          </div>
        </Col> */}

        {/* Best Matches */}
        {/* <Col xs={24} sm={12} lg={6}>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <Statistic
              title="Best Matches"
              value={currentStats.bestMatches}
              valueStyle={{
                color: "#000",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            />
          </div>
        </Col> */}
      </Row>
    </div>
  );
};

export default JobApplicationStats;
