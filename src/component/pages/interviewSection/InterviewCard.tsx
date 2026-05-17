"use client";

import React from "react";
import Image from "next/image";
import { Button } from "antd";
import {
  VideoCameraOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import IconWrapper from "@/icons/IconWrapper";

interface InterviewCardProps {
  title: string;
  company: string;
  logo?: string;
  type: string;
  deadline: string;
  onJoin?: () => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  title,
  company,
  logo,
  type,
  deadline,
  onJoin,
}) => {
  return (
    <div className="interview-card bg-white shadow-sm hover:shadow-md transition-all rounded-2xl p-5 flex flex-col justify-between w-full flex-wrap sm:w-[350px] border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {logo ? (
            <Image
              src={logo}
              alt={`${company} logo`}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <DesktopOutlined className="text-gray-500 text-2xl" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex justify-between text-sm text-gray-700 mb-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-gray-500">
            <IconWrapper
              icon={<DesktopOutlined style={{ color: "white" }} />}
              bgColorIcon="black"
            />

            <span className="font-medium">Type</span>
          </div>
          <span className="font-semibold text-gray-800">{type}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-gray-500">
            <IconWrapper
              icon={<CalendarOutlined style={{ color: "white" }} />}
              bgColorIcon="black"
            />
            <span className="font-medium">Deadline</span>
          </div>
          <span className="font-semibold text-gray-800">{deadline}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 justify-between">
        <Button
          type="primary"
          icon={<VideoCameraOutlined />}
          className="!rounded-full font-semibold !w-full  px-5 mx-2 h-10 flex items-center"
          onClick={onJoin}
        >
          Join Interview
        </Button>

        <div className="border rounded-full p-2 hover:bg-gray-100 cursor-pointer transition">
          <ClockCircleOutlined className="text-gray-700 text-lg" />
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
