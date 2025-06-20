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
import DOMPurify from "isomorphic-dompurify";
import { toast } from "react-toastify";
import AntiSpamFilter from "../../utils/antiSpamFilter"; // Import the filter
import dayjs from "dayjs";

// Create spam filter instance (you might want to move this to a context)
const createSpamFilter = (isIdol) => {
  const spamFilter = new AntiSpamFilter({
    maxRepeatedChars: 3,
    maxRepeatedWords: 2,
    maxEmojiSequence: 4,
    maxMessageLength: isIdol ? 9999 : 100,
    minTimeBetweenMessages: isIdol ? 500 : 1000,
    maxSimilarMessages: 2,
  });

  return spamFilter;
};

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
        className="text-xl !text-[var(--color-brand-primary)] focus:!text-[var(--color-brand-primary)]"
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
  const [isBlocked, setIsBlocked] = useState(false); // Track if user is temporarily blocked

  const { isAuthenticated, user } = useAuth(); // Assuming user object has userId
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

  const spamFilter = useMemo(() => createSpamFilter(isIdol), [isIdol]);

  // Update spam filter config based on user type
  useEffect(() => {
    if (isIdol) {
      spamFilter.config.maxMessageLength = 9999;
      spamFilter.config.minTimeBetweenMessages = 500; // Idols can send faster
    } else {
      spamFilter.config.maxMessageLength = 100;
      spamFilter.config.minTimeBetweenMessages = 1500;
    }
  }, [isIdol]);

  const toggleSendCode = useCallback(() => {
    setIsSendCode((state) => !state);
  }, []);

  const handleSendMessage = useCallback(() => {
    // Get user ID (you might need to adjust this based on your auth structure)
    const userId = user?.id || localStorage.getItem("userId") || "anonymous";

    // Pre-process message
    const rawMessage = message.trim();
    const sanitizedMessage = DOMPurify.sanitize(rawMessage);

    // Check if message is only spaces
    const isOnlySpace = rawMessage.replace(/\s/g, "").length === 0;
    if (isOnlySpace) {
      toast.error("Vui lòng nhập tin nhắn");
      return;
    }

    // Apply anti-spam filter
    const filterResult = spamFilter.filterMessage(sanitizedMessage, userId);

    if (filterResult.isSpam) {
      // Show error message to user
      toast.error(`Tin nhắn bị chặn: ${filterResult.reasons.join(", ")}`);

      // Optionally implement temporary blocking for repeat offenders
      if (filterResult.reasons.includes("Gửi tin nhắn quá nhanh")) {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 5000); // Block for 5 seconds
      }

      return;
    }

    // Process the filtered message
    const finalMessage = filterResult.filteredText.replace(/\n/g, "<br/>");

    if (!isSendCode) {
      sendChatMessage({ hub: id, message: finalMessage });
      setMessage("");
    } else {
      sendCode({ hub: id, message: finalMessage });
      setMessage("");
      toggleSendCode();
    }
    setIsEmoOpen(false);
  }, [
    message,
    sendChatMessage,
    sendCode,
    id,
    toggleSendCode,
    isSendCode,
    user,
    spamFilter,
  ]);

  const handleFocus = useCallback(() => {
    if (window.innerWidth <= 768) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
      focus();

      const input = document.activeElement;
      const handleBlur = () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
        input.removeEventListener("blur", handleBlur);
      };
      input.addEventListener("blur", handleBlur);
    }
  }, [focus]);

  const handlePickEmoji = useCallback((emo) => {
    setMessage((prev) => prev + emo);
  }, []);

  // Real-time message validation as user types
  const handleMessageChange = useCallback(
    (e) => {
      const newMessage = e.target.value;
      setMessage(newMessage);

      // Optional: Show warning if message might be spam
      if (newMessage.length > 50) {
        // Only check longer messages to avoid constant checking
        const userId =
          user?.id || localStorage.getItem("userId") || "anonymous";
        const preCheck = spamFilter.filterMessage(newMessage, userId);

        if (preCheck.isSpam && preCheck.reasons.length > 0) {
          // You could show a subtle warning here
          console.warn("Message might be blocked:", preCheck.reasons);
        }
      }
    },
    [user, spamFilter]
  );

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
    const isInputDisabled = !allowChat || isBlocked;
    const placeholderText = isBlocked
      ? "Bạn đang bị tạm khóa do spam..."
      : allowChat
      ? "Nói chuyện với streamer"
      : "Bạn chưa thể chat lúc này";

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isBlocked) {
            handleSendMessage();
          }
        }}
        onMouseEnter={() => !isAuthenticated && setShowForceLogin(true)}
        onMouseLeave={() => setShowForceLogin(false)}
      >
        {!showForceLogin ? (
          <div className="flex gap-2 items-center">
            {isIdol && (
              <Input.TextArea
                onFocus={handleFocus}
                onBlur={blur}
                autoSize
                maxLength={9999}
                type="text"
                value={message}
                onChange={handleMessageChange}
                placeholder={placeholderText}
                className={`flex-1 
                bg-[#F1F1F1] 
                hover:bg-[#F1F1F1]
                focus:bg-[#F1F1F1] 
                focus-within:bg-[#F1F1F1] 
                focus:border-[var(--color-brand-primary)] 
                focus-within:border-[var(--color-brand-primary)] 
                hover:border-[var(--color-brand-primary)] 
                px-3 py-1.5 
                text-black
                placeholder-black
                ${isBlocked ? "opacity-50" : ""}
                `}
                classNames={{
                  textarea: "placeholder-black",
                  count: "!text-[var(--color-brand-primary)]",
                }}
                onPressEnter={(e) => {
                  e.preventDefault();
                  if (e.shiftKey) {
                    let newMessage = `${message}\n`;
                    setMessage(newMessage);
                  } else if (!isBlocked) {
                    handleSendMessage();
                  }
                }}
                disabled={isInputDisabled}
              />
            )}

            {!isIdol && (
              <Input
                onFocus={focus}
                onBlur={blur}
                autoSize
                maxLength={100}
                type="text"
                value={message}
                onChange={handleMessageChange}
                placeholder={placeholderText}
                className={`flex-1 
                bg-[#F1F1F1] 
                hover:bg-[#F1F1F1]
                focus:bg-[#F1F1F1] 
                focus-within:bg-[#F1F1F1] 
                focus:border-[var(--color-brand-primary)] 
                focus-within:border-[var(--color-brand-primary)] 
                hover:border-[var(--color-brand-primary)] 
                px-3 py-1.5 
                text-black
                placeholder-black
                ${isBlocked ? "opacity-50" : ""}
                `}
                classNames={{
                  textarea: "placeholder-black",
                }}
                disabled={isInputDisabled}
              />
            )}

            <div className="flex items-center gap-2">
              {isIdol && (
                <button
                  type="button"
                  className={`text-[var(--color-brand-primary)] ${
                    isBlocked ? "opacity-50" : ""
                  }`}
                  onClick={toggleSendCode}
                  disabled={isBlocked}
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
                className={`text-[var(--color-brand-primary)] ${
                  isBlocked ? "opacity-50" : ""
                }`}
                disabled={isBlocked}
              >
                <IoSendSharp size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full md:py-2">
            <Flex vertical justify="center" align="center">
              <Typography.Title
                level={5}
                className="md:!text-auto !text-[14px]"
              >
                Nhớ 8 với những người xem chung nhé!
              </Typography.Title>
              <Typography.Text className="md:!text-auto !text-[12px]">
                Đăng nhập để tham gia trò chuyện!
              </Typography.Text>
              <button
                type="button"
                className={`text-[var(--color-brand-primary-lighter)] w-full md:p-2 p-1 rounded-lg md:mt-3 mt-1 !bg-[var(--color-brand-primary)]`}
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
    allowChat,
    isBlocked,
    handleMessageChange,
  ]);

  return ChatBarMemoized;
}
