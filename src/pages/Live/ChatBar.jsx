import { useParams } from "react-router";
import { useSignalR } from "../../contexts/SIgnalRContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Flex, Input, Typography } from "antd";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import {
  useChatBarFocus,
  useChatBarFocusActions,
} from "../../stores/chatBarFocusStore";
import EmojiPicker from "emoji-picker-react";
import { FaRegSmile } from "react-icons/fa";
import useLiveDetail from "../../hooks/useLiveDetail";
import dayjs from "dayjs";

function EmojiPickerCustom({ onPickEmoji, open, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const chatBarFocus = useChatBarFocus();

  function handleEmojiClick(code) {
    const { emoji } = code;
    typeof onPickEmoji === "function" && onPickEmoji(emoji);
  }

  function handleTrigger() {
    setIsOpen((state) => {
      typeof onChange === "function" && onChange(!state);
      return !state;
    });
  }

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (chatBarFocus) return setIsOpen(false);
  }, [chatBarFocus]);

  return (
    <>
      <Button
        type="text"
        className="text-xl !text-[var(--color-brand-primary-lighter)] focus:!text-[var(--color-brand-primary-lighter)]"
        icon={<FaRegSmile />}
        onClick={handleTrigger}
      />
      <EmojiPicker
        className="!absolute bottom-[10%] right-[10%]"
        width={250}
        reactionsDefaultOpen={false}
        open={isOpen}
        onEmojiClick={handleEmojiClick}
      />
    </>
  );
}

