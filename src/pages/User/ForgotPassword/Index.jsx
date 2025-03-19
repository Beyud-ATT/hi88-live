import { Form, Input, Button, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import useChangePassword from "../../../hooks/useChangePassword";

const { Title, Text } = Typography;

const ChangePasswordForm = () => {
  const [form] = Form.useForm();
  const { mutate: changePassword } = useChangePassword();

  const handleFinish = (values) => {
    try {
      changePassword(values);
    } catch (error) {
      console.error("Error in changePassword:", error);
    }
  };

  return (
    <>
      <Title
        level={2}
        className="!text-[var(--color-brand-primary)] lg:text-left text-center lg:!mb-4"
      >
        Đổi mật khẩu
      </Title>
      <div className="md:w-[80%] w-full h-full pb-10 rounded-lg lg:mx-0 mx-auto">
        <div className="max-w-md mx-auto md:bg-[var(--user-form-bg)] md:p-6 px-4 shadow-md rounded-xl md:border-[2px] border-[var(--border-color)]">
          <Text className="block text-center mb-6">
            Hãy nhập thông tin để lấy lại mật khẩu của bạn
          </Text>
          <Form
            id="change-password-form"
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="space-y-4"
          >
            <Form.Item
              className="!m-0"
              name="oldPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu cũ"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận lại mật khẩu!" },
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
                placeholder="Xác nhận lại mật khẩu mới"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[var(--color-brand-primary)] hover:!bg-[var(--color-brand-primary)] border-none w-full"
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
