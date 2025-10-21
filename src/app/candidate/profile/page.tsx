"use client";

import React from "react";
import {
  Avatar,
  Card,
  Tag,
  Typography,
  Divider,
  Button,
  Space,
  List,
  Row,
  Col,
  Timeline,
} from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  GithubFilled,
  LinkedinFilled,
  PaperClipOutlined,
} from "@ant-design/icons";
import IconWrapper from "@/icons/IconWrapper";
import { signUpApi } from "@/app/api/auth.api";
import UiButton from "@/component/common/CustomButton";

const { Title, Text, Paragraph } = Typography;

const skills = [
  "Front-end developer",
  "Backend",
  "Node.js",
  "Threads",
  "Mobile App Development",
];

const experiences = [
  {
    title: "Product Engineer",
    company: "Google Labs",
    date: "Mar 2023 – Aug 2023",
    description:
      "Designed and developed a fully responsive web application using React.js for the front end and Node.js/Express.js for the back end. Integrated REST APIs and implemented MongoDB for data management. Focused on optimizing performance and delivering a smooth user experience.",
  },
  {
    title: "Product Engineer",
    company: "Google Labs",
    date: "Mar 2023 – Aug 2023",
    description:
      "Designed and developed a fully responsive web application using React.js for the front end and Node.js/Express.js for the back end. Integrated REST APIs and implemented MongoDB for data management. Focused on optimizing performance and delivering a smooth user experience.",
  },
];

export default function ProfileDashboard() {
  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <Row gutter={[24, 24]}>
        {/* Left Sidebar */}
        <Col xs={24} md={8} lg={9}>
          <Card className="rounded-xl">
            <Space
              direction="vertical"
              // align="center"
              style={{ width: "100%" }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar
                    size={72}
                    src="https://api.dicebear.com/8.x/avataaars/svg?seed=anderson"
                  />
                  <div>
                    <Title level={4} style={{ marginBottom: 0 }}>
                      Anderson James
                    </Title>
                    <Text type="secondary">Full-stack developer</Text>
                  </div>
                </div>

                <IconWrapper icon={<EditOutlined />} bgColorIcon="deafualt" />
              </div>
              <Divider className=" !my-3" />
              <div className="flex justify-between items-center">
                <Text strong>Joined</Text>
                <Text>August 22, 2025</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text strong>Location</Text>
                <Text>Lahore, Pakistan</Text>
              </div>
              <div className="flex justify-between items-center ">
                <Text strong className="!w-[35%]">
                  Skills
                </Text>
                <Space wrap className="!flex justify-end ">
                  <Tag className="rounded-full">Front-end developer</Tag>
                  <Tag className="rounded-full">Backend</Tag>
                  <Tag className="rounded-full">Node.js</Tag>
                  <Tag className="rounded-full"> Mobile App Development</Tag>

                  <Tag className="rounded-full">ThreeJS</Tag>
                </Space>
              </div>

              <Divider className=" !my-3" />

              <Text strong>Bio</Text>
              <Paragraph>
                A passionate Full Stack Developer skilled in building scalable,
                user-friendly web applications from front-end design to back-end
                architecture. Proficient in JavaScript, React, Node.js, and
                SQL/NoSQL databases.
              </Paragraph>

              <Divider className=" !my-3" />

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <Text strong>Links</Text>
                  <IconWrapper icon={<PlusOutlined />} bgColorIcon="default" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    {/* <IconWrapper icon={} bgColorIcon="default" /> */}
                    <GithubFilled size={44} className="text-3xl" />
                    <Text strong>GitHub</Text>
                  </div>
                  <Text>Since 2023</Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    {/* <IconWrapper icon={} bgColorIcon="default" /> */}
                    <LinkedinFilled className="text-3xl" />
                    <Text strong>Linkdin</Text>
                  </div>
                  <Text>Since 2022</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Main Section */}
        <Col xs={24} md={15} lg={15}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* Resume Uploaded */}
            <Card className="rounded-xl">
              <UiButton
                onClick={() => {
                  signUpApi({
                    email: "ib6457345@gmail.com",
                    password: "newPassword123",
                    role: "candidate",
                  })
                    .then((res) => {
                      console.log("Signup Response:", res); // ✅ now works
                    })
                    .catch((err) => {
                      console.error("Signup failed:", err);
                    });
                }}
              >
                PRESSSSSSS
              </UiButton>
              <div className="flex justify-between items-center">
                <div className="">
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      Resume Uploaded Successfully
                    </Title>
                  </div>
                  <Text type="secondary">
                    Your resume has been received and is ready for review.
                  </Text>
                  <div className="!mt-4 gap-2 flex">
                    <PaperClipOutlined />
                    <Text className="!text-[#52C41A]">AlexJamesResume.pdf</Text>
                  </div>
                </div>
                <IconWrapper icon={<EditOutlined />} bgColorIcon="deafualt" />
              </div>
            </Card>
            {/* Experience Section */}
            {/* Experience Section */}

            <Card
              title={<Title level={5}>Experience</Title>}
              className="rounded-xl shadow-md"
            >
              <Timeline
                mode="left"
                // className="[&_.ant-timeline-item-tail]:!border-gray-300 [&_.ant-timeline-item-head]:!bg-gray-500"
              >
                {experiences.map((item, index) => (
                  <Timeline.Item key={index}>
                    <div className="mb-6" color="gray">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text strong className="text-lg">
                            {item.title} — {item.company}
                          </Text>
                          <div>
                            <Text type="secondary">{item.date}</Text>
                          </div>
                        </div>
                      </div>

                      <Paragraph className="mt-2 mb-3">
                        {item.description}
                      </Paragraph>

                      <Space wrap>
                        {skills.slice(0, 5).map((skill, i) => (
                          <Tag
                            key={i}
                            color="blue"
                            className="rounded-full text-sm font-medium"
                          >
                            {skill}
                          </Tag>
                        ))}
                        {skills.length > 5 && (
                          <Tag className="rounded-full text-sm font-medium">
                            +{skills.length - 5}
                          </Tag>
                        )}
                      </Space>

                      {index !== experiences.length - 1 && (
                        <Divider className="!my-4 border-gray-200" />
                      )}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>

              <div className="text-center mt-4">
                <Button type="default">Load More</Button>
              </div>
            </Card>
            {/* Certifications */}
            <Card
              title={<Title level={5}>Certifications</Title>}
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Paragraph>
                <Text strong>Product Engineer</Text> — Google Labs (Mar 2023 –
                Aug 2023)
              </Paragraph>
              <Paragraph>
                Designed and developed a fully responsive web application using
                React.js and Node.js/Express.js for backend.
              </Paragraph>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
