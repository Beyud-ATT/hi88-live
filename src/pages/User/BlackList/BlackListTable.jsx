import { Button, Modal, Table } from "antd";
import { useMemo } from "react";
import { FaEyeSlash } from "react-icons/fa";
import useBannedChat from "../../../hooks/useBannedChat";
import useUnBannedChat from "../../../hooks/useUnBannedChat";

export default function BlackListTable() {
  const { data: bannedChatData } = useBannedChat();
  const { mutateAsync: unBannedChat } = useUnBannedChat();
  const bannedChatList = bannedChatData?.data?.data || [];

  const columns = useMemo(
    () => [
      {
        title: "Tên hiển thị",
        dataIndex: "displayName",
        key: "displayName",
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <Button
            onClick={() => {
              Modal.confirm({
                title: `Bạn có muốn gỡ chặn "${record.displayName}" không?`,
                onOk: async () => {
                  await unBannedChat({ userId: record.id });
                },
                okText: "Gỡ chặn",
                okButtonProps: {
                  className:
                    "bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)]",
                },
                cancelText: "Đóng",
              });
            }}
          >
            <FaEyeSlash />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      dataSource={bannedChatList}
      pagination={false}
      bordered
    />
  );
}
