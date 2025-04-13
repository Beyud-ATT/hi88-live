import { Image, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import useHomeNews from "../hooks/useHomeNews";

import DefaultBanner from "../assets/default-banner.webp";

function NewsTab() {
  const [activeTab, setActiveTab] = useState(null);
  const { data } = useHomeNews();
  // const news = data?.data?.data;
  const news = useMemo(
    () => [
      {
        title: "Sự kiện hot xem livestream bốc iphone: 20H-23H THỨ 5 HÀNG TUẦN",
        content: DefaultBanner,
        description: "",
        id: `tab1`,
      },
    ],
    []
  );
  let i = 1;

  const homeNews = useMemo(() => {
    return news
      ? news?.map((item) => {
          return {
            title: item.title,
            content: item.content,
            description: "",
            id: `tab${i++}`,
          };
        })
      : [];
  }, [news, i]);

  useEffect(() => {
    setActiveTab(homeNews[0]?.id);
  }, [homeNews]);

  return (
    <div className="border p-6 border-[var(--color-brand-primary)] rounded-lg">
      <Typography.Title
        level={3}
        className="bg-[var(--color-brand-primary)] !text-white text-center py-3 mb-2 font-bold md:!text-xl !text-sm rounded-lg"
      >
        TIN TỨC
      </Typography.Title>
      <div className="flex md:flex-row flex-col gap-8 mt-4">
        {/* Left side - Tab buttons */}
        <div className="md:w-[30%] w-full">
          {homeNews.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left md:p-4 p-2 relative`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity duration-200 ${
                  activeTab === tab.id
                    ? "bg-[var(--color-brand-primary)]"
                    : "bg-[#F2F4F7]"
                }`}
              />
              <h3
                className={`font-bold mb-1 text-[var(--color-brand-primary)] lg:text-[14px] text-[10px] uppercase`}
              >
                {tab.title}
              </h3>
              <p className="text-sm text-gray-400">{tab.description}</p>
            </button>
          ))}
        </div>

        {/* Right side - Content */}
        <div className="flex w-full justify-center items-center">
          {/* {parse(tabData.find((tab) => tab.id === activeTab)?.content)} */}
          <Image
            src={homeNews.find((tab) => tab.id === activeTab)?.content}
            preview={false}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default NewsTab;
