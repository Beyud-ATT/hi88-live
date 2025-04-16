import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ChatBar from "./ChatBar";
import { useSignalR } from "../../contexts/SIgnalRContext";
import { FaCopy, FaCrown, FaRegEyeSlash } from "react-icons/fa";
import { useParams } from "react-router";
import useLiveDetail from "../../hooks/useLiveDetail";
import parse from "html-react-parser";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { screenType, useDevice } from "../../contexts/ResponsiveContext";
import useBannedChat from "../../hooks/useBannedChat";
import useAddBannedChat from "../../hooks/useAddBannedChat";
import moment from "moment/moment";
import useScrollDirection from "../../hooks/useScrollDirection";
import useMobileKeyboardOpen from "../../hooks/useMobileKeyboardOpen";
import { chatHeightSetting } from "../../utils/constant";
import { detectUrls } from "../../utils/helper";
import { Flex } from "antd";

function ShowMore({ message, show, ...rest }) {
  const [showMore, setShowMore] = useState(false);
  const messageLength = 30;
  const messageHasBreak = String(message).includes("<br/>");
  let truncatedMessage = "";

  if (messageHasBreak) {
    truncatedMessage = String(message)
      .replaceAll("<br/>", "_")
      .split("_")
      .at(0)
      .concat("...");
  } else {
    truncatedMessage =
      String(message).length <= messageLength
        ? String(message).replaceAll("<br/>", " ")
        : String(message).slice(0, messageLength).concat("...");
  }

  return (
    <span
      className="space-x-1 cursor-pointer text-[#9C9C9C]"
      onClick={(e) => {
        e.stopPropagation();
        setShowMore((state) => !state);
      }}
      {...rest}
    >
      {(show !== undefined ? show : showMore) ? (
        <span>{parse(message)}</span>
      ) : (
        <span>{truncatedMessage}</span>
      )}
    </span>
  );
}

function PinnedMessage() {
  const { id } = useParams();
  const { data } = useLiveDetail(id);
  const eventCodes = data?.data?.data?.eventCodes;
  const [messages, setMessages] = useState(eventCodes || []);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [show, setShow] = useState(false);

  const { newPinnedMsg, resetNewPinnedMsg } = useSignalR();

  const URLs = detectUrls(messages[currentMessageIndex]);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(URLs);
  }, [URLs]);

  const handleMessageClick = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages?.length);
    },
    [messages?.length]
  );

  function toggleShow(e) {
    e.stopPropagation();
    setShow((state) => !state);
  }

  useEffect(() => {
    if (eventCodes) {
      setMessages(eventCodes);
      setCurrentMessageIndex(eventCodes?.length - 1);
    }
  }, [eventCodes]);

  useEffect(() => {
    if (newPinnedMsg) {
      setMessages((prev) => [...prev, newPinnedMsg]);
      setCurrentMessageIndex((prev) => prev + 1);
    }

    resetNewPinnedMsg();
  }, [newPinnedMsg, resetNewPinnedMsg]);

  return (
    messages?.length > 0 && (
      <div
        className="cursor-pointer bg-[#D9F8FF] rounded-lg"
        onClick={handleMessageClick}
      >
        <div className="max-w-full px-4 py-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden min-w-0 justify-center text-[#E71818] font-semibold">
              <span className="flex-shrink-0">{currentMessageIndex + 1}. </span>
              <div className="overflow-hidden">
                <ShowMore
                  message={messages[currentMessageIndex]}
                  show={show}
                  style={{ color: "#E71818" }}
                />
              </div>
            </div>

            <Flex justify="center" align="center">
              {show ? (
                <button type="button" className="m-1 cursor-pointer">
                  <IoMdArrowDropup
                    className="text-[#E71818] text-2xl cursor-pointer"
                    onClick={toggleShow}
                  />
                </button>
              ) : (
                <button type="button" className="m-1 cursor-pointer">
                  <IoMdArrowDropdown
                    className="text-[#E71818] text-2xl cursor-pointer"
                    onClick={toggleShow}
                  />
                </button>
              )}

              {URLs?.length > 0 && (
                <button
                  type="button"
                  className="m-1 cursor-pointer"
                  onClick={handleCopy}
                >
                  <FaCopy className="text-[#E71818] text-lg  cursor-pointer" />
                </button>
              )}
            </Flex>
          </div>
        </div>
      </div>
    )
  );
}

