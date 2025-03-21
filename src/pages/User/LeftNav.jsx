import React from "react";
import {
  FaUser,
  FaLock,
  // FaCrown,
  // FaCog,
  // FaGift,
  // FaHistory,
  // FaLink,
  FaChevronRight,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { FaUserSlash } from "react-icons/fa6";

import { Menu, Modal } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation } from "react-router";
import { RiLiveFill } from "react-icons/ri";
import { useUserActionDrawer } from "../../layout/Header/Mobile/UserActionDrawer";
import { UserType } from "../../utils/constant";

const menuItems = [
  // {
  //   key: "stream-dashboard",
  //   icon: <RiLiveFill />,
  //   label: (
  //     <Link to={import.meta.env.VITE_DASHBOARD_URL} target="_blank">
  //       Dashboard
  //     </Link>
  //   ),
  //   extra: <FaChevronRight />,
  // },
  {
    key: "profile",
    icon: <FaUser />,
    label: <Link to="/user/profile">Thông tin cá nhân</Link>,
    extra: <FaChevronRight />,
  },
  {
    key: "forgot-password",
    icon: <FaLock />,
    label: <Link to="/user/forgot-password">Đổi mật khẩu</Link>,
    extra: <FaChevronRight />,
  },
  {
    key: "livestreams-config",
    icon: <RiLiveFill />,
    label: <Link to="/user/livestreams-config">Cấu hình Livestream</Link>,
    extra: <FaChevronRight />,
  },
  {
    key: "black-list",
    icon: <FaUserSlash />,
    label: <Link to="/user/black-list">Danh sách đen</Link>,
    extra: <FaChevronRight />,
  },
  // {
  //   key: "vip",
  //   icon: <FaCrown />,
  //   label: "Tiến độ VIP",
  //   extra: <FaChevronRight  />,
  // },
  // {
  //   key: "services",
  //   icon: <FaCog />,
  //   label: "Nhiệm Vụ",
  //   extra: <FaChevronRight  />,
  // },
  // {
  //   key: "donate-history",
  //   icon: <FaHistory />,
  //   label: "Lịch Sử Donate",
  //   extra: <FaChevronRight  />,
  // },
  // {
  //   key: "rewards",
  //   icon: <FaGift />,
  //   label: "Lịch Sử Đổi Điểm Thưởng",
  //   extra: <FaChevronRight  />,
  // },
  // {
  //   key: "network",
  //   icon: <FaLink />,
  //   label: "Trí Khoản Liên Kết NETWEB",
  //   extra: <FaChevronRight  />,
  // },
  {
    key: "signout",
    icon: <FaSignOutAlt />,
    label: <span>Đăng xuất</span>,
    extra: <FaChevronRight />,
  },
];

const LeftNav = () => {
  const { logout } = useAuth();
  const userActionDrawer = useUserActionDrawer();
  const pathname = useLocation().pathname;
  const userType = localStorage.getItem("userType");
  const isIdol = userType === UserType.IDOL;

  const currentKey = menuItems.find(
    (item) => item.key === pathname.split("/").pop()
  )?.key;

  const onClick = (e) => {
    if (e.key === "signout") {
      Modal.confirm({
        icon: (
          <FaSignOutAlt className="text-2xl mr-2 mt-0.5 text-[var(--color-brand-primary)]" />
        ),
        title: (
          <span className="text-lg text-[var(--color-brand-primary)]">
            Đăng xuất
          </span>
        ),
        content: "Bạn có muốn đăng xuất?",
        cancelButtonProps: {
          className:
            "hover:!text-[var(--color-brand-primary)] hover:!border-[var(--color-brand-primary)]",
        },
        okButtonProps: {
          className:
            "bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)]",
        },
        closable: true,
        okText: "Đăng xuất",
        cancelText: "Hủy",
        onOk() {
          logout();
        },
      });
    } else {
      typeof userActionDrawer?.toggleDrawer === "function" &&
        userActionDrawer?.toggleDrawer();
    }
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={[currentKey]}
      defaultOpenKeys={[currentKey]}
      mode="inline"
      items={menuItems.map((item) => {
        if (!isIdol && item.key === "livestreams-config") return null;
        return item;
      })}
      className="lg:!w-[26%] w-full min-h-screen p-4 bg-[var(--user-page-left-nav)]"
    />
  );
};
export default LeftNav;
