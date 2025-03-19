import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateLivestreamConfig } from "../services/livestreamConfigAPI";

export default function useLiveStreamConfigUpdate() {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateLivestreamConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestream-config"] });
      toast.success("Cập nhật cấu hình livestream thành công!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in updateLivestreamConfig:", error);
    },
  });

  return { mutate, isLoading };
}
