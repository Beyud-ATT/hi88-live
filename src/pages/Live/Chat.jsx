import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ChatBar from "./ChatBar";
import { useSignalR } from "../../contexts/SIgnalRContext";
import { FaCopy, FaCrown, FaRegEyeSlash } from "react-icons/fa";
import { useParams } from "react-router";
import useLiveDetail from "../../hooks/useLiveDetail";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { screenType, useDevice } from "../../contexts/ResponsiveContext";
import useBannedChat from "../../hooks/useBannedChat";
import useAddBannedChat from "../../hooks/useAddBannedChat";
import moment from "moment/moment";
import useScrollDirection from "../../hooks/useScrollDirection";
import useMobileKeyboardOpen from "../../hooks/useMobileKeyboardOpen";
import { chatHeightSetting } from "../../utils/constant";
import { Flex } from "antd";
import UnifiedTextProcessor from "../../utils/textProcessor";

const textProcessor = new UnifiedTextProcessor({
  maxLineBreaks: 2,
  maxSpaces: 2,
  preserveEmojis: true,
  preserveLinks: true,
  processMentions: true,
  processHashtags: false,
  linkStyle: "text-blue-500 hover:text-blue-700 underline cursor-pointer",
  emojiStyle: "inline-block align-middle",
});

function ShowMore({
  message,
  show,
  messageType = "normal",
  isSpecial = false,
  ...rest
}) {
  const [showMore, setShowMore] = useState(false);
  const messageLength = 30;

  // Process the message
  const processedMessage = textProcessor.processForDisplay(message, {
    isSpecial,
    messageType,
  });

  const messageHasBreak = String(processedMessage).includes("<br/>");
  let truncatedMessage = "";

  if (messageHasBreak) {
    truncatedMessage = String(processedMessage)
      .replaceAll("<br/>", "_")
      .split("_")
      .at(0)
      .concat("...");
  } else {
    truncatedMessage =
      String(processedMessage).length <= messageLength
        ? String(processedMessage).replaceAll("<br/>", " ")
        : String(processedMessage).slice(0, messageLength).concat("...");
  }

  const displayMessage = (show !== undefined ? show : showMore)
    ? processedMessage
    : truncatedMessage;
  const messageClasses = textProcessor.getMessageClasses(
    messageType,
    isSpecial
  );

  return (
    <span
      className={`space-x-1 cursor-pointer ${messageClasses}`}
      onClick={(e) => {
        e.stopPropagation();
        setShowMore((state) => !state);
      }}
      dangerouslySetInnerHTML={{ __html: displayMessage }}
      {...rest}
    />
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

  const currentMessage = messages[currentMessageIndex];
  const processedMessage = textProcessor.processForDisplay(currentMessage, {
    messageType: "special",
    isSpecial: true,
  });

  const URLs = textProcessor.detectUrls(currentMessage || "");

  const handleCopy = useCallback(() => {
    if (URLs.length > 0) {
      navigator.clipboard.writeText(URLs[0]);
    }
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
                  message={currentMessage}
                  show={show}
                  textProcessor={textProcessor}
                  messageType="special"
                  isSpecial={true}
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
                  <FaCopy className="text-[#E71818] text-lg cursor-pointer" />
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

  const processedMessage = textProcessor.processForDisplay(message, {
    messageType: "system",
  });

  return (
    <>
      <div className="p-2">
        <p className="text-[var(--color-brand-primary-lighter)] space-x-1 text-justify">
          <span className="space-x-1">
            <span className="text-[var(--color-brand-primary)] font-bold">
              Hệ thống:
            </span>
          </span>
          <ShowMore
            message={message}
            textProcessor={textProcessor}
            messageType="system"
          />
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
      className={`text-white ${chatHeightSetting} flex flex-col p-2 overflow-auto h-[50dvh]`}
      {...rest}
    >
      {!isMobileKeyboardOpen && (
        <WarningAndPinnedComment textProcessor={textProcessor} />
      )}

      <div ref={commentsContainerRef} className="overflow-y-auto">
        <div className="p-2 space-y-3">
          {messages
            ?.filter((comment) => !bannedChatIds.includes(comment?.userId))
            ?.map((comment, index) => {
              const isSpecial = comment.isSpecial;
              const isOwn = comment.userId === curretUserId;

              // Process the message with unified text processor
              const processedMessage = textProcessor.processForDisplay(
                comment.message,
                {
                  isSpecial,
                  isOwn,
                  messageType: isSpecial ? "special" : "normal",
                }
              );

              const usernameClasses =
                textProcessor.getUsernameClasses(isSpecial);
              const messageClasses = textProcessor.getMessageClasses(
                isSpecial ? "special" : "normal",
                isSpecial,
                isOwn
              );

              return (
                <div
                  key={`${comment.id}_${index}`}
                  className="flex justify-between"
                >
                  <div className="flex gap-1">
                    <div className={usernameClasses}>
                      <span>
                        {comment.displayName?.length > 15
                          ? comment.displayName?.slice(0, 15)?.concat("...")
                          : comment.displayName}
                      </span>
                      {isSpecial && (
                        <FaCrown className="rotate-45 text-[10px] font-bold" />
                      )}
                      <span>:</span>
                    </div>
                    <div
                      className={messageClasses}
                      dangerouslySetInnerHTML={{ __html: processedMessage }}
                    />
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

function ChatInterface({ hideInput, ...rest }) {
  const { deviceType } = useDevice();
  const isMobile = useMemo(
    () => deviceType === screenType.MOBILE,
    [deviceType]
  );

  return (
    <div
      className={`flex flex-col h-full w-full justify-between ${chatHeightSetting}`}
      {...rest}
    >
      <ChatFrame
        textProcessor={textProcessor}
        style={{
          borderRadius: `${isMobile ? "8px 8px 0 0" : "none"}`,
        }}
      />
      {!hideInput && (
        <div className={`py-3 px-2 ${isMobile && "rounded-b-lg"}`}>
          <ChatBar textProcessor={textProcessor} />
        </div>
      )}
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

          // Process message with unified text processor
          const processedMessage = textProcessor.processForDisplay(
            comment.message,
            {
              isSpecial,
              messageType: isSpecial ? "special" : "normal",
            }
          );

          const usernameClasses = textProcessor.getUsernameClasses(isSpecial);
          const messageClasses = textProcessor
            .getMessageClasses(isSpecial ? "special" : "normal", isSpecial)
            .replace("text-xs", "text-xl"); // Adjust for bare chat frame

          return (
            <div
              key={`${comment.id}_${index}`}
              className="flex justify-between text-xl"
            >
              <div className="flex gap-1">
                <div className={usernameClasses.replace("text-sm", "text-xl")}>
                  <span>{comment.displayName}</span>
                  {isSpecial && <FaCrown className="rotate-45" />}
                  <span>:</span>
                </div>
                <div
                  className={messageClasses}
                  dangerouslySetInnerHTML={{ __html: processedMessage }}
                />
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
