import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateLivestreamKey } from "../services/livestreamConfigAPI";

export default function useLivestreamKeyUpdate() {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateLivestreamKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestream-config"] });
      toast.success("Cập nhật cấu hình livestream key thành công!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in updateLivestreamKey:", error);
    },
  });

  return { mutate, isLoading };
}
