"use client";

import type React from "react";
import { Card, Button, Space, Typography, Alert } from "antd";
import { CalendarOutlined, PaperClipOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface ApplicationScore {
  score: number;
  description: string;
  link?: string;
  linkText?: string;
}

interface JobApplicationStatsProps {
  resumeFile?: {
    name: string;
    url: string;
  };
  applicationScore?: ApplicationScore;
  interviewScore?: ApplicationScore;
  aiMatchScore?: ApplicationScore;
  onScheduleInterview?: () => void;
  quizWarning?: {
    required: number;
    actual: number;
  };
}

const defaultApplicationScore: ApplicationScore = {
  score: 60,
  description: "in role-specific quiz section",
  link: "#",
  linkText: "Review application quiz transcript",
};

const defaultInterviewScore: ApplicationScore = {
  score: 70,
  description: "in the live interview",
  link: "#",
  linkText: "Review interview transcript",
};

const defaultAiMatchScore: ApplicationScore = {
  score: 85,
  description: "according to our AI assessment.",
  link: "#",
  linkText: "Review details",
};

export const JobApplicationStats: React.FC<JobApplicationStatsProps> = ({
  resumeFile = {
    name: "AlexjamesResume.pdf",
    url: "#",
  },
  applicationScore = defaultApplicationScore,
  interviewScore = defaultInterviewScore,
  aiMatchScore = defaultAiMatchScore,
  onScheduleInterview,
  quizWarning = {
    required: 75,
    actual: 75,
  },
}) => {
  return (
    <div className="w-full flex flex-col gap-2 space-y-6">
      {/* Resume Attached Section */}
      <Card className="rounded-xl border-0 shadow-sm">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Resume Attached
            </Title>
            <Text type="secondary">
              The candidate's resume is attached below for review purposes
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <PaperClipOutlined className="text-green-500" />
            <a
              href={resumeFile.url}
              className="text-green-500 hover:text-green-600"
            >
              {resumeFile.name}
            </a>
          </div>
        </Space>
      </Card>

      {/* Application Score Section */}
      <Card className="rounded-xl border-0 shadow-sm">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Application Score
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              The candidate scored <Text strong>{applicationScore.score}%</Text>{" "}
              {applicationScore.description}
            </Paragraph>
          </div>
          {applicationScore.link && (
            <a
              href={applicationScore.link}
              className="text-blue-500 hover:text-blue-600"
            >
              {applicationScore.linkText}
            </a>
          )}
        </Space>
      </Card>

      {/* Interview Score Section */}
      <Card className="rounded-xl border-0 shadow-sm">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Interview Score
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              The candidate scored <Text strong>{interviewScore.score}%</Text>{" "}
              {interviewScore.description}
            </Paragraph>
          </div>
          {interviewScore.link && (
            <a
              href={interviewScore.link}
              className="text-blue-500 hover:text-blue-600"
            >
              {interviewScore.linkText}
            </a>
          )}
        </Space>
      </Card>

      {/* AI Match Score Section */}
      <Card className="rounded-xl border-0 shadow-sm">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              AI Match Score
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              The candidate has scored <Text strong>{aiMatchScore.score}%</Text>{" "}
              {aiMatchScore.description}
            </Paragraph>
          </div>
          {aiMatchScore.link && (
            <a
              href={aiMatchScore.link}
              className="text-blue-500 hover:text-blue-600"
            >
              {aiMatchScore.linkText}
            </a>
          )}
        </Space>
      </Card>

      {/* Schedule Interview Section */}
      <Card className="rounded-xl border-0 shadow-sm">
        <div className="flex justify-between items-center">
          <Space direction="vertical">
            <Title level={5} style={{ margin: 0 }}>
              Do you want to schedule interview now?
            </Title>
            <Text type="secondary">
              Want to interact with candidate? Send them a scheduled interview
              invitation.
            </Text>
            {quizWarning && quizWarning.actual < quizWarning.required && (
              <Alert
                message={`The required quiz score was ${quizWarning.required}%.`}
                type="warning"
                showIcon
                style={{ marginTop: "8px" }}
              />
            )}
          </Space>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={onScheduleInterview}
            className="rounded-full"
          >
            Schedule
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JobApplicationStats;
