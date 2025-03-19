import { Avatar, Flex } from "antd";
import { RxAvatar } from "react-icons/rx";
import useAccount from "../hooks/useAccount";

export default function UserAvatar(props) {
  const { data: account } = useAccount();
  const accountData = account?.data?.data;

  return (
    <div className="flex justify-center items-center gap-2">
      <p className="text-[var(--color-brand-primary)] font-bold md:block hidden">
        {accountData?.username}
      </p>
      <Avatar
        size={46}
        icon={<RxAvatar />}
        src={accountData?.avatar}
        {...props}
      />
    </div>
  );
}
