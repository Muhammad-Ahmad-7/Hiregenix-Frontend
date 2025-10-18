import React from "react";
import { Col, Badge } from "antd";
import { ProfileFilled, ContainerFilled } from "@ant-design/icons";
import ArrowRightUp from "@/icons/ArrowRightUp";
import { TopIconAndNavigation } from "@/app/candidate/dashboard/page";

interface StatsCardProps {
  icon?: React.ReactNode;
  title?: string;
  number?: number | string;
  badgeText?: string;
  badgeColor?: "green" | "orange";
  arrow?: {
    shown?: boolean;
    href?: string;
  }; // only two options
}

export default function StatsCard({
  icon = <ProfileFilled style={{ color: "white" }} />,
  title = "Applicants",
  number = 23,
  badgeText, // no default → hidden unless provided
  badgeColor = "orange",
  arrow = {
    shown: true,
    href: "",
  },
  bgColorIcon = "#1890FF",
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
      <div className="h-40 p-4 bg-goldenPurple-5 rounded-xl">
        <div className="flex flex-col justify-between w-full h-full">
          {/* Top Section */}
          <TopIconAndNavigation
            icon={icon}
            arrow={arrow}
            bgColorIcon={bgColorIcon}
          />
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
