import { Tabs } from "antd";
import { ChatInterface } from "./Chat";
import ChatFilter from "./ChatFilter";

const items = [
  {
    label: "Bình Luận",
    key: "chats",
    children: <ChatInterface />,
  },
  {
    label: "Lọc chat",
    key: "filter",
    children: <ChatFilter />,
  },
];

export default function LiveTabs() {
  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      items={items}
      className="bg-[var(--color-brand-primary)] "
    />
  );
}
