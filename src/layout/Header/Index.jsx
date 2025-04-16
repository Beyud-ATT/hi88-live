import { Flex, Image } from "antd";
import { useLayoutContext } from "../Index";
import Logo from "../../components/Logo";
import TopNav from "./PC/TopNav";
import GroupButton from "./GroupButton";
import Marquee from "react-fast-marquee";
import Speaker from "../../assets/speaker.png";
import BurgerTopNav from "./Mobile/BurgerTopNav";
import { Link } from "react-router";
import DeviceProvider from "../../contexts/ResponsiveContext";
import UserActionDrawer from "./Mobile/UserActionDrawer";
import UserActionDropdown from "./PC/UserActionDropdown";

export default function BaseHeader({ ...rest }) {
  const { Header } = useLayoutContext();
  return (
    <Header {...rest}>
      <Flex
        justify="space-between"
        align="center"
        className="max-w-screen-xl mx-auto py-2 xl:pr-0 xl:pl-0 lg:pr-8 lg:pl-6 pr-4 pl-2"
      >
        <DeviceProvider.MOBILE>
          <BurgerTopNav />
        </DeviceProvider.MOBILE>
        <Link to="/">
          <Logo />
        </Link>

        <DeviceProvider.PC>
          <TopNav />
          <UserActionDropdown />
        </DeviceProvider.PC>

        <DeviceProvider.TABLET>
          <TopNav />
          <UserActionDrawer />
        </DeviceProvider.TABLET>

        <GroupButton />
        <DeviceProvider.MOBILE>
          <UserActionDrawer />
        </DeviceProvider.MOBILE>
      </Flex>

      <div className="bg-[var(--color-brand-primary)]">
        <Flex
          className="h-[42px] max-w-screen-xl md:mx-auto md:w-full w-[95vw]"
          justify="center"
          align="center"
        >
          <Flex className="h-full" align="center">
            <Link to="" target="_blank">
              <Flex align="center" justify="center" className="md:px-4 px-2">
                <Image
                  src={Speaker}
                  alt="speaker icon"
                  loading="lazy"
                  preview={false}
                  width={24}
                  height={24}
                  className="-rotate-12"
                />
              </Flex>
            </Link>
          </Flex>
          <Marquee className="text-[white] overflow-hidden">
            <span>
              Hi88 Kính Chào Qúy Khách! Link dễ nhớ: hi88y.com; hi88r.com;
              111555.com 📞📞Hotline: 0706777788 📧 Gmail: admin@hi88.com
              ⭐️Kênh thông báo: https://t.me/addlist/hncLZIgPKzkyZWU1⭐️
              Fanpage:https://www.facebook.com/GiaiTriiHi88 💥Nạp đầu tặng 100%
              Nổ hũ bắn cá 💥 Tải APP Đăng ký tặng 58k
            </span>
          </Marquee>
        </Flex>
      </div>
    </Header>
  );
}
