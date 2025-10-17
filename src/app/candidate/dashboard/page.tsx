"use client";

import React, { useState } from "react";
import {
  Card,
  Table,
  List,
  Avatar,
  Button,
  Dropdown,
  Menu,
  Row,
  Col,
  Select,
  Badge,
} from "antd";
import {
  BankOutlined,
  TeamOutlined,
  StarOutlined,
  MessageOutlined,
  CalendarOutlined,
  MoreOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ProfileOutlined,
  ProfileFilled,
  ContainerFilled,
  StarFilled,
  MessageFilled,
} from "@ant-design/icons";
import ArrowRightUp from "@/icons/ArrowRightUp";
import StatsCard from "@/component/pages/dashboard/StatsCard";
import Star from "@/icons/Star";
import { Color } from "antd/es/color-picker";
import DropdownButton from "antd/es/dropdown/dropdown-button";
import UiButton from "@/component/common/CustomButton";
import { ROUTES } from "@/constants/routes";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Select defaultValue="Front-end developer" className="w-48">
          <Option value="front-end">Front-end developer</Option>
          <Option value="backend">Backend developer</Option>
          <Option value="full-stack">Full-stack developer</Option>
        </Select>
      </div> */}

      {/* First Row */}
      <Row gutter={[16, 16]}>
        {/* (1,1) nested 2x2 grid */}
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <StatsCard
              icon={<ContainerFilled style={{ color: "white" }} />}
              title="Jobs Posted"
              number={142}
              badgeText="45%+ in last 30 days"
              badgeColor="green"
            />
            <Col span={12}>
              <Card className="h-32">
                <div className="flex items-center justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">W</span>
                      </div>
                      <span className="text-xs text-gray-600">Active jobs</span>
                    </div>
                    <div className="text-2xl font-bold">10</div>
                    <div className="text-xs text-green-500 flex items-center gap-1">
                      <ArrowUpOutlined style={{ fontSize: "10px" }} />
                      +10% in last 30 days
                    </div>
                  </div>
                  <RiseOutlined
                    className="text-gray-200"
                    style={{ fontSize: "20px" }}
                  />
                </div>
              </Card>
            </Col>
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
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="h-full bg-white hover-gray-50 px-4 rounded-lg">
                <div className="flex gap-2 font-bold text-md items-center py-4 ">
                  <div className="bg-blue-600 w-6 h-6 flex justify-center items-center rounded-full">
                    <MessageFilled style={{ color: "white" }} />
                  </div>
                  <div className="text-md">Messages</div>
                </div>
                <List
                  itemLayout="horizontal"
                  dataSource={messages}
                  className="cursor-pointer"
                  renderItem={(item) => (
                    <List.Item
                      className="hover:bg-gray-50 rounded"
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
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
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
                        // title={}
                        // description={}
                      />
                    </List.Item>
                  )}
                />
                <div
                  className=" 
                absolute bottom-0 right-1.5 
                flex justify-center w-[96%] py-3 pt-8 bg-gradient-to-t from-gray-200 to-transparent rounded-b-lg"
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
        <Col span={12}>
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

        {/* (2,2) Messages + Interview Schedule */}
      </Row>
    </div>
  );
}
