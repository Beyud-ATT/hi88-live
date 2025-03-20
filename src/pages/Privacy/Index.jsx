import { Typography } from "antd";

export default function Privacy() {
  return (
    <div className="max-w-screen-md mx-auto text-white space-y-4">
      <Typography.Title
        level={1}
        className="!text-[var(--color-brand-primary)]"
      >
        Chính Sách Bảo Mật Thông Tin - Hi88
      </Typography.Title>
      <p>
        {" "}
        Hi88 cam kết bảo vệ quyền riêng tư của khách hàng với các tiêu chuẩn an
        toàn dữ liệu cao nhất. Dưới đây là chính sách bảo mật của chúng tôi,
        được thiết kế nhằm đảm bảo an toàn thông tin cá nhân của bạn.{" "}
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        1. Bảo Mật Thông Tin Cá Nhân tại Hi88
      </Typography.Title>{" "}
      <p>
        {" "}
        Tại Hi88, chúng tôi luôn giữ bảo mật tuyệt đối dữ liệu cá nhân của khách
        hàng. Thông tin cá nhân chỉ được tiết lộ khi: <br /> - Có yêu cầu từ cơ
        quan pháp luật hoặc lệnh từ tòa án. <br /> - Cần thiết để hoàn thành
        dịch vụ thông qua các nhà cung cấp thanh toán uy tín và cơ quan tài
        chính liên kết với Hi88.{" "}
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        2. Hệ Thống Bảo Mật Hiện Đại
      </Typography.Title>{" "}
      <p>
        {" "}
        - Tất cả thông tin cá nhân được mã hóa qua giao thức SSL 128bit, đảm bảo
        an toàn trong quá trình truyền tải dữ liệu. <br /> - Máy chủ lưu trữ dữ
        liệu đặt tại nước ngoài, được bảo vệ bởi hệ thống an ninh nghiêm ngặt,
        hạn chế tối đa truy cập trái phép.{" "}
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        3. Chính Sách Liên Lạc Qua Email
      </Typography.Title>{" "}
      <p>
        {" "}
        - Khi khách hàng không thể truy cập vào trang web của Hi88 có thể gửi
        tin nhắn trực tiếp đến email chính thức admin@Hi88.com hệ thống sẽ phản
        hồi tự động gửi đường link truy cập mới nhất.{" "}
      </p>{" "}
      <p>
        Chúng tôi cam kết không chia sẻ dữ liệu nhận dạng cá nhân của khách hàng
        với bất kỳ bên thứ ba nào.
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        Hi88 - Nơi Khách Hàng Đặt Niềm Tin
      </Typography.Title>{" "}
      <p>
        {" "}
        Với chính sách bảo mật minh bạch, hệ thống công nghệ tiên tiến và cam
        kết bảo vệ quyền lợi khách hàng, Hi88 mang đến sự an tâm tuyệt đối. Hãy
        đồng hành cùng chúng tôi để trải nghiệm dịch vụ an toàn và chuyên
        nghiệp.{" "}
      </p>
    </div>
  );
}
