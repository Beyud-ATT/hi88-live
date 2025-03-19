import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLivestreamConfig } from "../services/livestreamConfigAPI";
import { toast } from "react-toastify";

export default function useLivestreamKeyCreate() {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: createLivestreamConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestream-config"] });
      toast.success("Tạo cấu hình livestream thành công!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in updateLivestreamConfig:", error);
    },
  });

  return { mutate, isLoading };
}
