import { Typography } from "antd";

export default function Rule() {
  return (
    <div className="max-w-screen-md mx-auto text-white">
      <Typography.Title
        level={1}
        className="!text-[var(--color-brand-primary)]"
      >
        Điều Khoản &amp; Điều Kiện Hi88
      </Typography.Title>
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        1. Các quy định về tài khoản
      </Typography.Title>
      <p>
        {" "}
        Khi người chơi đăng ký sử dụng Hi88, điều này đồng nghĩa với việc người
        chơi đã đọc, hiểu và đồng ý các quy định, điều khoản, và quy tắc tại
        Hi88.{" "}
      </p>{" "}
      <p>
        {" "}
        - Cam kết cung cấp thông tin chính xác: Người chơi phải đảm bảo rằng
        tên, email, số điện thoại, và các thông tin cá nhân trùng khớp với giấy
        tờ tùy thân và tài khoản ngân hàng.
        <br /> - Vi phạm quy định: Hi88 có quyền từ chối phục vụ, đóng băng tài
        khoản và xử lý tùy và mức độ vi phạm nghiêm trọng.
        <br /> - Tranh chấp: Người chơi nên theo dõi quá trình chơi và kiểm tra
        thông tin tài khoản trước khi kết thúc.
        <br /> - Nhiều tài khoản: Hi88 có quyền đóng hoặc giữ lại một tài khoản
        duy nhất.
        <br /> - Quyết định cuối cùng: Trong bất kỳ trường hợp nào, quyết định
        của Hi88 là quyết định cuối cùng.{" "}
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        2. Các quy định về tiền gửi
      </Typography.Title>{" "}
      <p>
        {" "}
        - Tiền gửi tối thiểu: 50.000 VND.
        <br /> - Thông báo giao dịch: Người chơi phải thông báo ngay khi phát
        hiện giao dịch chưa được xác nhận.
        <br /> - Tiền gửi qua bên thứ 3: Liên hệ ngay với bộ phận CSKH để xác
        nhận giao dịch.
        <br /> - Quyết định cuối cùng: Hi88 không chịu trách nhiệm nếu giao dịch
        không được xác nhận.{" "}
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        3. Quy định rút tiền
      </Typography.Title>{" "}
      <p>
        {" "}
        - Hạn mức rút tiền: Tối thiểu 100.000 VND/lần, tối đa 10 tỷ/ngày.
        <br /> - Khách hàng VIP: Hạn mức rút tiền cao hơn.
        <br /> - Thời gian xử lý: Trong vòng 3~5 phút, trừ trường hợp bảo trì hệ
        thống.{" "}
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        4. Quy định khuyến mãi
      </Typography.Title>{" "}
      <p>
        {" "}
        - Tuân thủ điều kiện: Người chơi phải tuân thủ các điều kiện kèm theo
        khuyến mãi.
        <br /> - Hạn chế khuyến mãi: Mỗi người chơi chỉ nhận ưu đãi khi gửi yêu
        cầu xác thực.
        <br /> - Sử dụng khuyến mãi không trung thực: Hi88 có quyền hủy và thu
        hồi khuyến mãi mà không cần báo trước.
        <br /> - Thay đổi chương trình: Hi88 có quyền chỉnh sửa hoặc chấm dứt
        chương trình khuyến mãi bất kỳ lúc nào.{" "}
      </p>{" "}
      <Typography.Title
        level={2}
        className="!text-[var(--color-brand-primary)]"
      >
        5. Quyền hạn sử dụng
      </Typography.Title>{" "}
      <p>
        {" "}
        Người chơi khi tham gia Hi88 đã đồng ý với toàn bộ điều khoản, quy tắc
        và dịch vụ. Hi88 có quyền thay đổi điều khoản nhằm phù hợp với hoạt động
        kinh doanh và phù hợp với các yêu cầu của thị trường game trực tuyến.{" "}
      </p>
    </div>
  );
}
