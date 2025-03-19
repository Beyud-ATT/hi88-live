import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getNews } from "../services/homeAPI";

export default function useHomeNews() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["home-news"],
    queryFn: getNews,
  });

  if (isError) {
    toast.error(error.response.data.message);
  }

  return { data, isLoading };
}