export default function ChatBar({ ...rest }) {
  const { id } = useParams();
  const { data: liveData } = useLiveDetail(id);
  const liveDetailData = useMemo(() => liveData?.data?.data, [liveData]);

  const [showForceLogin, setShowForceLogin] = useState(false);
  const [isSendCode, setIsSendCode] = useState(false);
  const [message, setMessage] = useState("");
  const [isEmoOpen, setIsEmoOpen] = useState(false);
  const [allowChat, setAllowChat] = useState(false);

  const { isAuthenticated } = useAuth();
  const {
    connectionStatus,
    sendChatMessage,
    joinGroup,
    leaveGroup,
    sendCode,
    setLiveMessages,
    currentHubConnection,
    manualReconnect,
  } = useSignalR();
  const { isIdol } = useAuth();
  const { focus, blur } = useChatBarFocusActions();

  const toggleSendCode = useCallback(() => {
    setIsSendCode((state) => !state);
  }, []);

  const handleSendMessage = useCallback(() => {
    const newMsg = message.replace(/\n/g, "<br/>").trim();
    if (message !== "") {
      if (!isSendCode) {
        sendChatMessage({ hub: id, message: newMsg });
        setMessage("");
      } else {
        sendCode({ hub: id, message: newMsg });
        setMessage("");
        toggleSendCode();
      }
      setIsEmoOpen(false);
    }
  }, [message, sendChatMessage, sendCode, id, toggleSendCode, isSendCode]);

  const handleFocus = useCallback(() => {
    // Prevent default mobile scroll behavior
    if (window.innerWidth <= 768) {
      // Disable body scroll
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      focus();

      // Optional: Add event listener to re-enable scroll when input loses focus
      const input = document.activeElement;
      const handleBlur = () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        input.removeEventListener("blur", handleBlur);
      };
      input.addEventListener("blur", handleBlur);
    }
  }, [focus]);

  const handlePickEmoji = useCallback((emo) => {
    setMessage((prev) => prev + emo);
  }, []);

  useEffect(() => {
    if (!connectionStatus) {
      leaveGroup({ hub: id });
    }

    if (connectionStatus) {
      joinGroup({ hub: id });
    }

    return () => {
      leaveGroup({ hub: id });
    };
  }, [id, joinGroup, leaveGroup, connectionStatus, setLiveMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentHubConnection.current) {
        manualReconnect();
      }
    }, 5000);

    if (currentHubConnection.current) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [manualReconnect, currentHubConnection]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        liveDetailData?.scheduleTime &&
        dayjs().isAfter(
          dayjs(liveDetailData.scheduleTime).subtract(10, "minute")
        )
      ) {
        setAllowChat(true);
      }
    }, 1000);

    if (liveDetailData?.isStreaming) {
      setAllowChat(true);
      clearInterval(interval);
    }

    if (!liveDetailData?.isStreaming && !liveDetailData?.scheduleTime) {
      setAllowChat(false);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [liveDetailData, allowChat]);

  const ChatBarMemoized = useMemo(() => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        onMouseEnter={() => !isAuthenticated && setShowForceLogin(true)}
        onMouseLeave={() => setShowForceLogin(false)}
      >
        {!showForceLogin ? (
          <div className="flex gap-2 items-center">
            {isIdol && (
              <Input.TextArea
                onFocus={focus}
                onBlur={blur}
                autoSize
                maxLength={9999}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  allowChat
                    ? "Nói chuyện với streamer"
                    : "Bạn chưa thể chat lúc này"
                }
                className={`flex-1 
                bg-[#3A3B3C] 
                hover:bg-[#3A3B3C]
                focus:bg-[#3A3B3C] 
                focus-within:bg-[#3A3B3C] 
                focus:border-[var(--color-brand-primary-lighter)] 
                focus-within:border-[var(--color-brand-primary-lighter)] 
                hover:border-[var(--color-brand-primary-lighter)] 
                px-3 py-1.5 
                text-white
                placeholder-gray-200
                `}
                classNames={{
                  textarea: "placeholder-gray-200 ",
                  count: "!text-[var(--color-brand-primary-lighter)]",
                }}
                onPressEnter={(e) => {
                  e.preventDefault();
                  if (e.shiftKey) {
                    let newMessage = `${message}\n`;
                    setMessage(newMessage);
                  } else {
                    handleSendMessage();
                  }
                }}
                disabled={!allowChat}
              />
            )}

            {!isIdol && (
              <Input
                onFocus={handleFocus}
                onBlur={blur}
                autoSize
                maxLength={100}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  allowChat
                    ? "Nói chuyện với streamer"
                    : "Bạn chưa thể chat lúc này"
                }
                className={`flex-1 
                bg-[#3A3B3C] 
                hover:bg-[#3A3B3C]
                focus:bg-[#3A3B3C] 
                focus-within:bg-[#3A3B3C] 
                focus:border-[var(--color-brand-primary-lighter)] 
                focus-within:border-[var(--color-brand-primary-lighter)] 
                hover:border-[var(--color-brand-primary-lighter)] 
                px-3 py-1.5 
                text-white
                placeholder-gray-200
                `}
                classNames={{
                  textarea: "placeholder-gray-200",
                }}
                disabled={!allowChat}
              />
            )}

            <div className="flex items-center gap-2">
              {isIdol && (
                <button
                  type="button"
                  className="text-[var(--color-brand-primary-lighter)]"
                  onClick={toggleSendCode}
                >
                  {isSendCode ? (
                    <BsPinAngleFill size={20} />
                  ) : (
                    <BsPinAngle size={20} />
                  )}
                </button>
              )}

              <EmojiPickerCustom
                onPickEmoji={handlePickEmoji}
                open={isEmoOpen}
                onChange={setIsEmoOpen}
              />

              <button
                type="submit"
                className="text-[var(--color-brand-primary-lighter)]"
              >
                <IoSendSharp size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-2">
            <Flex vertical justify="center" align="center" gap={4}>
              <Typography.Title level={5} className="!text-white">
                Nhớ 8 với những người xem chung nhé!
              </Typography.Title>
              <Typography.Text>
                Đăng nhập để tham gia trò chuyện!
              </Typography.Text>
              <button
                type="button"
                className={`text-[var(--color-brand-primary)] w-full p-2 rounded-lg mt-3 !bg-[var(--color-brand-primary-lighter)]`}
                onClick={() => document.getElementById("login-button")?.click()}
              >
                Đăng nhập
              </button>
            </Flex>
          </div>
        )}
      </form>
    );
  }, [
    message,
    isAuthenticated,
    showForceLogin,
    handleSendMessage,
    isIdol,
    isSendCode,
    toggleSendCode,
    blur,
    focus,
    handleFocus,
    isEmoOpen,
    handlePickEmoji,
  ]);

  return ChatBarMemoized;
}
