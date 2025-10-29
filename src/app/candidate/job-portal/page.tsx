"use client";
import React, { useState } from "react";
import {
  Card,
  List,
  Avatar,
  Button,
  Tag,
  Typography,
  Row,
  Col,
  Image,
  Dropdown,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  EllipsisOutlined,
  NotificationFilled,
  BuildFilled,
  CalendarFilled,
} from "@ant-design/icons";
import { LabelInput, LabelSelect } from "@/component/common";
import Search from "antd/es/input/Search";
import UiButton from "@/component/common/CustomButton";
import { TopIconAndNavigation } from "../dashboard/page";
import IconWrapper from "@/icons/IconWrapper";

const { Title, Paragraph } = Typography;

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

const jobs = [
  {
    id: 1,
    title: "Front-end developer",
    company: "International Business Machines (IBM)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    posted: "August 22, 2025",
    mode: "Onsite",
    deadline: "August 30, 2025",
    location: "Pakistan",
    type: "Full-time",
    interviewDeadline: "September 5, 2025",
    description: `In this role, you will be responsible for designing user-friendly digital experiences that balance functionality, aesthetics, and business needs.

The role involves conducting user research, creating wireframes,  user research, creating wireframes user research, creating wireframes prototyping, and delivering high-fidelity UI designs that bring concepts to life. You'll also be responsible for continuously iterating designs based on user feedback and performance metrics to improve overall product efficiency.

We are looking for a designer who not only has strong visual design skills but also understands interaction design, information architecture, and the emotional aspects of user experience. The ideal candidate can simplify complex workflows into intuitive solutions that drive user engagement and trust.`,
  },
  {
    id: 2,
    title: "Kotlin developer",
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
  },
  {
    id: 3,
    title: "Swift Developer",
    company: "Apple.Inc",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: 4,
    title: "Backend Manager Nodejs",
    company: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    id: 4,
    title: "Backend Manager Nodejs",
    company: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    id: 4,
    title: "Backend Manager Nodejs",
    company: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    id: 4,
    title: "Backend Manager Nodejs",
    company: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    id: 4,
    title: "Backend Manager Nodejs",
    company: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    id: 4,
    title: "Backend Manager Nodejs",
    company: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    id: 4,
    title: "Backend Manager Nodejs",
    company: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    id: 5,
    title: "Defi Developer",
    company: "Devsinc",
    logo: "https://cdn.worldvectorlogo.com/logos/devsinc.svg",
  },
];

