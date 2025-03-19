import { useState, useRef, useEffect } from "react";
import flvjs from "flv.js";
import Hls from "hls.js";
import { Flex, Image, Spin } from "antd";
import useLiveDetail from "../hooks/useLiveDetail";
import dayjs from "dayjs";
import {
  FaPause,
  FaPlay,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { MdOutlineUpdateDisabled, MdPlayDisabled } from "react-icons/md";
import { useSignalR } from "../contexts/SIgnalRContext";
import { CiStreamOn } from "react-icons/ci";

const LivestreamPlayerMobile = ({ liveId }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const volumeControlRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);

  const { streamsInfo } = useSignalR();
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

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  useEffect(() => {
    if (isLiveDetailLoading) return;

    if (flvUrl || hlsUrl) {
      initializePlayer();
    }
  }, [flvUrl, hlsUrl]);

  useEffect(() => {
    if (liveDetailData?.isStreaming) {
      setIsLive(true);
      return;
    }

    const intervalId = setInterval(() => {
      if (liveDetailData?.scheduleTime) {
        if (dayjs().isAfter(dayjs(liveDetailData?.scheduleTime))) {
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      }
    }, 1000);

    if (liveDetailData?.isStreaming) clearInterval(intervalId);

    return () => clearInterval(intervalId);
  }, [liveDetailData]);

  const initializePlayer = () => {
    setIsLoading(true);

    // Check if FLV is available and preferred
    if (flvUrl && !isIOS) {
      // console.log("Attempting to play FLV:", flvUrl);
      // console.log("FLV.js Support:", flvjs.isSupported());
      // console.log("Video element ready:", videoRef.current);
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
      console.error("No HLS streaming URL available");
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
                console.error("Network error occurred. Retrying...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Media error occurred. Recovering...");
                hls.recoverMediaError();
                break;
              default:
                console.error("Fatal streaming error occurred");
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
        console.error("HLS playback is not supported in this browser");
      }
    } catch (error) {
      console.error("HLS initialization error:", error);
      console.error("Failed to initialize HLS player");
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
          console.error("Stream error occurred. Retrying...");
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
        console.error("FLV playback is not supported in this browser");
      }
    } catch (error) {
      console.error("Failed to initialize FLV player", error);
    }
  };

  const startPlayback = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
          setIsLoading(false);
        });
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
            console.error("Failed to start playback. Please try again.");
            setIsPlaying(false);
          });
      }
    }
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

  const getVolumePercentageStyle = () => {
    return {
      background: `linear-gradient(to right, white ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%)`,
    };
  };

  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center`}
    >
      {!isStreaming && (
        <div className={`absolute z-0 w-full h-full`}>
          <Flex
            vertical
            justify="center"
            align="center"
            className="w-full h-full"
          >
            {!isLiveDetailLoading && !isLoading && (
              <Image
                src={
                  liveDetailData?.thumbnail ??
                  "https://newlive.sgp1.cdn.digitaloceanspaces.com/newlive/photo_2025-01-27_19-07-46.jpg"
                }
                preview={false}
                loading="lazy"
              />
            )}
          </Flex>
        </div>
      )}

      {(isLiveDetailLoading || isLoading) && (
        <div className={`relative`}>
          <Spin
            size="large"
            className="absolute top-1/2 left-1/2 -translate-x-[90%] -translate-y-2/3 live-detail-spinning"
          />
        </div>
      )}

      <video
        ref={videoRef}
        className={`object-contain w-full h-full`}
        playsInline
        muted={isMuted}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex justify-between items-center gap-4">
          <Flex gap={16}>
            {isStreaming ? (
              <>
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-gray-200"
                >
                  {isPlaying ? (
                    <FaPause className="md:text-xl text-lg" />
                  ) : (
                    <FaPlay className="md:text-xl text-lg" />
                  )}
                </button>
                <button
                  onClick={handleReplay}
                  className="text-white hover:text-gray-200"
                >
                  <FaRedo className="md:text-xl text-lg" />
                </button>
              </>
            ) : (
              <>
                <button className="text-white hover:text-gray-200">
                  <MdPlayDisabled className="md:text-2xl text-lg" />
                </button>
                <button className="text-white hover:text-gray-200">
                  <MdOutlineUpdateDisabled className="md:text-2xl text-lg" />
                </button>
              </>
            )}
          </Flex>
          <Flex gap={16}>
            <div ref={volumeControlRef} className="flex items-center">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-200"
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
                <CiStreamOn className="text-xl animate-pulse" strokeWidth={1} />
                <span className="text-[12px] uppercase">trực tiếp</span>
              </div>
            )}
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default LivestreamPlayerMobile;
