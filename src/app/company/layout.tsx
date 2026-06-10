"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, ConfigProvider, Button, theme as antdTheme } from "antd";
import axios from "axios";
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
  BulbOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getToken, removeToken } from "@/utils/token";
import { setProfile } from "@/redux/slices/userSlice";
import { getCompanyProfileApi } from "../api/company/profile.api";
import { RootState } from "@/redux/store";
import { CompanyResponse } from "@/constants/Interfaces/Types/Profile.interface";
import { setThemeMode } from "@/redux/slices/themeSlice";

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
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth");
      return;
    }
    if (profile) return;
    getCompanyProfileApi()
      .then((res) => {
        if (!res || !res.data) {
          router.replace("/auth");
          return;
        };
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
        console.log("error aa gya")
        console.log("Error fetching profile:", err);
        const errorMessage = axios.isAxiosError(err)
          ? (err.response?.data as { message?: string } | undefined)?.message || err.message
          : err instanceof Error
            ? err.message
            : "";

        if (errorMessage.toLowerCase().includes("not authorized to access this resource")) {
          router.replace("/auth");
          return;
        }

        router.push("/auth");
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

  const isDark = themeMode === "dark";
  const uiColors = useMemo(
    () => ({
      sidebarBg: isDark ? "#0f172a" : "#fff",
      headerBg: isDark ? "#111827" : "#fff",
      contentBg: isDark ? "#0b1220" : "#f9f9f9",
      textColor: isDark ? "#e5e7eb" : "#111827",
      borderColor: isDark ? "#1f2937" : "#f0f0f0",
      shadow: isDark ? "2px 0 8px rgba(0,0,0,0.45)" : "2px 0 8px rgba(0,0,0,0.1)",
      menuItemColor: isDark ? "#e5e7eb" : "black",
      menuItemBg: isDark ? "#0f172a" : "#fff",
      menuHoverBg: isDark ? "#111827" : "#fff",
      menuHoverColor: isDark ? "#93c5fd" : "#114046",
      menuSelectedBg: isDark ? "#1d4ed8" : "#2869eb",
      menuSelectedColor: "white",
    }),
    [isDark]
  );

  return (
    profile && (
      <ConfigProvider
        theme={{
          algorithm: isDark
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
          components: {
            Menu: {
              fontSize: 16,
              itemColor: uiColors.menuItemColor,
              itemBg: uiColors.menuItemBg,
              itemHoverBg: uiColors.menuHoverBg,
              itemHoverColor: uiColors.menuHoverColor,
              itemSelectedBg: uiColors.menuSelectedBg,
              itemSelectedColor: uiColors.menuSelectedColor,
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
              background: uiColors.sidebarBg,
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: 999,
              transform:
                isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
              transition: "transform 0.3s ease, width 0.3s ease",
              boxShadow: uiColors.shadow,
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
                borderBottom: `1px solid ${uiColors.borderColor}`,
                color: uiColors.textColor,
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

            <div className="p-4 bottom-0 absolute w-full">
              <Button
                type="default"
                icon={isDark ? <BulbOutlined /> : <MoonOutlined />}
                onClick={() =>
                  dispatch(setThemeMode(isDark ? "light" : "dark"))
                }
                className={`w-full font-bold text-left ${collapsed && !isMobile
                  ? "flex justify-center"
                  : ""
                  }`}
                style={{
                  marginBottom: 8,
                }}
              >
                {(!collapsed || isMobile) &&
                  (isDark ? "Light Mode" : "Dark Mode")}
              </Button>
              <Button
                type="default"
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
                background: uiColors.headerBg,
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
                boxShadow: isDark
                  ? "0 1px 4px rgba(0,0,0,0.35)"
                  : "0 1px 4px rgba(0,0,0,0.1)",
                transition: "left 0.3s ease",
              }}
            >
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{ cursor: "pointer", fontSize: 20, color: uiColors.textColor }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: uiColors.textColor,
                }}
              >
                Company Dashboard
              </h1>
              <div style={{ width: 24 }}>{/* Spacer for centering */}</div>
            </Header>

            {/* Scrollable Content Area */}
            <Content
              style={{
                marginTop: 64,
                padding: "24px",
                background: uiColors.contentBg,
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