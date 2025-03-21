import { Button, Flex } from "antd";
import { CompoundModal } from "../../components/CompoundModal";
import LoginForm from "../../components/LoginForm";
import SignUpForm from "../../components/SignUpForm";
import { useAuth } from "../../contexts/AuthContext";
import { MdClose } from "react-icons/md";

export default function GroupButton() {
  const { isAuthenticated } = useAuth();

  return (
    !isAuthenticated && (
      <Flex className="md:gap-3 gap-2 md:flex-row flex-col">
        <CompoundModal>
          <CompoundModal.Trigger
            render={(openModal) => (
              <Button
                id="login-button"
                className="!bg-[transparent] !text-[var(--color-brand-primary)] border-[var(--color-brand-primary)] rounded-lg lg:!text-base md:!text-[12px] !text-[10px]"
                onClick={openModal}
              >
                Đăng nhập
              </Button>
            )}
          />
          <CompoundModal.Content
            className="!rounded-3xl pb-0 md:!bg-[url('/src/assets/login-bg.png')] !bg-[url('/src/assets/mobile-bg.png')] md:bg-contain bg-cover bg-center bg-no-repeat"
            classNames={{
              content: "!rounded-3xl !bg-transparent !shadow-none",
            }}
            closeIcon={
              <MdClose className="!text-[var(--color-brand-primary)] text-2xl -translate-x-3" />
            }
          >
            <LoginForm />
          </CompoundModal.Content>
        </CompoundModal>

        <CompoundModal>
          <CompoundModal.Trigger
            render={(openModal) => (
              <Button
                id="signup-button"
                variant="filled"
                className="!bg-[var(--color-brand-primary)] !text-[white] border-none rounded-lg lg:!text-base md:!text-[12px] !text-[10px]"
                onClick={openModal}
              >
                Đăng ký
              </Button>
            )}
          />
          <CompoundModal.Content
            className="!rounded-3xl pb-0 md:!bg-[url('/src/assets/signup-bg.png')] !bg-[url('/src/assets/mobile-bg.png')] md:bg-contain bg-cover bg-center bg-no-repeat"
            classNames={{
              content: "!rounded-3xl !bg-transparent !shadow-none",
            }}
            closeIcon={
              <MdClose className="!text-[var(--color-brand-primary)] text-2xl -translate-x-3" />
            }
          >
            <SignUpForm />
          </CompoundModal.Content>
        </CompoundModal>
      </Flex>
    )
  );
}