function WarningAndPinnedComment() {
  const message = `Chào mừng bạn đến với phòng Live Hi88. Tại đây Admin thiết lập môi
            trường thân thiện hài hòa. Tất cả nội dung lạm dụng, thô tục và nhạy
            cảm sẽ bị chặn. Hội viên chú ý giữ an toàn tài sản của bạn vui lòng
            không chuyển tiền riêng để tránh bị lừa đảo.`;

  return (
    <>
      <div className="p-2">
        <p className="text-[var(--color-brand-primary-lighter)] space-x-1 text-justify">
          <span className="space-x-1">
            {/* <FaBell className="inline-block p-1 rounded-full text-xl bg-gray-400 -translate-y-0.5" /> */}
            <span className="text-[var(--color-brand-primary)] font-bold">
              Hệ thống:
            </span>
          </span>
          <ShowMore message={message} />
        </p>
      </div>

      <PinnedMessage />
    </>
  );
}

function ChatFrame({ ...rest }) {
  const { id } = useParams();
  const curretUserId = useMemo(() => localStorage.getItem("userId"), []);

  const commentsContainerRef = useRef(null);
  const commentsEndRef = useRef(null);

  const {
    liveMessages: comments,
    resetLiveMessages,
    setLiveMessages,
  } = useSignalR();
  const { data: bannedChatList } = useBannedChat();
  const { mutateAsync: addBannedChat } = useAddBannedChat();
  const bannedChatIds = useMemo(
    () => (bannedChatList?.data?.data || []).map((item) => item.id),
    [bannedChatList]
  );

  const isMobileKeyboardOpen = useMobileKeyboardOpen();
  const { isSrcollUp } = useScrollDirection({
    element: commentsContainerRef.current,
    thresholdPixels: 10,
    throttleTime: 300,
  });

  const getMessages = useCallback(() => {
    if (comments?.length > 0) return comments;
    if (!localStorage.getItem(`${id}-chat`)) return [];

    const localStorageData = JSON.parse(localStorage.getItem(`${id}-chat`));
    const messages = localStorageData?.chat;

    if (moment().isAfter(localStorageData?.expiredAt)) {
      localStorage.removeItem(`${id}-chat`);
      resetLiveMessages();
      return [];
    }

    return messages;
  }, [comments, id, resetLiveMessages]);
  const messages = useMemo(() => getMessages(), [getMessages]);

  const scrollToBottom = useCallback(() => {
    const container = commentsContainerRef.current;
    const bottomElement = commentsEndRef.current;

    if (container && bottomElement && !isSrcollUp) {
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      if (scrollHeight > containerHeight) {
        bottomElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [isSrcollUp]);

  useEffect(() => {
    scrollToBottom();
  }, [comments, scrollToBottom]);

  useEffect(() => {
    if (comments?.length === 0) return;

    const deepCopy = comments?.slice(Math.max(comments.length - 50, 1));
    localStorage.setItem(
      `${id}-chat`,
      JSON.stringify({
        chat: deepCopy,
        expiredAt: moment().add(30, "minutes"),
      })
    );
  }, [comments, id, getMessages]);

  useEffect(() => {
    if (messages?.length > 0 && comments?.length === 0) {
      setLiveMessages(messages);
    }
  });

  return (
    <div
      className={`text-white flex flex-col p-2 ${chatHeightSetting} overflow-auto ${
        isMobileKeyboardOpen ? "h-[30dvh]" : "h-[45dvh]"
      }`}
      {...rest}
    >
      {!isMobileKeyboardOpen && <WarningAndPinnedComment />}

      <div ref={commentsContainerRef} className="overflow-y-auto">
        <div className="p-2 space-y-3">
          {messages
            ?.filter((comment) => !bannedChatIds.includes(comment?.userId))
            ?.map((comment, index) => {
              const isSpecial = comment.isSpecial;

              return (
                <div
                  key={`${comment.id}_${index}`}
                  className="flex justify-between"
                >
                  <div className="flex gap-1">
                    <div
                      className={`flex gap-0.5 text-[#00EAFF] text-sm font-medium mb-1 ${
                        isSpecial ? "!text-[#FF6699] font-bold" : ""
                      }`}
                    >
                      <span>{comment.displayName}</span>
                      {isSpecial && (
                        <FaCrown className="rotate-45 text-[10px] font-bold" />
                      )}
                      <span>:</span>
                    </div>
                    <div
                      className={`text-[#CECFD2] text-xs leading-relaxed ${
                        isSpecial ? "!text-[#FF6699] font-semibold" : ""
                      } break-all`}
                    >
                      {parse(comment.message)}
                    </div>
                  </div>
                  <div className="text-gray-400 cursor-pointer">
                    {comment.userId !== curretUserId && !isSpecial && (
                      <FaRegEyeSlash
                        onClick={() => {
                          addBannedChat({ userId: comment?.userId });
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          <div ref={commentsEndRef} />
        </div>
      </div>
    </div>
  );
}

function ChatInterface({ ...rest }) {
  const { deviceType } = useDevice();
  const isMobile = useMemo(
    () => deviceType === screenType.MOBILE,
    [deviceType]
  );

  return (
    <div
      className={`flex flex-col md:h-full w-full justify-between ${chatHeightSetting}`}
      {...rest}
    >
      <ChatFrame
        style={{
          borderRadius: `${isMobile ? "8px 8px 0 0" : "none"}`,
        }}
      />
      <div className={`py-3 px-2 ${isMobile && "rounded-b-lg"}`}>
        <ChatBar />
      </div>
    </div>
  );
}

function BareChatFrame() {
  const { id } = useParams();
  const {
    liveMessages: comments,
    connectionStatus,
    joinGroup,
    leaveGroup,
    manualReconnect,
    currentHubConnection,
  } = useSignalR();

  const commentsContainerRef = useRef(null);
  const commentsEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const container = commentsContainerRef.current;
    const bottomElement = commentsEndRef.current;
    if (container && bottomElement) {
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;
      if (scrollHeight > containerHeight) {
        bottomElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [comments, scrollToBottom]);

  useEffect(() => {
    if (connectionStatus) {
      joinGroup({ hub: id });
    }
    return () => {
      leaveGroup({ hub: id });
    };
  }, [id, joinGroup, leaveGroup, connectionStatus, manualReconnect]);

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

  return (
    <div
      ref={commentsContainerRef}
      className="overflow-y-auto w-[500px] !bg-transparent h-[100dvh] no-scrollbar"
    >
      <div className="p-2 space-y-3">
        {comments.map((comment, index) => {
          const isSpecial = comment.isSpecial;
          return (
            <div
              key={`${comment.id}_${index}`}
              className="flex justify-between text-xl"
            >
              <div className="flex gap-1">
                <div
                  className={`flex gap-0.5 text-[var(--color-brand-primary)] font-medium mb-1 ${
                    isSpecial ? "!text-[#FF6699] font-bold" : ""
                  }`}
                >
                  <span>{comment.displayName}</span>
                  {isSpecial && <FaCrown className="rotate-45" />}
                  <span>:</span>
                </div>
                <div
                  className={`text-gray-300 leading-relaxed ${
                    isSpecial ? "!text-[#FF6699] font-bold" : ""
                  } break-all`}
                >
                  {parse(comment.message)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={commentsEndRef} />
      </div>
    </div>
  );
}

export { ChatInterface, BareChatFrame };
