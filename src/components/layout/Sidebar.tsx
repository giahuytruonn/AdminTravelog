import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  GlobalOutlined,
  TagsOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  UsergroupAddOutlined, // Icon mới cho quản lý Partner
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth"; // Hook lấy thông tin user
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth(); // Lấy profile từ Firestore

  // Menu cơ bản ai cũng thấy
  const items = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/tours",
      icon: <GlobalOutlined />,
      label: "Tours",
    },
    {
      key: "/coupons",
      icon: <TagsOutlined />,
      label: "Coupons",
    },
    {
      key: "/destinations",
      icon: <EnvironmentOutlined />,
      label: "Destinations",
    },
    {
      key: "/explores",
      icon: <VideoCameraOutlined />,
      label: "Explores",
    },
  ];

  // CHỈ ADMIN MỚI THẤY MỤC NÀY
  if (userProfile?.userType === "ADMIN") {
    items.push({
      key: "/users",
      icon: <UsergroupAddOutlined />,
      label: "Partner Manager", // Quản lý đối tác
    });
  }

  // Mục đăng xuất
  const logoutItem = {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
    danger: true,
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={250}
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 10,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <h2
          style={{
            background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontSize: collapsed ? "18px" : "24px",
            fontWeight: "bold",
            fontFamily: "'Outfit', sans-serif",
            color: 'transparent' // Fallback
          }}
        >
          {collapsed ? "AT" : "Admin Travelog"}
        </h2>
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={[...items, logoutItem].map(item => ({
          ...item,
          style: location.pathname === item.key ? {
            background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
            color: '#fff',
            borderRadius: 8,
            marginBottom: 4
          } : {
            borderRadius: 8,
            marginBottom: 4
          }
        }))}
        onClick={({ key }) => {
          if (key === "logout") {
            signOut(auth);
            navigate("/login");
          } else {
            navigate(key);
          }
        }}
        style={{ borderRight: 0, padding: '16px' }}
      />
    </Sider>
  );
};

export default Sidebar;
