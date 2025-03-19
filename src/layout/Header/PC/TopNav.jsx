import { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router";

export const items = [
  {
    label: (
      <Link to="https://shb27.com/" target="_blank">
        Trang chủ
      </Link>
    ),
    key: "home",
    render: (props) => (
      <Link to="https://shb27.com/" target="_blank" {...props}>
        Trang chủ
      </Link>
    ),
  },
  {
    label: "Live",
    key: "live",
    render: (props) => (
      <Link to="/" {...props}>
        Live
      </Link>
    ),
  },
  {
    label: "Liveshow",
    key: "liveshow",
    render: (props) => (
      <Link to="/" {...props}>
        Liveshow
      </Link>
    ),
  },

  {
    label: "Game +",
    key: "game",
    render: (props) => (
      <Link to="/" {...props}>
        Game+
      </Link>
    ),
  },
  {
    label: "Tải App",
    key: "download",
    render: (props) => (
      <Link to="https://shb27.com/taiapp" target="_blank" {...props}>
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
