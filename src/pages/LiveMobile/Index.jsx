import { useNavigate, useParams } from "react-router";
import useLiveDetail from "../../hooks/useLiveDetail";
import LivestreamPlayerMobile from "../../components/VideoPlayerMobile";
import { Avatar } from "antd";
import { useSignalR } from "../../contexts/SIgnalRContext";
import { screenType, useDevice } from "../../contexts/ResponsiveContext";
import { useCallback, useEffect } from "react";
import { FaEye, FaShare } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import Countdown from "../../components/CountDown";
import LiveTabs from "../Live/LiveTabs";
import IdolRating from "../../components/IdolRating";

const ViewerCount = ({ liveDetailData }) => {
  const { viewer } = useSignalR();
  const { isStreaming, viewer: liveViewer } = liveDetailData || {};

  return (
    <span className="flex items-center gap-1">
      <FaEye />
      {isStreaming && viewer !== 0
        ? viewer
        : isStreaming && liveViewer
        ? liveViewer
        : 0}
    </span>
  );
};

export default function LiveMobile() {
  const { id } = useParams();
  const { data } = useLiveDetail(id);
  const liveData = data?.data?.data;
  const isStreaming = liveData?.isStreaming;
  const navigate = useNavigate();
  const { deviceType } = useDevice();
  const isMobile = deviceType === screenType.MOBILE;

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "New88 Live",
        text: "Hãy xem thử livestream của chúng tôi!!!",
        url: window.location.href,
      });
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      navigate(`/live/${id}`);
    }
  }, [isMobile, id, navigate]);

  return (
    <div
      className={`relative w-full h-[100dvh] overflow-hidden transition-all duration-300 ease-in-out`}
      style={{
        background:
          "radial-gradient(71.52% 71.52% at 50% 50%, #58F8FE 0%, #FFF 100%)",
      }}
    >
      <div
        className={`w-full overflow-hidden flex flex-col justify-between h-full`}
      >
        <div className="w-full h-fit z-10 px-2 pt-3 flex items-center justify-between">
          <div className="bg-black/30 pr-2 rounded-full flex items-center gap-2">
            <div>
              <Avatar src={liveData?.avatar} />
            </div>
            <div className="flex flex-col text-white text-[9px]">
              <span>{liveData?.displayName}</span>
              <ViewerCount
                isStreaming={isStreaming}
                liveDetailData={liveData}
              />
            </div>
          </div>
          {!isStreaming && (
            <div>
              <Countdown time={liveData?.scheduleTime} />
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleShare}
              className={`text-[var(--color-brand-primary-lighter)] 
                xl:text-base text-[12px] 
                flex items-center space-x-2 rounded-full
                bg-[var(--color-brand-primary)] 
                py-1 px-2 animate-blink`}
            >
              <FaShare />
              <span>Chia sẻ</span>
            </button>
            <IoCloseSharp
              className="text-black text-2xl"
              onClick={() => navigate("/")}
            />
          </div>
        </div>

        <div className="absolute top-[9%] left-0 w-full z-0 px-2">
          <LivestreamPlayerMobile liveId={id} />
          <IdolRating />
        </div>

        <div className="z-10 mx-2 mb-2">
          <LiveTabs />
        </div>
      </div>
    </div>
  );
}
