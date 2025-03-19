import React from "react";
import { useSwiper, Swiper, SwiperSlide } from "swiper/react";
import { Avatar } from "antd";
import "swiper/css";

// Navigation buttons component
const NavigationButtons = ({ swiper }) => {
  return (
    <div className="absolute right-0 top-0 flex gap-2">
      <button
        onClick={() => swiper.slidePrev()}
        className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
      >
        <span className="text-white">&larr;</span>
      </button>
      <button
        onClick={() => swiper.slideNext()}
        className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
      >
        <span className="text-white">&rarr;</span>
      </button>
    </div>
  );
};

// Top users data
const topUsers = [
  { id: 1, name: "ANNA", followers: "10k", avatar: "/api/placeholder/50/50" },
  { id: 2, name: "JOHAN", followers: "10k", avatar: "/api/placeholder/50/50" },
  { id: 3, name: "ROBERT", followers: "10k", avatar: "/api/placeholder/50/50" },
  { id: 4, name: "RIAAN", followers: "10k", avatar: "/api/placeholder/50/50" },
  { id: 5, name: "ANI", followers: "10k", avatar: "/api/placeholder/50/50" },
];

const TopInteraction = () => {
  const [swiper, setSwiper] = React.useState(null);

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400 text-2xl">⭐</span>
        <h2 className="text-white text-lg font-medium">
          Bảng xếp hạng TOP Tương Tác
        </h2>
      </div>

      <div className="relative">
        <Swiper
          onSwiper={(swiperInstance) => setSwiper(swiperInstance)}
          slidesPerView={4}
          spaceBetween={16}
          className="relative"
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 4 },
          }}
        >
          {topUsers.map((user) => (
            <SwiperSlide key={user.id}>
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatar}
                    size={40}
                    className="border-2 border-yellow-400 w-[70%] h-[70%]"
                  />
                  <div>
                    <h3 className="text-white font-medium md:text-lg text-[11px]">
                      {user.name}
                    </h3>
                    <div className="flex md:flex-row flex-col md:items-center md:gap-1 gap-0">
                      <span className="text-gray-400 md:text-sm text-[8px]">
                        Follower
                      </span>
                      <span className="text-white font-medium text-[16px]">
                        {user.followers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {swiper && (
          <div className="absolute right-0 top-[-40px]">
            <NavigationButtons swiper={swiper} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopInteraction;
