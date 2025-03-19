import { Flex, Image } from "antd";
import { useLayoutContext } from "../Index";
import { Link } from "react-router";
import Dimaria from "../../assets/dimaria.png";

import {
  Footer1,
  Footer3,
  Footer4,
  Footer5,
  Footer6,
  Footer7,
  Footer8,
  Footer9,
  Footer10,
  Footer11,
  Footer12,
  Footer2,
  DiMariaSignature,
} from "../../utils/svg";
import Description from "./Description";

export default function BaseFooter() {
  const { Footer } = useLayoutContext();

  return (
    <>
      <Footer
        className="lg:block hidden bg-[url('./src/assets/footer-bg.webp')] bg-cover bg-no-repeat bg-opacity-10 mt-20"
        style={{
          background: `linear-gradient(0deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.75) 100%), url('./src/assets/footer-bg.webp') lightgray 0px -134.601px / 100% 285.714% no-repeat`,
        }}
      >
        <Flex
          vertical
          justify="center"
          align="center"
          className="max-w-screen-xl mx-auto mt-6 text-[var(--text-color)]"
          gap={26}
        >
          <div className="w-full grid grid-cols-2">
            <div className="flex flex-col gap-12 justify-end align-center max-w-lg mx-auto">
              <Description />
              <Flex
                gap={4}
                align="center"
                justify="space-between"
                className="w-full"
              >
                <Footer1 />
                <Footer2 />
                <Footer3 />
                <Footer4 />
                <Footer5 />
                <Footer6 />
              </Flex>
            </div>

            <div className="flex flex-col gap-10 max-w-lg mx-auto">
              <div className="flex justify-center align-center gap-10">
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="capitalize font-bold text-[30px] text-[var(--color-brand-primary)]">
                    Đại sứ thương hiệu
                  </p>
                  <div className="flex gap-10">
                    <div className="flex flex-col gap-1">
                      <p>Angel Di Maria </p>
                      <p>Năm 2024 - 2025</p>
                    </div>
                    <div>
                      <DiMariaSignature />
                    </div>
                  </div>
                </div>
                <Image
                  preview={false}
                  src={Dimaria}
                  alt="image"
                  loading="lazy"
                  className="overflow-hidden rounded-full"
                />
              </div>
              <Flex
                gap={4}
                align="center"
                justify="space-between"
                className="w-full"
              >
                <Footer7 />
                <Footer8 />
                <Footer9 />
                <Footer10 />
                <Footer11 />
                <Footer12 />
              </Flex>
            </div>
          </div>

          <Flex
            gap={4}
            align="center"
            justify="space-between"
            className="w-full"
          >
            <Link to="/rule" className="xl:text-[16px] text-[12px]">
              Điều Khoản Và Điều Kiện
            </Link>
            <span>|</span>
            <Link to="#" className="xl:text-[16px] text-[12px]">
              Giới Thiệu Về NEW88
            </Link>
            <span>|</span>
            <Link to="#" className="xl:text-[16px] text-[12px]">
              Chơi Có Trách Nhiệm
            </Link>
            <span>|</span>
            <Link to="#" className="xl:text-[16px] text-[12px]">
              Miễn Trách Nhiệm
            </Link>
            <span>|</span>
            <Link to="#" className="xl:text-[16px] text-[12px]">
              Quyền Riêng Tư Tại NEW88
            </Link>
            <span>|</span>
            <Link to="#" className="xl:text-[16px] text-[12px]">
              Những Câu Hỏi Thường Gặp
            </Link>
          </Flex>
        </Flex>
      </Footer>
      <div className="text-center xl:!text-lg !text-sm bg-[var(--color-brand-primary-lighter)]">
        Copyright © Trang chủ chính thức giải trí Hi88 Reserved
      </div>
    </>
  );
}
