import { useEffect, useState } from "react";
import ChatBar from "../Live/ChatBar";
import { screenType, useDevice } from "../../contexts/ResponsiveContext";
import { ChatInterface } from "../Live/Chat";

function KeyboardAwareChatBar() {
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    function handleVisualViewportChange() {
      if (window.visualViewport) {
        const offsetBottom =
          window.innerHeight -
          window.visualViewport.height -
          window.visualViewport.offsetTop;
        setBottomOffset(offsetBottom > 0 ? offsetBottom : 0);
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportChange
      );
      window.visualViewport.addEventListener(
        "scroll",
        handleVisualViewportChange
      );
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleVisualViewportChange
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleVisualViewportChange
        );
      }
    };
  }, []);

  return (
    <div
      className="fixed left-0 right-0 z-30 px-4 py-3"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className={`${bottomOffset > 0 ? "bg-white" : ""}`}>
        <ChatBar />
      </div>
    </div>
  );
}

function AdaptiveChatBar() {
  const { deviceType } = useDevice();
  const isMobile = deviceType === screenType.MOBILE;

  if (isMobile) {
    return (
      <>
        <div className="pb-16">
          <ChatInterface hideInput={true} />
        </div>
        <KeyboardAwareChatBar />
      </>
    );
  }

  return <ChatInterface />;
}

export default AdaptiveChatBar;
