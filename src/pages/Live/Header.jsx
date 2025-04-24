import { useCallback } from "react";
import ViewerCount from "../../components/ViewerCount";
import { Avatar, Typography } from "antd";
import { FaShare } from "react-icons/fa";
import useLiveDetail from "../../hooks/useLiveDetail";
import { useParams } from "react-router";

export default function Header() {
  const { id } = useParams();
  const { data: liveData } = useLiveDetail(id);
  const liveDetailData = liveData?.data?.data;

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Hi88 Live",
        text: "Hãy xem thử livestream của chúng tôi!!!",
        url: window.location.href,
      });
    }
  }, []);

  return (
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

            <ViewerCount />
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
  );
}
