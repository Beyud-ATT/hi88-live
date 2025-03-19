import { useMutation } from "@tanstack/react-query";
import { checkChat } from "../services/livestreamAPI";
import { toast } from "react-toastify";

export default function useCheckChat() {
  return useMutation({
    mutationFn: checkChat,
    onSuccess: () => {
      toast.success("Kiểm tra thành công!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in useCheckChat:", error);
    },
  });
}
