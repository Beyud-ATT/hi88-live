import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { changePassword } from "../services/accountAPI";

export default function useChangePassword() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      queryClient.invalidateQueries(["account"]);
      logout();
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in changePassword:", error);
    },
  });
}
