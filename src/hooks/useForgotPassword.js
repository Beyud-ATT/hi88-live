import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/authAPI";
import { toast } from "react-toastify";

export default function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Gửi mail đặt lại mật khẩu thành công!");
    },
    onError: (error) => {
      console.error("Error in forgotPassword:", error);
    },
  });
}
