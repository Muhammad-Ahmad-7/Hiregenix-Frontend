"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, ConfigProvider, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ProjectOutlined,
  FileTextOutlined,
  MessageOutlined,
  MailOutlined,
  CloseOutlined,
  BarsOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getCandidateProfileApi } from "../api/candidate/profile.api";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUserProfile } from "@/redux/slices/userSlice";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/app/store/store";
// import { logout } from "@/app/store/slices/authSlice";
// import Cookies from "js-cookie";
// import { logoutUser } from "@/app/api/backend/auth";
// import { toast } from "react-hot-toast";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: "/candidate/dashboard",
    icon: <BarsOutlined />,
    label: <Link href="/candidate/dashboard">Insights</Link>,
  },
  {
    key: "/candidate/profile",
    icon: <UserOutlined />,
    label: <Link href="/candidate/profile">Profile</Link>,
  },
  {
    key: "/dashboard/admin/projects",
    icon: <ProjectOutlined />,
    label: <Link href="/dashboard/admin/projects">Projects</Link>,
  },
  {
    key: "/candidate/job-portal",
    icon: <FileTextOutlined />,
    label: <Link href="/candidate/job-portal">Job Portal</Link>,
  },
  {
    key: "/candidate/chat",
    icon: <MessageOutlined />,
    label: <Link href="/candidate/chat">Chat</Link>,
  },
  {
    key: "/candidate/job-analytics",
    icon: <MailOutlined />,
    label: <Link href="/candidate/job-analytics">Job Analytics</Link>,
  },
  {
    key: "/candidate/interview-section",
    icon: <MailOutlined />,
    label: <Link href="/candidate/interview-section">Interview Sections</Link>,
  },
  {
    key: "/dashboard/admin/setting",
    icon: <SettingOutlined />,
    label: <Link href="/dashboard/admin/setting">Settings</Link>,
  },
];

type DashboardLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state: RootState) => state.user);

  // const {profile,loading} useSelector(state=>state.user)
  //   const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    if (profile) return;
    getCandidateProfileApi()
      .then((res) => {
        if (res.status === "Success") {
          dispatch(setUserProfile(res.data.candidate));

          dispatch(setLoading(false));
        }
      })
      .catch((err) => {
        console.log("Error fetching profile:", err);
        router.push("/auth/sign-up");
      })
      .finally(() => {});
  }, []);

  //   const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  // 🔹 Protect route - Fixed logic
  //   useEffect(() => {
  //     // Don't do anything while still loading
  //     // if (loading) return;

  //     // Only redirect after loading is complete
  //     if (!isAuthenticated) {
  //       router.push("/dashboard");
  //       return;
  //     }

  //     // Check role only if user exists and is authenticated
  //     if (user && user.role !== "admin") {
  //       router.push("/dashboard/client");
  //       return;
  //     }
  //   }, [isAuthenticated, user, loading, router]);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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

  // Don't render anything if loading (global overlay will show)
  //   if (loading) {
  //     return null;
  //   }

  // Don't render anything if not authenticated or wrong role
  // This prevents flash of admin content before redirect
  //   if (!isAuthenticated || !user || user.role !== "admin") {
  //     return null;
  //   }

  //   const handleLogout = async () => {
  //     const res = await logoutUser();
  //     // Handle successful logout
  //     if (res.success) {
  //       // Clear redux auth state
  //       dispatch(logout());
  //       localStorage.removeItem("token");
  //       router.push("/dashboard");
  //     } else {
  //       toast.error("Logout failed. Please try again.");
  //     }
  //   };
  return (
    profile && (
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBorderRadius: 12,
              fontSize: 16,
              itemColor: "black",
              itemBg: "#fff",
              itemHoverBg: "#fff",
              itemHoverColor: "#114046",
              itemSelectedBg: "black",
              itemSelectedColor: "white",
            },
          },
        }}
      >
        <Layout style={{ minHeight: "100vh" }}>
          {/* Overlay for mobile */}
          {isMobile && !collapsed && (
            <div
              onClick={() => setCollapsed(true)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 998,
              }}
            />
          )}

          {/* 🔹 Fixed Sidebar */}
          <Sider
            width={256}
            collapsed={collapsed}
            trigger={null}
            style={{
              background: "#fff",
              height: "100vh",
              position: "fixed",
              left: collapsed && isMobile ? "-256px" : "0",
              top: 0,
              zIndex: 999,
              transition: "all 0.3s ease",
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
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
              {collapsed ? "AD" : "Admin Dashboard"}

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
            />

            <div className="p-4 text-white bottom-0 absolute w-full">
              <Button
                type="text"
                icon={<LogoutOutlined />}
                className={`w-full font-bold text-left ${
                  collapsed
                    ? "flex justify-center bg-red-600 hover:bg-red-700"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {!collapsed && "Logout"}
              </Button>
            </div>
          </Sider>

          {/* 🔹 Fixed Header and Scrollable Content */}
          <Layout
            style={{
              marginLeft: collapsed ? 80 : 256,
              transition: "all 0.3s ease",
            }}
          >
            <Header
              style={{
                background: "#fff",
                height: 64,
                padding: "0 16px",
                position: "fixed",
                top: 0,
                left: collapsed ? 80 : 256,
                right: 0,
                zIndex: 998,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{ cursor: "pointer" }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
              <h1 style={{ margin: 0, fontSize: "1.25rem" }}>
                Admin Dashboard
              </h1>
            </Header>

            {/* 🔹 Scrollable Content Area */}
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
