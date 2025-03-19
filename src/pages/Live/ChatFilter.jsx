import { Button, Form, DatePicker } from "antd";
import { chatHeightSetting } from "../../utils/constant";
import useCheckChat from "../../hooks/useCheckChat";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { useState } from "react";

export default function ChatFilter() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [chats, setChats] = useState([]);

  const { mutate: checkChat, isLoading: isChecking } = useCheckChat();

  const handleCheckChat = (values) => {
    const params = {
      ...values,
      startAt: dayjs(values.startAt).toISOString(),
      endAt: dayjs(values.endAt).toISOString(),
      chatFilter: "Message",
      group: id,
    };
    checkChat(params, {
      onSuccess: (data) => {
        if (data.status === 200) {
          setChats(data?.data?.data);
        }
      },
    });
  };

  return (
    <div className={`${chatHeightSetting} overflow-auto h-[57dvh]`}>
      <Form
        form={form}
        className="flex flex-col justify-center py-4 px-4 sticky top-0"
        onFinish={handleCheckChat}
      >
        <div className="flex w-full justify-center items-center gap-2">
          <Form.Item name="startAt">
            <DatePicker placeholder="Từ" defaultValue={dayjs()} showTime />
          </Form.Item>
          <Form.Item name="endAt">
            <DatePicker
              placement="bottomRight"
              placeholder="Đến"
              defaultValue={dayjs()}
              showTime
            />
          </Form.Item>
        </div>
        <Form.Item className="flex justify-end !m-0">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[var(--color-brand-primary-lighter)] hover:!bg-[var(--color-brand-primary-lighter)] border-none disabled:bg-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
            disabled={isChecking}
          >
            Kiểm tra
          </Button>
        </Form.Item>
      </Form>
      <div className="flex flex-col gap-2 my-3 text-white px-4">
        {chats.map((chat, index) => {
          return (
            <div
              key={index}
              className="flex flex-col gap-2 mb-3 text-white w-full overflow-hidden"
            >
              <p className="flex flex-wrap justify-between px-2 break-all">
                <span>
                  <span className="text-[var(--color-brand-primary-lighter)]">
                    Nội dung:
                  </span>{" "}
                  {chat.hiddenMessage}
                </span>
                <span className="text-[10px] align-bottom pt-2 text-gray-200">
                  {dayjs(chat.createdAt).format("HH:mm")}
                </span>
              </p>
              <div className="w-full h-[1px] bg-[var(--footer-border-bottom-color)]"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
