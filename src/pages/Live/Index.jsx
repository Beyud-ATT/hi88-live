import { Row, Col } from "antd";
// import TopInteraction from "../../components/TopInteraction";
// import OnlineTable from "../../components/OnlineTable";
// import PromotionSlider from "../../components/PromotionSlide";
// import IdolHot from "../../components/IdolTop";
import NewsTab from "../../components/NewsTab";
import LivestreamPlayer from "../../components/VideoPlayer";
import { useNavigate, useParams } from "react-router";
import { screenType, useDevice } from "../../contexts/ResponsiveContext";
import { useEffect } from "react";
import { ChatInterface } from "./Chat";
import Header from "./Header";

const LivestreamDetail = ({ ...props }) => {
  const { id } = useParams();
  const { deviceType } = useDevice();
  const isMobile = deviceType !== screenType.MOBILE;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobile) {
      navigate(`/live-mobile/${id}`);
    }
  }, [isMobile, id, navigate]);

  return (
    <div className="max-w-screen-xl mx-auto pt-4">
      <Row>
        <Col
          xs={{ flex: "100%" }}
          md={{ flex: "65%" }}
          lg={{ flex: "65%" }}
          xl={{ flex: "70%" }}
        >
          <Header />
          <LivestreamPlayer liveId={id} />
        </Col>
        <Col
          xs={{ flex: "100%" }}
          md={{ flex: "35%" }}
          lg={{ flex: "35%" }}
          xl={{ flex: "30%" }}
          className="!overflow-hidden px-2"
        >
          <div className="w-full h-fit border border-[var(--color-brand-primary)] rounded-xl">
            <div className="uppercase bg-[var(--color-brand-primary)] text-[#F8E54F] text-xl rounded-t-lg text-center font-bold py-[10px]">
              bình luận
            </div>
            <ChatInterface />
          </div>
        </Col>
      </Row>
      {/* <div className="mt-16">
        <TopInteraction />
      </div>
      <div className="mt-11">
        <OnlineTable />
      </div> */}
      {/* <div className="mt-3">
        <PromotionSlider />
      </div> */}
      {/* <div>
        <IdolHot />
      </div> */}
      <div className="md:mt-8 mt-2">
        <NewsTab />
      </div>
    </div>
  );
};

export default LivestreamDetail;
