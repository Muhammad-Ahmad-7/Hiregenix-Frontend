"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, ConfigProvider, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  MailOutlined,
  CloseOutlined,
  BarsOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "@/utils/token";
import { setProfile } from "@/redux/slices/userSlice";
import { getCompanyProfileApi } from "../api/company/profile.api";
import { RootState } from "@/redux/store";
import { CompanyResponse } from "@/constants/Interfaces/Types/Profile.interface";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: "/company/dashboard",
    icon: <BarsOutlined />,
    label: <Link href="/company/dashboard">Insights</Link>,
  },
  {
    key: "/company/profile",
    icon: <UserOutlined />,
    label: <Link href="/company/profile">Profile</Link>,
  },
  {
    key: "/company/create-job",
    icon: <FileTextOutlined />,
    label: <Link href="/company/create-job">Job Portal</Link>,
  },
  {
    key: "/company/chat",
    icon: <MessageOutlined />,
    label: <Link href="/company/chat">Chat</Link>,
  },
  {
    key: "/company/job-analytics",
    icon: <MailOutlined />,
    label: <Link href="/company/job-analytics">Job Analytics</Link>,
  },
  {
    key: "/company/job-applications",
    icon: <FileTextOutlined />,
    label: <Link href="/company/job-applications">Jobs Applications</Link>,
  },
  // {
  //   key: "/company/hire",
  //   icon: <MailOutlined />,
  //   label: <Link href="/company/hire">Hire</Link>,
  // },
];

type DashboardLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { profile } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) return;
    getCompanyProfileApi()
      .then((res) => {
        if (!res || !res.data) return;
        if (res.status === "Success") {
          console.log("Dispatch", res.data.company);
          if (!res || !res.data || !res.data.company) return;
          const valuesWithUserType: CompanyResponse & {
            userType: "company";
          } = {
            ...res.data.company,
            userType: "company",
          };
          dispatch(setProfile(valuesWithUserType));
        }
      })
      .catch((err) => {
        console.log("Error fetching profile:", err);
        router.push("/auth/sign-up");
      })
      .finally(() => { });
  }, [profile, dispatch, router]);

  // Detect screen size and auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const basePath = React.useMemo(() => {
    if (!pathname) return "";
    const parts = pathname.split("/").filter(Boolean);
    return parts.length >= 3
      ? `/${parts[0]}/${parts[1]}/${parts[2]}`
      : pathname;
  }, [pathname]);

  return (
    profile && (
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              fontSize: 16,
              itemColor: "black",
              itemBg: "#fff",
              itemHoverBg: "#fff",
              itemHoverColor: "#114046",
              itemSelectedBg: "#2869eb",
              itemSelectedColor: "white",
            },
          },
        }}
      >
        <Layout style={{ minHeight: "100vh" }}>
          {/* Overlay for mobile when sidebar is open */}
          {isMobile && !collapsed && (
            <div
              onClick={() => setCollapsed(true)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 998,
              }}
            />
          )}

          {/* Fixed Sidebar */}
          <Sider
            width={256}
            collapsed={collapsed}
            collapsedWidth={isMobile ? 0 : 80}
            trigger={null}
            style={{
              background: "#fff",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: 999,
              transform:
                isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
              transition: "transform 0.3s ease, width 0.3s ease",
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                fontWeight: "bold",
                fontSize: 18,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {collapsed && !isMobile ? "CD" : "Company Dashboard"}

              {isMobile && !collapsed && (
                <CloseOutlined
                  onClick={() => setCollapsed(true)}
                  style={{ cursor: "pointer", fontSize: 18 }}
                />
              )}
            </div>

            <Menu
              mode="inline"
              items={items}
              selectedKeys={[basePath]}
              style={{ borderRight: 0 }}
              onClick={() => {
                if (isMobile) setCollapsed(true);
              }}
            />

            <div className="p-4 text-white bottom-0 absolute w-full">
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={() => {
                  removeToken();
                  router.replace("/auth");
                }}
                className={`w-full font-bold text-left ${collapsed && !isMobile
                  ? "flex justify-center bg-red-600 hover:bg-red-700"
                  : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
              >
                {(!collapsed || isMobile) && "Logout"}
              </Button>
            </div>
          </Sider>

          {/* Fixed Header and Scrollable Content */}
          <Layout
            style={{
              marginLeft: isMobile ? 0 : collapsed ? 80 : 256,
              transition: "margin-left 0.3s ease",
            }}
          >
            <Header
              style={{
                background: "#fff",
                height: 64,
                padding: "0 16px",
                position: "fixed",
                top: 0,
                left: isMobile ? 0 : collapsed ? 80 : 256,
                right: 0,
                zIndex: 997,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                transition: "left 0.3s ease",
              }}
            >
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{ cursor: "pointer", fontSize: 20 }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
              <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                Company Dashboard
              </h1>
              <div style={{ width: 24 }}>{/* Spacer for centering */}</div>
            </Header>

            {/* Scrollable Content Area */}
            <Content
              style={{
                marginTop: 64,
                padding: "16px",
                background: "#f9f9f9",
                minHeight: "calc(100vh - 64px)",
                overflowY: "auto",
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    )
  );
};

export default AdminLayout;