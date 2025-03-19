import { Col, Flex, Row, Typography } from "antd";
import { useLayoutContext } from "../Index";
import {
  Adult,
  BeGamble,
  Follow1,
  Follow2,
  GameCare,
  Lisence11,
  Lisence12,
  Lisence13,
  Lisence21,
  Lisence22,
  Protect11,
  Protect22,
} from "../../utils/svg";

export default function MobileFooter() {
  const { Footer } = useLayoutContext();

  return (
    <Footer className="lg:hidden block px-6">
      <Flex vertical gap={24} className="max-w-screen-sm mx-auto">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Flex vertical gap={4} className="pt-4">
              <Typography.Title
                level={5}
                className="!text-[var(--video-player-bg)] !font-bold capitalize !mb-0"
              >
                Đại Sứ Thương Hiệu
              </Typography.Title>
              <Flex vertical>
                <p>Iniesta</p>
                <p>Năm 2024 - 2025</p>
              </Flex>
            </Flex>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Flex vertical gap={10}>
              <p className="capitalize !text-[var(--video-player-bg)] text-[15px]">
                giấy phép
              </p>
              <div className="md:w-[60%] w-full space-y-2">
                <Row>
                  <Col span={8}>
                    <Lisence11 />
                  </Col>
                  <Col span={8}>
                    <Lisence12 />
                  </Col>
                  <Col span={8}>
                    <Lisence13 />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Lisence21 />
                  </Col>
                  <Col span={12}>
                    <Lisence22 />
                  </Col>
                </Row>
              </div>
            </Flex>
          </Col>

          <Col span={12}>
            <Flex vertical gap={12} className="pl-6 md:items-end items-start">
              <p className="capitalize !text-[var(--video-player-bg)] text-[15px]">
                bảo vệ
              </p>
              <Flex vertical gap={12} className="md:items-end items-start">
                <Protect11 />
                <Protect22 />
              </Flex>
            </Flex>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Flex vertical gap={8}>
              <p className="capitalize !text-[var(--video-player-bg)] text-[15px]">
                theo dõi chúng tôi
              </p>
              <Row className="md:w-[60%] w-full">
                <Col span={6}>
                  <Follow1 />
                </Col>
                <Col span={6}>
                  <Follow2 />
                </Col>
              </Row>
            </Flex>
          </Col>

          <Col span={12}>
            <Flex vertical className="pl-6 md:items-end items-start" gap={8}>
              <p className="capitalize !text-[var(--video-player-bg)] text-[15px]">
                chơi có trách nhiệm
              </p>
              <Flex gap={20}>
                <Adult />
                <GameCare />
                <BeGamble />
              </Flex>
            </Flex>
          </Col>
        </Row>
      </Flex>

      <Flex vertical align="center">
        <Typography.Title
          level={4}
          className="!text-[var(--video-player-bg)] text-center pt-6 !font-bold "
        >
          Hi88 - NỀN TẢNG CÁ CƯỢC TRỰC TUYẾN CHẤT LƯỢNG CAO
        </Typography.Title>
        <p className="text-justify">
          Hi88 là một nhà cái có giấy phép cá cược trực tuyến hợp pháp do Isle
          of Man và Khu kinh tế Cagayan and Freeport cấp. Với bề dày kinh nghiệm
          và danh tiếng phục vụ hơn 10 triệu người chơi, Hi88 đã và đang khẳng
          định vị thế của mình trên thị trường game trực tuyến. Với tư cách là
          một công ty trò chơi trực tuyếncó trụ sở tại Luân Đôn, Anh, sở hữu đội
          ngũ nhân tài chuyên nghiệp đông đảo cung cấp sản phẩm phục vụ chất
          lượng cao. Hi88 đảm bảo không tiết lộ thông tin cá nhân khách hàng cho
          bất kỳ bên thứ ba nào, sử dụng tiêu chuẩn mã hoá dữ liệu ở mức cao
          nhất. Tất cả thông tin cá nhân đều được thông qua hệ thống bảo mật -
          Secure Socket (Chuẩn mã hóa SS 128-bit), đồng thời được bảo vệ trong
          môi trường quản lý an toàn đảm bảo không thể truy cập từ các khu vực
          mạng công cộng. Tất cả dữ liệu ra vào đều bị hạn chế, giám sát nghiêm
          ngặt và quản lý chặt chẽ nhằm mang đến cho người chơi trải nghiệm
          người dùng an toàn tuyệt đối.
        </p>
      </Flex>
    </Footer>
  );
}
