"use client";
import {
  Card,
  Table,
  List,
  Avatar,
  Button,
  Menu,
  Row,
  Col,
  Select,
} from "antd";
import {
  MessageOutlined,
  CalendarOutlined,
  RiseOutlined,
  ContainerFilled,
  StarFilled,
} from "@ant-design/icons";
import StatsCard from "@/component/pages/dashboard/StatsCard";

const { Option } = Select;

export default function Dashboard() {
  // Table Data
  const jobData = [
    {
      key: 1,
      title: "Front-end developer",
      applications: 127,
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
      text: "Hey Adam! Interested in tex...",
      time: "10m",
      avatar: "D",
      unread: true,
    },
    {
      name: "James Drew",
      text: "Hey Adam! Interested in tex...",
      time: "30m",
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

  const menu = (
    <Menu>
      <Menu.Item key="1">Reply</Menu.Item>
      <Menu.Item key="2">Mark as read</Menu.Item>
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  );

  return (
    <div className=" bg-gray-50 min-h-screen">
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
      <Row gutter={[8, 8]} className="sm:gutter-[16] md:gutter-[16]">
        {/* (1,1) nested 2x2 grid */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Row gutter={[8, 8]} className="sm:gutter-[16] md:gutter-[16]">
            <StatsCard
              icon={<ContainerFilled style={{ color: "white" }} />}
              title="Jobs Posted"
              number={142}
              badgeText="45%+ in last 30 days"
              badgeColor="green"
            />
            <StatsCard
              icon={<StarFilled className="!text-white" />}
              title="Jobs Posted"
              number={142}
              badgeText="45%+ in last 30 days"
              badgeColor="orange"
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
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card
            title="Applications received per week"
            className="h-full"
            extra={
              <span className="text-xs sm:text-sm text-gray-400">
                September 29 - October 6
              </span>
            }
          >
            <div className="flex items-end justify-between h-40 px-2 sm:px-4 mt-4 gap-1 sm:gap-2">
              {weeklyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-400 mb-1">{item.value}</div>
                  <div
                    className="bg-blue-500 rounded-t w-full max-w-6 flex items-end justify-center"
                    style={{ height: `${(item.value / 12) * 100}px` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2">{item.day}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Second Row */}
      <Row
        gutter={[8, 8]}
        className="mt-4 sm:mt-6 sm:gutter-[16] md:gutter-[16]"
      >
        {/* (2,1) Active Jobs Table */}
        <Col xs={24} sm={24} md={12} lg={12}>
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
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        {/* (2,2) Messages + Interview Schedule */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Row gutter={[8, 8]} className="sm:gutter-[16] md:gutter-[16]">
            <Col xs={24} sm={24} md={12} lg={12}>
              <Card
                title="Messages"
                extra={
                  <MessageOutlined
                    className="text-blue-500"
                    style={{ fontSize: "16px" }}
                  />
                }
                className="h-full"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={messages}
                  renderItem={(item) => (
                    <List.Item
                      className="hover:bg-gray-50 px-2 rounded"
                      actions={
                        [
                          // <div className="flex items-center gap-2">
                          //   {item.time && (
                          //     <span className="text-xs text-gray-400">
                          //       {item.time}
                          //     </span>
                          //   )}
                          //   <Dropdown overlay={menu} trigger={["click"]}>
                          //     <MoreOutlined className="text-gray-400 cursor-pointer" />
                          //   </Dropdown>
                          // </div>,
                        ]
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="relative">
                            <Avatar size={28} className="bg-gray-300 text-sm">
                              {item.avatar}
                            </Avatar>
                            {item.unread && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                            )}
                          </div>
                        }
                        title={
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        }
                        description={
                          <span className="text-xs text-gray-500">
                            {item.text}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
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
                    className="bg-orange-500 border-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                  >
                    Join now
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
