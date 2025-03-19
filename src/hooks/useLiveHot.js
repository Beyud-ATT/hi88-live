import { useQuery } from "@tanstack/react-query";
import { getHotLivestreams } from "../services/livestreamAPI";
import { toast } from "react-toastify";

export default function useLiveHot() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["live-hot"],
    queryFn: getHotLivestreams,
    // staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    toast.error(error.response.data.message);
  }

  return { data, isLoading };
}
