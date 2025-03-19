import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { idolRate } from "../services/livestreamAPI";

export default function useIdolRate() {
  return useMutation({
    mutationFn: idolRate,
    onSuccess: () => {
      toast.success("Đánh giá thành công!!!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Đánh giá thất bại!!!");
    },
  });
}
