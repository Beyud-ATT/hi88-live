import { toast } from "react-toastify";
import { getLivestreamConfig } from "../services/livestreamConfigAPI";
import { useQuery } from "@tanstack/react-query";

export default function useLivestreamConfig() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["livestream-config"],
    queryFn: getLivestreamConfig,
    // staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    toast.error(error.response.data.message);
  }

  return { data, isLoading };
}
