import { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
  FaRegEye,
  FaShare,
} from "react-icons/fa";
import flvjs from "flv.js";
import Hls from "hls.js";
import { Avatar, Button, Flex, Image, Spin, Typography } from "antd";
import { useLocation, useNavigate } from "react-router";
import useLiveDetail from "../hooks/useLiveDetail";
import Countdown from "./CountDown";
import dayjs from "dayjs";
import { useSignalR } from "../contexts/SIgnalRContext";
import { MdOutlineUpdateDisabled, MdPlayDisabled } from "react-icons/md";
import { CiStreamOn } from "react-icons/ci";
import {
  videoHeightSettingInHome,
  videoHeightSettingInRoom,
} from "../utils/constant";

import Hanna from "../assets/hanna.webp";

const LivestreamPlayer = ({ liveId }) => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const volumeControlRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  Countdown;
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoLiveHeightSetting = `${
    isFullscreen
      ? "!h-full"
      : pathname.includes("/live/")
      ? videoHeightSettingInRoom
      : videoHeightSettingInHome
  }`;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(
    !pathname.includes("/live/")
  );
  const [isLive, setIsLive] = useState(true);

  const { viewer, streamsInfo } = useSignalR();

  const { data: liveData, isLoading: isLiveDetailLoading } =
    useLiveDetail(liveId);
  const liveDetailData = liveData?.data?.data;
  const flvUrl = liveDetailData?.flvLink;
  const hlsUrl = liveDetailData?.hlsLink;
  let isStreaming;

  streamsInfo?.filter((item) => {
    if (item.Group === liveId) {
      isStreaming = item.IsStreaming;
    }
  });

  if (!isStreaming) {
    isStreaming = liveDetailData?.isStreaming && isLive;
  }

  const getVolumePercentageStyle = () => {
    return {
      background: `linear-gradient(to right, white ${volume}%, rgba(0, 0, 0, 0.3) ${volume}%)`,
    };
  };

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  useEffect(() => {
    if (isLiveDetailLoading) return;

    if (flvUrl || hlsUrl) {
      initializePlayer();
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      destroyPlayer();
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [flvUrl, hlsUrl]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (liveDetailData?.scheduleTime && liveDetailData?.isStreaming) {
        if (dayjs().isAfter(dayjs(liveDetailData?.scheduleTime))) {
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      }
    }, 1000);

    if (liveDetailData?.isStreaming) {
      clearInterval(intervalId);
      setIsLive(true);
    }

    return () => clearInterval(intervalId);
  }, [liveDetailData]);

  const initializePlayer = () => {
    setError(null);
    setIsLoading(true);

    // Check if FLV is available and preferred
    if (flvUrl && !isIOS) {
      // console.log("Attempting to play FLV:", flvUrl);
      if (flvjs.isSupported()) {
        initializeFLVPlayer();
        setIsLoading(false);
        return; // Exit after initializing FLV
      } else {
        console.warn("FLV not supported, falling back to HLS");
        setIsLoading(false);
      }
    }

    // Fallback to HLS
    if (hlsUrl) {
      // console.log("Attempting to play HLS:", hlsUrl);
      initializeHLSPlayer();
      setIsLoading(false);
    } else {
      setError("No streaming URL available");
      setIsLoading(false);
    }
  };

  const initializeHLSPlayer = () => {
    try {
      if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = hlsUrl;
        startPlayback();
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", event, data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError("Network error occurred. Retrying...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Media error occurred. Recovering...");
                hls.recoverMediaError();
                break;
              default:
                setError("Fatal streaming error occurred");
                destroyPlayer();
                setTimeout(initializePlayer, 5000);
                break;
            }
          }
        });

        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);
        playerRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          startPlayback();
        });
      } else {
        setError("HLS playback is not supported in this browser");
      }
    } catch (error) {
      console.error("HLS initialization error:", error);
      setError("Failed to initialize HLS player");
    }
  };

  const initializeFLVPlayer = () => {
    try {
      if (flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: "flv",
          url: flvUrl,
          isLive: true,
        });

        flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
          // console.error("FLV Error Type:", errorType);
          // console.error("Error Details:", errorDetail);
          // console.error("Player Info:", flvPlayer.getStatisticsInfo());
          setError("Stream error occurred. Retrying...");
          destroyPlayer();
          setTimeout(initializePlayer, 5000);
        });

        // flvPlayer.on(flvjs.Events.STATISTICS_INFO, (stats) => {
        //    console.log("Player Statistics:", stats);
        // });

        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        playerRef.current = flvPlayer;

        startPlayback();
      } else {
        setError("FLV playback is not supported in this browser");
      }
    } catch (error) {
      console.error("FLV initialization error:", error);
      setError("Failed to initialize FLV player");
    }
  };

  const startPlayback = () => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Playback failed:", error);
          if (error.name === "NotAllowedError") {
            setNeedsInteraction(true);
          } else {
            console.error("Playback failed:", error);
            // setError("Failed to start playback. Please try again.");
          }
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const handleInitialPlay = () => {
    navigate(`/live/${liveId}`);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);

      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(50);
      }
    }
  };

  const destroyPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.load();
    }
  };

  const handleReplay = () => {
    destroyPlayer();
    initializePlayer();
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(
      !!(document.fullscreenElement || document.webkitFullscreenElement)
    );
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Playback failed:", error);
            setError("Failed to start playback. Please try again.");
            setIsPlaying(false);
          });
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Hi88 Live",
        text: "Hãy xem thử livestream của chúng tôi!!!",
        url: window.location.href,
      });
    }
  };

  return (
    <>
      {pathname.includes("live") && (
        <div className="w-full px-4 h-[85px] flex items-center justify-between">
          <div className="flex">
            <Avatar
              src={liveDetailData?.avatar}
              className="md:!w-16 md:!h-16 !w-12 !h-12"
            />
            <div className="flex flex-col justify-center ml-4">
              <Typography.Title
                level={2}
                className="!font-bold !text-[var(--color-brand-primary)] xl:!text-[1.0rem] lg:!text-[.7rem] !text-[.5rem]"
              >
                {liveDetailData?.title}
              </Typography.Title>
              <div className="flex items-center justify-start space-x-4">
                <Typography.Title
                  level={3}
                  className="!font-bold xl:!text-[.8rem] !text-[.6rem] !m-0 !text-[var(--color-brand-primary)]"
                >
                  {liveDetailData?.displayName}
                </Typography.Title>
                <div className="flex items-center justify-center space-x-1 text-[var(--color-brand-primary)]">
                  <FaRegEye />
                  <span>
                    {isStreaming && viewer !== 0
                      ? viewer
                      : isStreaming && liveDetailData
                      ? liveDetailData?.viewer
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className={`text-white 
              xl:text-base md:text-[12px] text-[10px] 
              flex items-center space-x-2 rounded-lg
              border-[2px] border-[#F81E02]
              py-1 px-2 animate-blink`}
            style={{
              background:
                "linear-gradient(180deg, #FB543F 0%, #F91E02 20%, #F91E02 100%)",
            }}
          >
            <FaShare className="md:text-2xl text-lg" />
            <span className="whitespace-nowrap">Chia sẻ</span>
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full ${videoLiveHeightSetting} overflow-hidden rounded-2xl`}
      >
        {!isStreaming && (
          <div className={`z-0 w-full h-full`}>
            <Flex
              vertical
              justify="center"
              align="center"
              className="w-full h-full bg-[var(--video-player-bg)]"
            >
              {!isLiveDetailLoading && !isLoading && (
                <Image src={Hanna} preview={false} loading="lazy" />
              )}
            </Flex>
          </div>
        )}

        {(isLiveDetailLoading || isLoading) && (
          <div className={`relative ${videoLiveHeightSetting}`}>
            <Spin
              size="large"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full live-detail-spinning"
            />
          </div>
        )}

        <video
          ref={videoRef}
          className={`object-contain rounded-2xl w-full ${videoLiveHeightSetting}`}
          playsInline
          muted={isMuted}
        />

        {needsInteraction && !isLiveDetailLoading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer rounded-2xl">
            <Button
              variant="outlined"
              className="md:p-6 p-2 rounded-full !bg-white/80 hover:!bg-[var(--color-brand-primary)] !text-[var(--color-brand-primary)] md:text-base text-[12px] hover:!text-white uppercase font-bold border-[var(--color-brand-primary)] hover:!border-white"
              onClick={handleInitialPlay}
            >
              Vào Phòng Live
            </Button>
          </div>
        )}

        <div className="rounded-b-2xl absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex justify-between items-center gap-4">
            <Flex gap={16}>
              {isStreaming ? (
                <>
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-gray-600"
                  >
                    {isPlaying ? (
                      <FaPause className="md:text-xl text-lg" />
                    ) : (
                      <FaPlay className="md:text-xl text-lg" />
                    )}
                  </button>
                  <button
                    onClick={handleReplay}
                    className="text-white hover:text-gray-600"
                  >
                    <FaRedo className="md:text-xl text-lg" />
                  </button>
                </>
              ) : (
                <>
                  <button className="text-white hover:text-gray-600">
                    <MdPlayDisabled className="md:text-2xl text-lg" />
                  </button>
                  <button className="text-white hover:text-gray-600">
                    <MdOutlineUpdateDisabled className="md:text-2xl text-lg" />
                  </button>
                </>
              )}
            </Flex>
            {!isStreaming && liveDetailData?.scheduleTime && (
              <Flex>
                <Countdown time={liveDetailData?.scheduleTime} />
              </Flex>
            )}
            <Flex gap={16}>
              <div ref={volumeControlRef} className="flex items-center">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-600"
                >
                  {isMuted ? (
                    <FaVolumeMute className="md:text-xl text-lg" />
                  ) : (
                    <FaVolumeUp className="md:text-xl text-lg" />
                  )}
                </button>
                <div className="w-24 h-8 rounded-lg items-center px-3 transform rotate-270 md:flex hidden">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={getVolumePercentageStyle()}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:w-3 
                        [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:bg-white 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:hover:w-4
                        [&::-webkit-slider-thumb]:hover:h-4
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-runnable-track]:rounded-lg
                        [&::-webkit-slider-runnable-track]:bg-transparent
                        [&::-moz-range-thumb]:w-3
                        [&::-moz-range-thumb]:h-3
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-track]:rounded-lg
                        [&::-moz-range-track]:bg-transparent"
                  />
                </div>
              </div>

              {isStreaming && (
                <div className="items-center px-1 gap-1 flex rounded-lg bg-red-500 text-white">
                  <CiStreamOn
                    className="text-xl animate-pulse"
                    strokeWidth={1}
                  />
                  <span className="text-[12px] uppercase">trực tiếp</span>
                </div>
              )}

              <button
                onClick={handleFullscreen}
                className="text-white hover:text-gray-600"
              >
                {isFullscreen ? (
                  <FaCompress size={20} />
                ) : (
                  <FaExpand size={20} />
                )}
              </button>
            </Flex>
          </div>
        </div>
      </div>
    </>
  );
};

export default LivestreamPlayer;
