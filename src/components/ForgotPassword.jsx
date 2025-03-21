import { Button, Form, Input, Typography } from "antd";
import { CompoundModal, useModal } from "./CompoundModal";
import useForgotPassword from "../hooks/useForgotPassword";

function PasswordForgotForm() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const { closeModal } = useModal();

  const handleFinish = (values) => {
    forgotPassword(values, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return (
    <Form onFinish={handleFinish}>
      <Typography.Title
        level={3}
        className="!text-[var(--color-brand-primary)] lg:text-left text-center lg:!mb-4"
      >
        Nhập email để thay đổi mật khẩu
      </Typography.Title>
      <Form.Item name="email">
        <Input
          placeholder="Email"
          className="h-12 bg-white/10 hover:bg-white/20 focus:bg-white/20 border border-gray-600 rounded-lg"
        />
      </Form.Item>
      <Form.Item className="flex w-full justify-end">
        <Button
          variant="primary"
          htmlType="submit"
          className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] disabled:bg-[var(--color-brand-primary)] text-white"
          disabled={isPending}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
export default function ForgotPassword() {
  return (
    <CompoundModal>
      <CompoundModal.Trigger
        render={(openModal) => (
          <button
            type="button"
            id="signup-button"
            className="text-[var(--color-brand-primary)]"
            onClick={openModal}
          >
            Quên mật khẩu
          </button>
        )}
      />
      <CompoundModal.Content
        className="md:!bg-[url('/src/assets/login-bg.png')] !bg-[url('/src/assets/mobile-bg.png')] !bg-cover !bg-top !bg-no-repeat border-[2px] border-[var(--color-brand-primary)] !rounded-[30px] !pb-0"
        classNames={{
          content: "!rounded-3xl !bg-transparent",
          body: "mt-8",
          mask: "backdrop-blur-md",
        }}
        centered={true}
      >
        <PasswordForgotForm />
      </CompoundModal.Content>
    </CompoundModal>
  );
}
