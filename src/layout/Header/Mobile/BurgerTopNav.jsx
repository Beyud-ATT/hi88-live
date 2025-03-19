import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Drawer, Menu } from "antd";
import { items } from "../PC/TopNav";
import { TfiMenuAlt } from "react-icons/tfi";

export default function BurgerTopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(items[0].key);

  return (
    <div className="md:hidden block">
      <button
        className="rounded-full flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <TfiMenuAlt className="text-2xl" />
      </button>
      <Drawer
        title={
          <IoCloseSharp
            className="mt-4 text-2xl"
            onClick={() => setIsOpen(false)}
          />
        }
        placement={"left"}
        closable={false}
        onClose={() => setIsOpen(false)}
        open={isOpen}
        key="left"
        className="!bg-[var(--video-player-bg)] bg-opacity-80"
      >
        <Menu
          mode="vertical"
          items={items}
          selectedKeys={[current]}
          onClick={(e) => setCurrent(e.key)}
          className="!bg-[var(--video-player-bg)] !border-none"
        />
      </Drawer>
    </div>
  );
}