export default function JobDashboard() {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  return (
    <div
      className=" bg-gray-50"
      style={{
        height: "calc(100vh - 100px)",
        overflow: "hidden",
        padding: "16px",
      }}
    >
      <Row
        gutter={[16, 16]}
        className="flex gap-10"
        style={{ height: "100%", margin: 0 }}
      >
        {/* Sidebar */}
        <Col xs={24} sm={24} md={24} lg={11} style={{ height: "100%" }}>
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div
              className="h-full bg-white rounded-2xl"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div className="p-4" style={{ flexShrink: 0 }}>
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={24} md={18} lg={18}>
                    <Search
                      className="!m-0 !p-0 "
                      placeholder="input search text"
                      allowClear
                      onSearch={() => {}}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={6} lg={5}>
                    <LabelSelect
                      name="country"
                      placeholder="Country"
                      options={[
                        { label: "USA", value: "us" },
                        { label: "UK", value: "uk" },
                      ]}
                    />
                  </Col>
                </Row>
                <Row gutter={[8, 8]} className="my-2">
                  <Col xs={8} sm={8} md={8} lg={8}>
                    <LabelSelect
                      name="remote"
                      placeholder="Remote"
                      options={[
                        { label: "USA", value: "us" },
                        { label: "UK", value: "uk" },
                      ]}
                    />
                  </Col>
                  <Col xs={8} sm={8} md={8} lg={8}>
                    <LabelSelect
                      name="experience"
                      placeholder="Experience"
                      options={[
                        { label: "USA", value: "us" },
                        { label: "UK", value: "uk" },
                      ]}
                    />
                  </Col>
                  <Col xs={8} sm={8} md={8} lg={8}>
                    <LabelSelect
                      name="datePosted"
                      placeholder="Date Posted"
                      options={[
                        { label: "USA", value: "us" },
                        { label: "UK", value: "uk" },
                      ]}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <UiButton
                      name="saved"
                      title="Saved"
                      className="!text-gray-400 w-full"
                    >
                      Saved
                    </UiButton>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <UiButton
                      name="recommended"
                      title="Recommended"
                      className="!text-gray-400 w-full"
                    >
                      Recommended
                    </UiButton>
                  </Col>
                </Row>
              </div>
              <div style={{ flex: 1, overflow: "auto" }}>
                <List
                  itemLayout="horizontal"
                  dataSource={jobs}
                  renderItem={(item) => (
                    <List.Item
                      className={`cursor-pointer   hover:bg-gray-100 transition ${
                        selectedJob.id === item.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedJob(item)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="px-4">
                            <Avatar src={item.logo} size={50} />{" "}
                            <span className="text-blue-600 font-semibold">
                              {item.title}
                            </span>{" "}
                            <span className="text-gray-500">
                              {item.company}
                            </span>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
        </Col>
        {/* Job Details */}
        <Col xs={24} sm={24} md={24} lg={12} style={{ height: "100%" }}>
          <Card
            className="shadow-md rounded-2xl"
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            bodyStyle={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ flexShrink: 0, padding: "24px" }}>
              <div className="text-2xl flex justify-center items-center">
                <TopIconAndNavigation
                  icon={<Image src="./image.png" />}
                  title="Internation Business Machine"
                  arrow={{ shown: false }}
                />
                <div className="flex gap-4 items-center">
                  <UiButton type="primary" className="!rounded-full">
                    Apply Now
                  </UiButton>
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <span onClick={(e) => e.preventDefault()}>
                      <UiButton className="!rounded-full w-8 h-8">
                        <EllipsisOutlined />
                      </UiButton>
                    </span>
                  </Dropdown>
                </div>
              </div>
              <Divider />
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "0 24px 24px" }}>
              <div className="">
                <span className=" text-lg text-gray-400">Job Title</span>
                <Title className="!text-3xl !m-0 ">Front End Developer</Title>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4  mt-6">
                <div className="my-4    items-center  flex">
                  {" "}
                  <IconWrapper
                    icon={
                      <BuildFilled
                        color="primary-6"
                        className="!text-[#1890FF]"
                      />
                    }
                    bgColorIcon="white"
                  />
                  <div className="ml-4">
                    <div className=" text-sm text-gray-400">Posted</div>
                    <div className="!text-lg font-semibold !m-0 ">
                      30 - Dec - 2025
                    </div>
                  </div>
                </div>
                <div className="my-4    items-center  flex">
                  {" "}
                  <IconWrapper
                    icon={
                      <NotificationFilled
                        color="primary-6"
                        className="!text-[#1890FF]"
                      />
                    }
                    bgColorIcon="white"
                  />
                  <div className="ml-4">
                    <div className=" text-sm text-gray-400">Posted</div>
                    <div className="!text-lg font-semibold !m-0 ">
                      30 - Dec - 2025
                    </div>
                  </div>
                </div>
                <div className="my-4    items-center  flex">
                  {" "}
                  <IconWrapper
                    icon={
                      <CalendarFilled
                        color="primary-6"
                        className="!text-[#1890FF]"
                      />
                    }
                    bgColorIcon="white"
                  />
                  <div className="ml-4">
                    <div className=" text-sm text-gray-400">Posted</div>
                    <div className="!text-lg font-semibold !m-0 ">
                      30 - Dec - 2025
                    </div>
                  </div>
                </div>
                <div className="my-4    items-center  flex">
                  {" "}
                  <IconWrapper
                    icon={
                      <NotificationFilled
                        color="primary-6"
                        className="!text-[#1890FF]"
                      />
                    }
                    bgColorIcon="white"
                  />
                  <div className="ml-4">
                    <div className=" text-sm text-gray-400">Posted</div>
                    <div className="!text-lg font-semibold !m-0 ">
                      30 - Dec - 2025
                    </div>
                  </div>
                </div>{" "}
                <div className="my-4    items-center  flex">
                  {" "}
                  <IconWrapper
                    icon={
                      <NotificationFilled
                        color="primary-6"
                        className="!text-[#1890FF]"
                      />
                    }
                    bgColorIcon="white"
                  />
                  <div className="ml-4">
                    <div className=" text-sm text-gray-400">Posted</div>
                    <div className="!text-lg font-semibold !m-0 ">
                      30 - Dec - 2025
                    </div>
                  </div>
                </div>{" "}
                <div className="my-4    items-center  flex">
                  {" "}
                  <IconWrapper
                    icon={
                      <NotificationFilled
                        color="primary-6"
                        className="!text-[#1890FF]"
                      />
                    }
                    bgColorIcon="white"
                  />
                  <div className="ml-4">
                    <div className=" text-sm text-gray-400">Posted</div>
                    <div className="!text-lg font-semibold !m-0 ">
                      30 - Dec - 2025
                    </div>
                  </div>
                </div>{" "}
              </div>

              <div className="mt-6">
                <Title level={5}>Job Description</Title>
                <Paragraph className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedJob.description || "Job description not available."}
                </Paragraph>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
