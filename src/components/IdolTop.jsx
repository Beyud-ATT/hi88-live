import React from "react";
import { Row, Col, Typography } from "antd";
import "tailwindcss/tailwind.css";
import { FaDiamond } from "react-icons/fa6";

const IdolHot = () => {
  /**
   * The API here need to have to be numbered controlled
   */
  const idols = Array(11).fill({
    name: "MIA",
    followers: "10k Follower",
    image: "https://example.com/image.png", // Replace with actual image URL
  });
  const bgGradientStyle = `bg-gradient-to-b from-[#FFB400] via-[var(--color-brand-primary)] to-[#FF276C]`;

  const titleLineStyle = `${bgGradientStyle} h-[3px] w-[15%]`;

  return (
    <div className="bg-[#060613] p-6 rounded-lg">
      <div className="text-center mb-6">
        <div className="relative flex items-center justify-center">
          <div
            className={`${titleLineStyle} -translate-y-1 translate-x-1`}
          ></div>
          <div className="relative -translate-y-1">
            <FaDiamond className="w-4 h-4 text-[var(--color-brand-primary)]" />
          </div>
          <Typography.Title
            level={2}
            className="!text-white text-3xl font-bold tracking-wider px-4"
          >
            IDOL HOT
          </Typography.Title>
          <div className="relative -translate-y-1">
            <FaDiamond className="w-4 h-4 text-[var(--color-brand-primary)]" />
          </div>
          <div
            className={`${titleLineStyle} -translate-y-1 -translate-x-1`}
          ></div>
        </div>
      </div>

      {/* Idol Grid */}
      <Row gutter={[24, 24]} justify="center">
        {idols.map((idol, index) => (
          <React.Fragment key={index}>
            <Col key={index} sm={8} md={6} lg={4} className="text-center">
              {/* Avatar */}
              <div className="w-20 h-20 mb-2 mx-auto relative">
                <img
                  src={idol.image}
                  alt={idol.name}
                  className="w-full h-full rounded-full border-2 border-orange-500 object-cover"
                />
              </div>
              {/* Name */}
              <span className="text-white text-sm font-semibold block">
                {idol.name}
              </span>
              {/* Followers */}
              <span className="text-gray-400 text-xs block">
                {idol.followers}
              </span>
            </Col>
          </React.Fragment>
        ))}
      </Row>
    </div>
  );
};

export default IdolHot;
