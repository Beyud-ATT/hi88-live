import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "../services/accountAPI";
import { toast } from "react-toastify";

export default function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      toast.success("Cập nhật tài khoản thành công!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in updateAccount:", error);
    },
  });
}
