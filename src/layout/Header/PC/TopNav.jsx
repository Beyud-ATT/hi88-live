import { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router";

export const items = [
  {
    label: (
      <Link to="" target="_blank">
        Trang chủ
      </Link>
    ),
    key: "home",
    render: (props) => (
      <Link
        to=""
        target="_blank"
        {...props}
        className="!text-[var(--color-brand-primary)]"
      >
        Trang chủ
      </Link>
    ),
  },
  {
    label: "Live",
    key: "live",
    render: (props) => (
      <Link to="/" {...props} className="!text-[var(--color-brand-primary)]">
        Live
      </Link>
    ),
  },
  {
    label: (
      <Link to="" target="_blank">
        NHẬP CODE
      </Link>
    ),
    key: "code",
    render: (props) => (
      <Link
        to="https://freecode-hi88.pages.dev/"
        {...props}
        className="!text-[var(--color-brand-primary)]"
      >
        NHẬP CODE
      </Link>
    ),
  },
  {
    label: "Game +",
    key: "game",
    render: (props) => (
      <Link to="/" {...props} className="!text-[var(--color-brand-primary)]">
        Game+
      </Link>
    ),
  },
  {
    label: "Tải App",
    key: "download",
    render: (props) => (
      <Link
        to="taiapp"
        target="_blank"
        {...props}
        className="!text-[var(--color-brand-primary)]"
      >
        Tải App
      </Link>
    ),
  },
];

const TopNav = (props) => {
  const [current, setCurrent] = useState("home");
  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      className="w-full md:flex hidden justify-center border-b-[0]"
      {...props}
    >
      {/* You have to do it like this, or else it will collapse into sub-menu */}
      {items.map((item) => (
        <Menu.Item key={item.key}>
          <div className="font-bold uppercase">{item.render()}</div>
        </Menu.Item>
      ))}
    </Menu>
  );
};
export default TopNav;
