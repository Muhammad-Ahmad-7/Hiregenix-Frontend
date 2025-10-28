"use client";

import { Card, Button, Space, Avatar, Tag } from "antd";
import { PhoneOutlined, InfoCircleOutlined } from "@ant-design/icons";

interface InterviewCardProps {
  name: string;
  role: string;
  avatar?: string;
  interviewType: "Task" | "Onsite" | "Phone";
  date: string;
  onJoin?: () => void;
}

export default function InterviewCard({
  name,
  role,
  avatar,
  interviewType,
  date,
  onJoin,
}: InterviewCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Task":
        return "purple";
      case "Onsite":
        return "cyan";
      case "Phone":
        return "blue";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar size={48} src={avatar} className="flex-shrink-0">
          {name.charAt(0)}
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mb-3">{role}</p>
          <div className="flex gap-2 mb-4">
            <Tag color={getTypeColor(interviewType)} className="text-xs">
              {interviewType}
            </Tag>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          <Space className="w-full">
            <Button
              type="primary"
              icon={<PhoneOutlined />}
              onClick={onJoin}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Join Interview
            </Button>
            <Button type="text" icon={<InfoCircleOutlined />} />
          </Space>
        </div>
      </div>
    </Card>
  );
}
