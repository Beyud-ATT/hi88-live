import { Flex, Image } from "antd";
import Banner from "../../assets/banner-main.gif";
import DownloadNow from "../../assets/download-now.png";
import { Link } from "react-router";

export default function BannerSection() {
  return (
    <div>
      <Flex className="w-full">
        <Flex className="md:w-[80%] w-full">
          <Image
            src={Banner}
            alt="Banner Main"
            loading="lazy"
            preview={false}
          />
        </Flex>
        <Flex justify="end" className="w-[20%] md:block hidden">
          <Flex
            vertical
            justify="space-around"
            align="center"
            className="h-full w-[85%] mx-auto"
          >
            <Link to="https://hi88app77.com" target="_blank">
              <Image
                src={DownloadNow}
                alt="Download Now"
                className="w-full"
                loading="lazy"
                preview={false}
              />
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
