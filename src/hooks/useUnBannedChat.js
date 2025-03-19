import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { unBannedChat } from "../services/livestreamAPI";
export default function useUnBannedChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unBannedChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banned-chat"] });
      toast.success("Đã mở khóa chat thành công!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error in unbanChat:", error);
    },
  });
}
