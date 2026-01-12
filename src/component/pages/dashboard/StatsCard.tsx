import React from "react";
import { Col } from "antd";
import { ProfileFilled } from "@ant-design/icons";
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
  };
  bgColorIcon?: string;
}

export default function StatsCard({
  icon = <ProfileFilled style={{ color: "white" }} />,
  title = "Applicants",
  number = 23,
  badgeText,
  // badgeColor = "orange",
  arrow = {
    shown: true,
    href: "",
  },
  bgColorIcon = "#1890FF",
}: StatsCardProps) {
  // const colorMap = {
  //   green: {
  //     bg: "#F6FFED",
  //     text: "#52C41A",
  //     border: "#52C41A",
  //   },
  //   orange: {
  //     bg: "#FFF7E6",
  //     text: "#FA8C16",
  //     border: "#FA8C16",
  //   },
  // };

  // const colors = colorMap[badgeColor];

  return (
    <Col
      xs={24} // Full width on small screens
      sm={12} // Two per row on tablets
      md={12} // Two per row on medium screens
      lg={12} // Two per row on large screens
    >
      <div className="h-30 p-4 bg-white rounded-xl">
        <div className="flex flex-col justify-between w-full h-full">
          {/* Top Section */}
          <TopIconAndNavigation
            icon={icon}
            title={title}
            arrow={arrow}
            bgColorIcon={bgColorIcon}
          />

          {/* Bottom Section */}
          <div>
            <div className="text-sm text-[#8C8C8C]">{title}</div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-4xl font-semibold text-black">{number}</div>

              {badgeText && (
                <>
                  {/* <Badge
                    count={badgeText}
                    className="rounded-full !mt-2.5"
                    style={{
                      color: colors.text,
                      borderColor: colors.border,
                    }}
                  /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}
