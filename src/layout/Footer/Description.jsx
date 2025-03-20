import { Flex, Image } from "antd";
import FooterLogo from "../../assets/footer-logo.png";
import { useState } from "react";

export default function Description() {
  const [showMore, setShowMore] = useState(false);

  return (
    <Flex vertical gap={36}>
      <Flex align="center" justify="center" gap={2}>
        <Image preview={false} src={FooterLogo} alt="logo" loading="lazy" />
      </Flex>
      {!showMore ? (
        <p className="max-w-2xl text-sm text-justify">
          <span className="font-bold">Hi88</span> là một nhà cái có giấy phép cá
          cược trực tuyến hợp pháp do Isle of Man và Khu kinh tế Cagayan and
          Freeport cấp. Với bề dày kinh nghiệm và danh tiếng phục vụ hơn 10
          triệu người,...
          <span
            className="cursor-pointer hover:underline pl-2"
            onClick={() => setShowMore((state) => !state)}
          >
            Xem Thêm
          </span>
        </p>
      ) : (
        <p className="max-w-2xl text-sm text-justify">
          <span className="font-bold">Hi88 </span>là một nhà cái có giấy phép cá
          cược trực tuyến hợp pháp do Isle of Man và Khu kinh tế Cagayan and
          Freeport cấp. Với bề dày kinh nghiệm và danh tiếng phục vụ hơn 10
          triệu người chơi, Hi88 đã và đang khẳng định vị thế của mình trên thị
          trường game trực tuyến. Với tư cách là một công ty trò chơi trực tuyến
          có trụ sở tại Luân Đôn, Anh, sở hữu đội ngũ nhân tài chuyên nghiệp
          đông đảo cung cấp sản phẩm phục vụ chất lượng cao. Hi88 đảm bảo không
          tiết lộ thông tin cá nhân khách hàng cho bất kỳ bên thứ ba nào, sử
          dụng tiêu chuẩn mã hoá dữ liệu ở mức cao nhất. Tất cả thông tin cá
          nhân đều được thông qua hệ thống bảo mật - Secure Socket (Chuẩn mã hóa
          SS 128-bit), đồng thời được bảo vệ trong môi trường quản lý an toàn
          đảm bảo không thể truy cập từ các khu vực mạng công cộng. Tất cả dữ
          liệu ra vào đều bị hạn chế, giám sát nghiêm ngặt và quản lý chặt chẽ
          nhằm mang đến cho người chơi trải nghiệm người dùng an toàn tuyệt đối.
          <span
            className="cursor-pointer hover:underline pl-2"
            onClick={() => setShowMore((state) => !state)}
          >
            Thu gọn
          </span>
        </p>
      )}
    </Flex>
  );
}
