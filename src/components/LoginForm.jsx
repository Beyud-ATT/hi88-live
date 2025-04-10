import { Button, Flex, Form, Image, Input } from "antd";
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";
import { GoShieldCheck } from "react-icons/go";
import { useAuth } from "../contexts/AuthContext";
import useRecaptcha from "../hooks/useRecaptcha";
import { GoogleAuthProvider } from "../contexts/GoogleAuthContext";
import { useModal } from "./CompoundModal";
import ForgotPassword from "./ForgotPassword";
import LogoImg from "../assets/logo.png";

export const inputStyle = `h-12 rounded-lg 
input-gradient-bg border-[2px] !border-[var(--color-brand-primary)] 
focus:shadow-none focus:outline-none 
focus:!shadow-[0px_1px_6.9px_0px_rgba(38,168,223,0.55)] 
focus-within:!shadow-[0px_1px_6.9px_0px_rgba(38,168,223,0.55)]`;

export default function LoginForm() {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { recaptcha, validateCaptcha } = useRecaptcha();
  const { closeModal } = useModal();

  const onFinish = async (values) => {
    try {
      const res = await login(values);
      if (res?.status === 200) {
        closeModal();
      }
      form.resetFields();
    } catch (error) {
      console.error("Error in login:", error);
    }
  };

  return (
    <div className="rounded-2xl py-3 md:px-3 px-1 w-full">
      <div className="flex flex-col justify-center items-center mb-8">
        <Image preview={false} src={LogoImg} alt="logo" loading="lazy" />
      </div>
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="w-full"
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Hãy nhập tên tài khoản!" }]}
        >
          <Input
            autoComplete="new-username"
            placeholder="Nhập tài khoản"
            className={inputStyle}
            prefix={<FaRegUser className="text-[var(--color-brand-primary)]" />}
            classNames={{
              input: "",
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
        >
          <Input.Password
            autoComplete="new-password"
            placeholder="Nhập mật khẩu"
            className={inputStyle}
            prefix={
              <RiLockPasswordLine className="text-[var(--color-brand-primary)]" />
            }
            iconRender={(visible) =>
              visible ? <FaRegEye /> : <FaRegEyeSlash />
            }
          />
        </Form.Item>

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
              prefix={
                <GoShieldCheck className="text-[var(--color-brand-primary)]" />
              }
              suffix={
                <div className="py-1 px-2 rounded-lg bg-[#879497] tracking-widest text-white font-bold">
                  {recaptcha}
                </div>
              }
            />
          </div>
        </Form.Item>

        <Form.Item className="mb-2">
          <div className="flex justify-end items-center">
            {/* <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-300">Lưu mật khẩu</Checkbox>
            </Form.Item> */}
            <ForgotPassword />
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)] shadow-none border-none rounded-lg text-lg font-medium"
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <div className="text-center text-black">
          Bạn chưa có tài khoản?{" "}
          <span
            className="text-[var(--color-brand-primary)] font-bold cursor-pointer"
            onClick={() => {
              document.getElementById("signup-button")?.click();
              closeModal();
            }}
          >
            Đăng ký ngay
          </span>
        </div>
      </Form>
      <Flex gap={8} justify="center" items="center" className="w-full my-6">
        <div className="w-[30%] h-[0.5px] my-3 bg-[var(--color-brand-primary)]"></div>
        <p className="px-2 text-center">Hoặc đăng nhập với</p>
        <div className="w-[30%] h-[0.5px] my-3 bg-[var(--color-brand-primary)]"></div>
      </Flex>
      <Flex className="w-full" justify="center">
        <GoogleAuthProvider.GoogleLoginButton />
      </Flex>
    </div>
  );
}
