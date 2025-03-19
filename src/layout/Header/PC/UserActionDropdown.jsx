import { Dropdown, Modal } from "antd";
import { IoSettingsSharp } from "react-icons/io5";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router";
import UserAvatar from "../../../components/UserAvatar";
import { FaSignOutAlt } from "react-icons/fa";

export default function UserActionDropdown() {
  const { isAuthenticated, logout } = useAuth();

  const handleSignOut = () => {
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
  };

  const items = [
    {
      label: (
        <Link to="/user/profile">
          <div className="flex items-center gap-2">
            <IoSettingsSharp className=" !text-white" />
            <span className="text-white">Quản lý tài khoản</span>
          </div>
        </Link>
      ),
      key: "settings",
    },
    {
      label: (
        <div className="flex items-center gap-2" onClick={handleSignOut}>
          <FaSignOutAlt className=" !text-white" />
          <span className="text-white">Đăng xuất</span>
        </div>
      ),
      key: "signout",
    },
  ];

  return (
    isAuthenticated && (
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement="bottomRight"
        overlayClassName="user-action-dropdown"
      >
        <UserAvatar />
      </Dropdown>
    )
  );
}
