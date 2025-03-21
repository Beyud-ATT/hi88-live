import { Col, Flex, Row } from "antd";
import LeftNav from "./LeftNav";

import { Outlet } from "react-router";
import DeviceProvider from "../../contexts/ResponsiveContext";
import useAccount from "../../hooks/useAccount";
import { UserProfileFrame } from "../../components/UserProfileFrame";

export default function User() {
  const { data: res } = useAccount();
  const accoutnData = res?.data?.data;

  return (
    <Flex className="max-w-screen-xl mx-auto">
      <DeviceProvider.PC>
        <LeftNav />
      </DeviceProvider.PC>
      <div className="flex-1">
        {/* Profile Header */}
        <DeviceProvider.PC>
          <div className="flex items-center bg-[var(--color-brand-primary-lighter-3)] h-[120px]"></div>
        </DeviceProvider.PC>

        {/* Content Area */}
        <div id="user-content" className="w-full md:h-auto min-h-screen">
          <Row className="h-full">
            {/* Profile Information */}
            <Col span={24} xs={24} md={24} lg={24} xl={16}>
              <div className="flex lg:flex-row flex-col items-center justify-center gap-4 lg:mb-0 mb-4">
                <div className="lg:-translate-y-1/4">
                  <UserProfileFrame data={accoutnData} />
                </div>
                <div className="flex flex-col justify-end lg:text-left text-center space-y-3 text-[var(--color-brand-primary)]">
                  <h2 className="text-xl font-bold">
                    {accoutnData?.displayName || "User Name"}
                  </h2>
                  {/* <p className="text-gray-400">
                      Donate: <span>10,200,000</span> | Số dư chuyển đổi:{" "}
                      <span>10,200,000</span>
                    </p> */}
                </div>
              </div>
            </Col>

            {/* Place where you want to change content */}
            <Col span={24} xs={24} md={24} lg={24} xl={24}>
              <div className="flex flex-col items-center justify-center h-full">
                <Outlet />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Flex>
  );
}
