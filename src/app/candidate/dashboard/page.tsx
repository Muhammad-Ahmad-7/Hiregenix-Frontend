"use client";

import React, { useState } from "react";
import {
  Card,
  Table,
  List,
  Avatar,
  Button,
  Dropdown,
  Row,
  Col,
  Select,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  MoreOutlined,
  RiseOutlined,
  ContainerFilled,
  StarFilled,
  MessageFilled,
  ArrowUpOutlined,
} from "@ant-design/icons";
import ArrowRightUp from "@/icons/ArrowRightUp";
import StatsCard from "@/component/pages/dashboard/StatsCard";
import Star from "@/icons/Star";
import { Color } from "antd/es/color-picker";
import DropdownButton from "antd/es/dropdown/dropdown-button";
import UiButton from "@/component/common/CustomButton";
import { ROUTES } from "@/constants/routes";
import { JobPortalMapCard } from "@/component/pages/candidate/dashboard/JobPortalMapCard";

const { Option } = Select;

export default function Dashboard() {
  // Table Data
  const [laoding, setLaoding] = useState(false);
  const jobData = [
    {
      key: 1,
      title: "Front-end developer",
      jobData: 127,
      views: 1400,
      matches: 32,
    },
    {
      key: 2,
      title: "Kotlin developer",
      applications: 45,
      views: 2345,
      matches: 12,
    },
    {
      key: 3,
      title: "Swift developer",
      applications: 63,
      views: 1443,
      matches: 23,
    },
    {
      key: 4,
      title: "UI Developer",
      applications: 79,
      views: 1563,
      matches: 14,
    },
    {
      key: 5,
      title: "React developer",
      applications: 67,
      views: 945,
      matches: 25,
    },
    {
      key: 6,
      title: "Backend NodeJs",
      applications: 105,
      views: 1254,
      matches: 43,
    },
  ];

  const jobColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
    },
    {
      title: "Applications",
      dataIndex: "applications",
      key: "applications",
      align: "center",
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      align: "center",
    },
    {
      title: "AI matches",
      dataIndex: "matches",
      key: "matches",
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

  // Messages Data
  const messages = [
    {
      name: "Alexa",
      text: "Hey Adam! Interested in tex...",
      time: "3m",
      avatar: "A",
      unread: true,
    },
    {
      name: "Donald",
      text: "Hey Adam! Interested in tex hoas asdo ashdoas hasdha asdoash haoshdoas haosdhaoshd ",
      time: "",
      avatar: "D",
      unread: true,
    },
    {
      name: "James Drew",
      text: "Hey Adam! Interested in tex...",
      time: "",
      avatar: "J",
      unread: false,
    },
    {
      name: "Alexa",
      text: "Hey Adam! Is Load more...",
      time: "30m",
      avatar: "A",
      unread: false,
    },
  ];

  // Chart data for applications per week
  const weeklyData = [
    { day: "Mon", value: 5 },
    { day: "Tue", value: 9 },
    { day: "Wed", value: 5 },
    { day: "Thu", value: 12 },
    { day: "Fri", value: 6 },
    { day: "Sat", value: 7 },
    { day: "Sun", value: 6 },
  ];

  const items: MenuProps["items"] = [
    {
      label: (
        <a
          href="https://www.antgroup.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          1st menu item
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          href="https://www.aliyun.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          2nd menu item
        </a>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  return (
    <div className="p-6  bg-gray-100  min-h-screen">
      {/* First Row */}
      <Row gutter={[16, 16]}>
        {/* (1,1) nested 2x2 grid */}
        <Col span={11}>
          <Row gutter={[16, 16]}>
            <StatsCard
              icon={<ContainerFilled style={{ color: "white" }} />}
              title="Jobs Posted"
              number={142}
              badgeText="45%+ in last 30 days"
              badgeColor="green"
            />
            <StatsCard
              icon={<ContainerFilled style={{ color: "white" }} />}
              title="Jobs Posted"
              number={142}
              badgeText="45%+ in last 30 days"
              badgeColor="green"
            />
            <StatsCard />
            <StatsCard
              icon={<StarFilled className="!text-white" />}
              title="Jobs Posted"
              number={142}
              badgeText="45%+ in last 30 days"
              badgeColor="orange"
            />
          </Row>
        </Col>

        {/* (1,2) applications chart */}
        <Col span={13}>
          <Row className=" w-full" gutter={[16, 16]}>
            <Col span={12}>
              <div className="h-full bg-white hover-gray-50  rounded-lg">
                <div className="flex gap-2 font-bold text-md px-4 items-center py-4 ">
                  <TopIconAndNavigation
                    icon={
                      <MessageFilled
                        size={36}
                        style={{ color: "white" }}
                        //   onMouseEnter={() => setLaoding(true)}
                        //   onMouseLeave={() => setLaoding(false)}
                        //   spin={laoding}
                      />
                    }
                    title="Messages"
                    arrow={{ shown: false }}
                  />
                </div>

                <List
                  itemLayout="horizontal"
                  dataSource={messages}
                  className="cursor-pointer !pb-9 "
                  renderItem={(item) => (
                    <List.Item
                      className="hover:bg-gray-50 hover:w-full !px-4 rounded"
                      actions={[
                        <div className="flex items-center gap-2">
                          {!item.time ? (
                            <div className="bg-[#FF4D4F] w-5 h-5 flex justify-center items-center rounded-full text-white text-xs">
                              5
                            </div>
                          ) : (
                            <span className="text-xs text-[#202020]">
                              {item.time}
                            </span>
                          )}
                          <Dropdown menu={{ items }} trigger={["click"]}>
                            <MoreOutlined className="!text-[#202020] cursor-pointer" />
                          </Dropdown>
                        </div>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <Avatar size={34} className="bg-gray-300 text-sm">
                                {item.avatar}
                              </Avatar>
                              {item.unread && (
                                <div className="absolute -top-1 -right-1 w-3 h-3  rounded-full bg-red-600 border border-white"></div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium ">
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-500 line-clamp-1">
                                {item.text}
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div
                  className=" 
                  mt-5
                absolute bottom-0 right-1.5 
                flex justify-center w-[96%] py-3  bg-gradient-to-t from-gray-50 to-transparent rounded-b-lg"
                >
                  <UiButton className="!rounded-2xl" href={ROUTES.DASHBOARD}>
                    Load More
                  </UiButton>
                </div>
              </div>
            </Col>

            <Col span={12}>
              <Card
                title="Interviews schedule"
                extra={
                  <CalendarOutlined
                    className="text-blue-500"
                    style={{ fontSize: "16px" }}
                  />
                }
                className="h-full"
              >
                <p className="mb-3 font-medium text-sm text-gray-500">Today</p>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-sm">
                        Front-end developer
                      </p>
                      <p className="text-gray-500 text-xs">Devsine</p>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    className="bg-orange-500 border-orange-500 hover:bg-orange-600"
                  >
                    Join now
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Second Row */}
      <Row gutter={[16, 16]} className="mt-6">
        {/* (2,1) Active Jobs Table */}
        <Col span={11}>
          <Card
            title="Active Jobs"
            extra={
              <RiseOutlined
                className="text-gray-400"
                style={{ fontSize: "16px" }}
              />
            }
          >
            <Table
              dataSource={jobData}
              columns={jobColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={13}>
          <Row className=" w-full" gutter={[16, 16]}>
            <Col span={12}>
              <div className="bg-white p-4">
                <TopIconAndNavigation
                  icon={<ContainerFilled style={{ color: "white" }} />}
                  title="Jobs"
                />
                <JobPortalMapCard />
                <div>
                  <div className="flex justify-center items-start ">
                    <div className="flex items-center  justify-between w-full ">
                      {/* Total jobs */}
                      {jobsStats.map((data, index) => (
                        <div key={index} className="text-left">
                          <div className="text-gray-400 text-sm mb-2">
                            {data.title}
                          </div>
                          <div className="text-xl font-semibold text-gray-900 tracking-tight">
                            {data.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>{" "}
            </Col>

            <Col span={12}>
              <Card
                title="Interviews schedule"
                extra={
                  <CalendarOutlined
                    className="text-blue-500"
                    style={{ fontSize: "16px" }}
                  />
                }
                className="h-full"
              >
                <p className="mb-3 font-medium text-sm text-gray-500">Today</p>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-sm">
                        Front-end developer
                      </p>
                      <p className="text-gray-500 text-xs">Devsine</p>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    className="bg-orange-500 border-orange-500 hover:bg-orange-600"
                  >
                    Join now
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        {/*  */}
        {/* (2,2) Messages + Interview Schedule */}
      </Row>
    </div>
  );
}

const jobsStats = [
  { title: "Total jobs", value: 85357 },
  { title: "New Jobs", value: 240 },
  { title: "Recommended", value: 12450 },
];
export const TopIconAndNavigation = ({
  icon,
  title,
  arrow = {
    shown: true,
    href: "",
  },
  bgColorIcon = "#1890FF",
}: {
  icon: React.ReactNode;
  title?: string;
  arrow?: {
    shown?: boolean;
    href?: string;
  };
  bgColorIcon?: string;
}) => {
  return (
    <div className="flex items-center justify-between w-full mb-2">
      <div className="flex gap-3 items-center">
        <div
          className="w-8 h-8 flex justify-center items-center rounded-full"
          style={{ backgroundColor: bgColorIcon }}
        >
          {icon}
        </div>
        <div className="text-black font-semibold">{title}</div>
      </div>

      {arrow.shown && (
        <UiButton
          href={arrow.href}
          className="group !w-8 !h-8 !rounded-full flex items-center justify-center bg-white border border-gray-300 transition-all duration-300 hover:!bg-blue-500"
        >
          <ArrowUpOutlined className="text-gray-600 transform rotate-45 transition-all duration-300 ease-in-out group-hover:!text-white group-hover:rotate-90" />
        </UiButton>
      )}
    </div>
  );
};
