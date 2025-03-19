import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getBannedChatList } from "../services/livestreamAPI";
import { useAuth } from "../contexts/AuthContext";

export default function useBannedChat() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["banned-chat"],
    queryFn: getBannedChatList,
    enabled: isAuthenticated,
  });

  if (isError) {
    toast.error(error.response.data.message);
  }

  return { data, isLoading };
}
