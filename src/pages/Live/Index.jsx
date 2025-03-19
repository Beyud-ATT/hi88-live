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
import LiveTabs from "./LiveTabs";
import IdolRating from "../../components/IdolRating";

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
          <LivestreamPlayer liveId={id} />
        </Col>
        <Col
          xs={{ flex: "100%" }}
          md={{ flex: "35%" }}
          lg={{ flex: "35%" }}
          xl={{ flex: "30%" }}
          className="!overflow-hidden"
        >
          <LiveTabs />
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
      <div>
        <IdolRating />
      </div>
      <div className="md:mt-8 mt-2">
        <NewsTab />
      </div>
    </div>
  );
};

export default LivestreamDetail;
