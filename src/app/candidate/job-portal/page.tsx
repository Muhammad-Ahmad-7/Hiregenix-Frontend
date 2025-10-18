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
} from "@ant-design/icons";
import { LabelInput, LabelSelect } from "@/component/common";
import Search from "antd/es/input/Search";
import UiButton from "@/component/common/CustomButton";
import { TopIconAndNavigation } from "../dashboard/page";

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

The role involves conducting user research, creating wireframes, prototyping, and delivering high-fidelity UI designs that bring concepts to life. You’ll also be responsible for continuously iterating designs based on user feedback and performance metrics to improve overall product efficiency.

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
    id: 5,
    title: "Defi Developer",
    company: "Devsinc",
    logo: "https://cdn.worldvectorlogo.com/logos/devsinc.svg",
  },
];

export default function JobDashboard() {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Row gutter={[16, 16]}>
        {/* Sidebar */}
        <Col xs={24} md={12} lg={12} className=" bg-amber-400 ">
          <div className="h-full  rounded-2xl">
            <div className="flex justify-between">
              <Col span={19}>
                <Search
                  placeholder="input search text"
                  allowClear
                  onSearch={() => {}}
                />
              </Col>
              <Col span={5}>
                {" "}
                <LabelSelect
                  name="country"
                  placeholder="Country"
                  options={[
                    { label: "USA", value: "us" },
                    { label: "UK", value: "uk" },
                  ]}
                />
              </Col>
            </div>
            <div className="flex gap-3 px-2 my-2 justify-between ">
              <LabelSelect
                name="remote"
                placeholder="Remote"
                options={[
                  { label: "USA", value: "us" },
                  { label: "UK", value: "uk" },
                ]}
              />{" "}
              <LabelSelect
                name="experience"
                placeholder="Experience"
                options={[
                  { label: "USA", value: "us" },
                  { label: "UK", value: "uk" },
                ]}
              />{" "}
              <LabelSelect
                name="datePosted"
                placeholder="Date Posted"
                options={[
                  { label: "USA", value: "us" },
                  { label: "UK", value: "uk" },
                ]}
              />{" "}
              <UiButton name="saved" title="Saved" className="!text-gray-400">
                Saved
              </UiButton>
              <UiButton
                name="recommended"
                title="Recommended"
                className="!text-gray-400"
              >
                Recommended
              </UiButton>{" "}
            </div>

            <List
              itemLayout="horizontal"
              dataSource={jobs}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer rounded-xl  hover:bg-gray-100 transition ${
                    selectedJob.id === item.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedJob(item)}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} size={50} />}
                    title={
                      <span className="text-blue-600 font-semibold">
                        {item.title}
                      </span>
                    }
                    description={
                      <span className="text-gray-500">{item.company}</span>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>

        {/* Job Details */}
        <Col xs={24} md={12} lg={12}>
          <Card className="shadow-md rounded-2xl">
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
            <div className="">
              <span className="bg-amber-800 text-lg text-gray-400">
                Job Title
              </span>
              <Title className="!text-3xl !m-0 bg-red-400">
                Front End Developer
              </Title>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              <Tag icon={<CalendarOutlined />} color="blue">
                Posted: {selectedJob.posted}
              </Tag>
              <Tag icon={<LaptopOutlined />} color="purple">
                Mode: {selectedJob.mode}
              </Tag>
              <Tag icon={<ClockCircleOutlined />} color="orange">
                Deadline: {selectedJob.deadline}
              </Tag>
              <Tag icon={<EnvironmentOutlined />} color="green">
                Location: {selectedJob.location}
              </Tag>
              <Tag color="cyan">Type: {selectedJob.type}</Tag>
              <Tag color="gold">Interview: {selectedJob.interviewDeadline}</Tag>
            </div>

            <div className="mt-6">
              <Title level={5}>Job Description</Title>
              <Paragraph className="text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedJob.description || "Job description not available."}
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
