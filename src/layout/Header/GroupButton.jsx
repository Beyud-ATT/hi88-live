import { Button, Flex } from "antd";
import { CompoundModal } from "../../components/CompoundModal";
import LoginForm from "../../components/LoginForm";
import SignUpForm from "../../components/SignUpForm";
import { useAuth } from "../../contexts/AuthContext";

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
            className="border-[2px] border-[#C0C0C0] !rounded-3xl pb-0 !bg-transparent"
            classNames={{
              content: "!rounded-3xl !bg-transparent",
            }}
            style={{
              background:
                "radial-gradient(71.52% 71.52% at 50% 100%, #58F8FE 0%, #FFF 100%)",
            }}
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
            className="border-[2px] border-[#C0C0C0] !rounded-3xl pb-0 !bg-transparent"
            classNames={{
              content: "!rounded-3xl !bg-transparent",
            }}
            style={{
              background:
                "radial-gradient(71.52% 71.52% at 50% 100%, #58F8FE 0%, #FFF 100%)",
            }}
          >
            <SignUpForm />
          </CompoundModal.Content>
        </CompoundModal>
      </Flex>
    )
  );
}
