import { Flex, Layout } from "antd";
import { Outlet, useLocation } from "react-router";
import BaseFooter from "./Footer/Index";
import BaseContent from "./Content";
import BaseHeader from "./Header/Index";
import { createContext, useContext } from "react";
// import MobileFooter from "./Footer/Mobile";
import { useDevice } from "../contexts/ResponsiveContext";

const LayoutContext = createContext();

function BaseLayout() {
  const { Header, Footer, Sider, Content } = Layout;
  const isUserPage = useLocation().pathname.includes("user");
  const isLiveMobilePage = useLocation().pathname.includes("live-mobile");
  const isLivePage = useLocation().pathname.includes("live");
  const isShow = !isUserPage && !isLiveMobilePage && !isLivePage;
  const { deviceType } = useDevice();
  // const isMobile =
  //   (deviceType === screenType.MOBILE || deviceType === screenType.TABLET) &&
  //   !isLiveMobilePage &&
  //   !isLivePage &&
  //   !isUserPage;

  return (
    <LayoutContext.Provider value={{ Header, Footer, Sider, Content }}>
      <Flex gap="middle" className="min-h-dvh" wrap>
        <Layout>
          <BaseHeader
            className={`w-full ${
              isLiveMobilePage
                ? "hidden opacity-0 invisible"
                : "block opacity-100 visible"
            }`}
          />
          <BaseContent
            className={` ${
              isShow ? "lg:px-8 px-4 md:pt-4 pt-2" : ""
            } overflow-y-auto`}
          >
            <Outlet />
          </BaseContent>
          {isShow && <BaseFooter />}
          {/* {isMobile && <MobileFooter />} */}
        </Layout>
      </Flex>
    </LayoutContext.Provider>
  );
}

function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
}

export { BaseLayout, useLayoutContext };
