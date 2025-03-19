import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewLiveSession } from "../services/livestreamAPI";
import { toast } from "react-toastify";

export default function useLivestreamConfigCreateLiveSession() {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => createNewLiveSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestream-config"] });
      toast.success("Tạo live session thành công!");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error("Error in createNewLiveSession:", error);
    },
  });

  return { mutate, isLoading };
}
