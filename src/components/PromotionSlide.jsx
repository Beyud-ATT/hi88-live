import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "tailwindcss/tailwind.css";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Flex, Image, Typography } from "antd";
import KM1 from "../assets/KM1.png";
import KM2 from "../assets/KM2.png";
import KM3 from "../assets/KM3.png";

const slides = [
  {
    id: 1,
    image: KM1, // Replace with actual image URL
    title: "HOÀN TRẢ TIỀN MIỄN 30%",
  },
  {
    id: 2,
    image: KM2, // Replace with actual image URL
    title: "VÒNG QUAY MAY MẮN",
  },
  {
    id: 3,
    image: KM3, // Replace with actual image URL
    title: "LÌ XÌ TẾT NGUYÊN ĐÁN",
  },
  {
    id: 4,
    image: KM2, // Replace with actual image URL
    title: "LÌ XÌ TẾT NGUYÊN ĐÁN TỴ",
  },
];

const PromotionSlider = () => {
  const swiperRef = useRef(null);

  return (
    <div className="rounded-lg relative">
      <Flex justify="center" align="center" className="mb-3 mt-9">
        <Typography.Title
          level={3}
          className="!text-[var(--color-brand-primary)] md:text-base !text-xl font-semibold"
        >
          CODE KHUYẾN MÃI
        </Typography.Title>
        <Flex
          gap={8}
          justify="center"
          align="center"
          className="absolute right-0 md:flex hidden"
        >
          <button
            className="text-white p-2 rounded-full hover:bg-gray-700 border border-[#333741]"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <GoArrowLeft className="text-xl font-bold" />
          </button>
          <button
            className="text-white p-2 rounded-full hover:bg-gray-700 border border-[#333741]"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <GoArrowRight className="text-xl font-bold" />
          </button>
        </Flex>
      </Flex>
      <Swiper
        spaceBetween={20}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full"
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="rounded-lg overflow-hidden">
            <Image
              src={slide.image}
              alt={slide.title}
              className="rounded-lg mb-4 w-full"
              preview={false}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PromotionSlider;
