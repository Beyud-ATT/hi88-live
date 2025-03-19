import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBannedChat } from "../services/livestreamAPI";
import { toast } from "react-toastify";
export default function useAddBannedChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBannedChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banned-chat"] });
      toast.success("Thêm vào danh sách chặn thành công!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error in addBannedChat:", error);
    },
  });
}
