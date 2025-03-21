import { Button, Col, Form, Image, Input, Row } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import PhoneInputField from "./PhoneInputField";
import { useModal } from "./CompoundModal";
import useRecaptcha from "../hooks/useRecaptcha";
import LogoImg from "../assets/logo.png";
import { inputStyle } from "./LoginForm";

export default function SignUpForm() {
  const phoneNumberRef = useRef(null);
  const { signup } = useAuth();
  const { closeModal } = useModal();
  const [form] = Form.useForm();
  const { recaptcha, validateCaptcha } = useRecaptcha();

  const onFinish = async (values) => {
    try {
      await signup(values);
      closeModal();
      form.resetFields();
    } catch (error) {
      console.error("Error in signup:", error);
    }
  };

  return (
    <div className="py-3 md:px-3 px-1">
      <div className="flex flex-col justify-center items-center mb-8">
        <Image preview={false} src={LogoImg} alt="logo" loading="lazy" />
      </div>

      <Form
        form={form}
        id="signup-form"
        name="signup"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="w-full"
        autoComplete="off"
      >
        <Row>
          <Col span={12} xs={24} md={12} className="md:pr-2">
            <Form.Item
              name="displayName"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị!" },
                {
                  validator: (_, value) => {
                    const explode = value.split(" ").length;
                    if (value.trim().length < 6) {
                      return Promise.reject(
                        "Tên hiển thị phải dài hơn 6 kí tự!"
                      );
                    } else if (explode > 2) {
                      return Promise.reject(
                        "Tên hiển thị chỉ được chứa chữ cái (bao gồm cả dấu) và khoảng trắng."
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input placeholder="Tên hiển thị" className={inputStyle} />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
                { min: 6, message: "Tên tài khoản phải dài hơn 6 kí tự!" },
                { max: 20, message: "Ten tài khoản phải dài hơn 20 kí tự!" },
              ]}
            >
              <Input
                autoComplete="new-username"
                placeholder="Tên tài khoản"
                className={inputStyle}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Email" className={inputStyle} />
            </Form.Item>
          </Col>

          <Col span={12} xs={24} md={12} className="md:pl-2">
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                {
                  validator: (_, value) => {
                    const uppercaseRegex = new RegExp("^(?=.*[A-Z])");
                    const numberRegex = new RegExp("^(?=.*[0-9])");
                    if (
                      !uppercaseRegex.test(value) ||
                      !numberRegex.test(value)
                    ) {
                      return Promise.reject(
                        "Mật khẩu phải chứa ít nhất một chữ in hoa và một số!"
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input.Password
                autoComplete="new-password"
                placeholder="Mật khẩu"
                className={inputStyle}
                iconRender={(visible) =>
                  visible ? <FaRegEye /> : <FaRegEyeSlash />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Xác nhận mật khẩu"
                className={inputStyle}
                iconRender={(visible) =>
                  visible ? <FaRegEye /> : <FaRegEyeSlash />
                }
              />
            </Form.Item>

            <Form.Item name="phone">
              <PhoneInputField
                onChange={(value) => {
                  phoneNumberRef.current = value;
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="captcha"
              rules={[
                {
                  required: true,
                  message: "Nhập mã captcha!",
                },
                {
                  validator: (_, value) => {
                    if (validateCaptcha(value, false) === true) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Captcha không hợp lệ!");
                    }
                  },
                },
              ]}
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Nhập mã captcha"
                  className={inputStyle}
                  suffix={
                    <div className="py-1 px-2 rounded-lg bg-[#879497] tracking-widest text-white font-bold">
                      {recaptcha}
                    </div>
                  }
                />
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)] shadow-none border-none rounded-lg text-lg font-medium"
          >
            Đăng ký
          </Button>
        </Form.Item>

        <div className="text-center text-black">
          Bạn đã có tài khoản?{" "}
          <span
            href="#"
            className="text-[var(--color-brand-primary)] font-bold cursor-pointer"
            onClick={() => {
              document.getElementById("login-button")?.click();
              closeModal();
            }}
          >
            Đăng nhập ngay
          </span>
        </div>

        {/* <Flex gap={8} justify="center" items="center" className="w-full my-6">
          <div className="w-full h-[0.5px] my-3 bg-[#515151]"></div>
          <p className="px-2 text-center text-[#515151]">hoặc</p>
          <div className="w-full h-[0.5px] my-3 bg-[#515151]"></div>
        </Flex>
        <Flex className="w-full" justify="center">
          <GoogleAuthProvider.GoogleLoginButton />
        </Flex> */}

        {/* <Form.Item className="mt-2">
          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-300">Lưu mật khẩu</Checkbox>
            </Form.Item>
            <a
              className="text-[var(--color-brand-primary)] hover:text-orange-400"
              href="#"
            >
              Quên mật khẩu
            </a>
          </div>
        </Form.Item> */}
      </Form>
    </div>
  );
}
