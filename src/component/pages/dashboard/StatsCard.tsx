import React from "react";
import { Col, Badge } from "antd";
import { ProfileFilled, ContainerFilled } from "@ant-design/icons";
import ArrowRightUp from "@/icons/ArrowRightUp";

interface StatsCardProps {
  icon?: React.ReactNode;
  title?: string;
  number?: number | string;
  badgeText?: string;
  badgeColor?: "green" | "orange"; // only two options
}

export default function StatsCard({
  icon = <ProfileFilled style={{ color: "white" }} />,
  title = "Applicants",
  number = 23,
  badgeText, // no default → hidden unless provided
  badgeColor = "orange",
}: StatsCardProps) {
  // color map logic
  const colorMap = {
    green: {
      bg: "#F6FFED",
      text: "#52C41A",
      border: "#52C41A",
    },
    orange: {
      bg: "#FFF7E6",
      text: "#FA8C16",
      border: "#FA8C16",
    },
  };

  const colors = colorMap[badgeColor];

  return (
    <Col span={12}>
      <div className="h-40 p-4 bg-white rounded-xl">
        <div className="flex flex-col justify-between w-full h-full">
          {/* Top Section */}
          <div className="flex items-center justify-between w-full mb-2">
            <div className="bg-orange-300 w-8 h-8 flex justify-center items-center rounded-full">
              {icon}
            </div>
            <div className="w-8 h-8 flex justify-center items-center rounded-full border border-gray-300">
              <ArrowRightUp />
            </div>
          </div>

          {/* Bottom Section */}
          <div>
            <div className="text-sm text-[#8C8C8C]">{title}</div>
            <div className="flex items-center gap-3">
              <div className="text-5xl font-semibold text-black">{number}</div>

              {/* Show badge only when badgeText is provided */}
              {badgeText && (
                <Badge
                  count={badgeText}
                  className="rounded-full !mt-2.5"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}
